import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Cart } from "src/core/domain/entities/cart.entity";
import { CartStatusEnum } from "src/core/domain/enums/cart-status.enum";
import { ICartService } from "src/core/domain/ports/inbound/cart.service";
import { IItemService } from "src/core/domain/ports/inbound/item.service";
import { ICartRepository } from "src/core/domain/ports/outbound/cart.repository";
import { UpdateCartRequest } from "src/infrastructure/http-server/model/update-cart.request";
import { TYPES } from "../shared/types";

@Injectable()
export class CartDomainService implements ICartService {

    constructor(
        @Inject(TYPES.adapters.CartRepository)
        private cartRepository: ICartRepository,
        @Inject(TYPES.services.ItemService)
        private itemService: IItemService
    ) { }

    async getActiveCart(): Promise<Cart | null> {
        return await this.activeCart();
    }

    async createCart(): Promise<Cart> {
        await this.verifyNoActiveCart();
        const newCart = new Cart();
        newCart.items = [];
        return await this.cartRepository.save(newCart);
    }

    async getCartById(cartId: number): Promise<Cart> {
        const cart = await this.cartRepository.findById(cartId);
        if (!cart) {
            throw new NotFoundException(`Cart with ID ${cartId} not found`);
        }
        return cart;
    }

    async updateCart(cartId: number, updateData: UpdateCartRequest): Promise<Cart> {
        const cart = await this.cartRepository.findById(cartId);
        if (!cart) {
            throw new NotFoundException(`Cart with ID ${cartId} not found`);
        }
        Object.assign(cart, updateData);
        this.updateOrderDetails(cart, updateData);
        const updatedCart = await this.cartRepository.update(cart);
        if (cart.status === CartStatusEnum.PAID) {
            await this.updateProductStock(cart);
            await this.createNewCartIfNeeded();
        }
        return updatedCart;
    }

    private updateOrderDetails(cart: Cart, updateRequest: UpdateCartRequest) {
        const totalAmount = this.calculateTotalAmount(cart);
        cart.total = totalAmount;
        this.updateCartStatus(cart, updateRequest.isPaymentUpdate);

    }

    private calculateTotalAmount(cart: Cart): number {
        if (cart.items) {
            const calculate = cart.items
                .map(item => item.price)
                .reduce((total, price) => total + price, 0);
            return calculate;
        } else {
            throw new BadRequestException('You must add at least one item to the cart');
        }
    }

    private updateCartStatus(cart: Cart, isPendingPayment: boolean) {
        cart.status = isPendingPayment ? CartStatusEnum.PAID : CartStatusEnum.BUY;
    }

    private async updateProductStock(cart: Cart) {
        for (const cartItem of cart.items) {
            const item = await this.itemService.getItemById(cartItem.item.id);
            if (item.stock < cartItem.quantity) {
                throw new BadRequestException(`Insufficient stock for item: ${item.name}`)
            }

            item.stock -= cartItem.quantity;
            await this.itemService.updateStockItem(item.id, { stock: item.stock });
        }
    }

    private async verifyNoActiveCart(): Promise<void> {
        const activeCart = await this.activeCart();
        if (activeCart) {
            throw new BadRequestException('An active cart already exists');
        }
    }

    private async activeCart(): Promise<Cart | null> {
        return await this.cartRepository.findByStatusIn([CartStatusEnum.BUY]);
    }

    private async createNewCartIfNeeded(): Promise<Cart> {
        const unpaidCarts = await this.cartRepository.findByStatusNot(CartStatusEnum.PAID);
        if (!unpaidCarts || unpaidCarts.length === 0) {
            const newCart = new Cart();
            newCart.items = [];
            return await this.cartRepository.save(newCart);
        }
    }
}