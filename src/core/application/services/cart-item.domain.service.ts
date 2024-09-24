import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CartItem } from "src/core/domain/entities/cart-item.entity";
import { Cart } from "src/core/domain/entities/cart.entity";
import { Item } from "src/core/domain/entities/item.entity";
import { ICartItemService } from "src/core/domain/ports/inbound/cart-item.service";
import { ICartService } from "src/core/domain/ports/inbound/cart.service";
import { IItemService } from "src/core/domain/ports/inbound/item.service";
import { ICartItemRepository } from "src/core/domain/ports/outbound/cart-item.repository";
import { AddCartItem } from "src/infrastructure/http-server/model/add-cart-item.request";
import { UpdateCartItemRequest } from "src/infrastructure/http-server/model/update-cart-item.request";
import { TYPES } from "../shared/types";

@Injectable()
export class CartItemDomainService implements ICartItemService {

    constructor(
        @Inject(TYPES.adapters.CartItemRepository)
        private cartItemRepository: ICartItemRepository,
        @Inject(TYPES.services.ItemService)
        private itemService: IItemService,
        @Inject(TYPES.services.CartService)
        private cartService: ICartService
    ) { }

    async createCartItem(addCartItem: AddCartItem): Promise<CartItem> {
        const cart = await this.findCartById(addCartItem.cartId);
        const item = await this.findItemById(addCartItem.itemId);
        const cartItem = await this.findOrCreateCartItem(cart, item, addCartItem)
        return await this.cartItemRepository.save(cartItem);

    }

    async getCartItemById(cartItemId: number): Promise<CartItem> {
        return await this.cartItemRepository.findById(cartItemId);
    }

    async getCartItemsByCartId(cartId: number): Promise<CartItem[]> {
        return await this.cartItemRepository.findByCartId(cartId);
    }

    async updateCartItem(cartItemId: number, updateRequest: UpdateCartItemRequest): Promise<CartItem> {
        const cartItem = await this.getCartItemById(cartItemId);
        const item = await this.findItemById(updateRequest.itemId);

        await this.validateStockAvailability(updateRequest.quantity, item);

        cartItem.quantity = updateRequest.quantity;
        cartItem.price = await this.calculateSubTotalPrice(updateRequest.quantity, item.id);

        return this.cartItemRepository.update(cartItem);

    }

    async deleteCartItem(cartItemId: number): Promise<void> {
        const cartItem = await this.getCartItemById(cartItemId);
        this.cartItemRepository.delete(cartItem.id);
    }

    private async findCartById(cardId: number): Promise<Cart> {
        return await this.cartService.getCartById(cardId);
    }

    private async findItemById(itemId: number): Promise<Item> {
        return await this.itemService.getItemById(itemId);
    }

    private async findOrCreateCartItem(cart: Cart, item: Item, request: AddCartItem): Promise<CartItem> {
        const existingCatItem = await this.cartItemRepository.findByItemIdAndCartId(cart.id, item.id);

        if (existingCatItem) {
            return this.updateExistingCartItem(existingCatItem, item, request);
        } else {
            return this.createNewCartItem(cart, item, request);
        }
    }

    private async updateExistingCartItem(existingCartItem: CartItem, item: Item, request: AddCartItem): Promise<CartItem> {
        existingCartItem.quantity += request.quantity;
        await this.validateStockAvailability(existingCartItem.quantity, item);
        existingCartItem.price = await this.calculateSubTotalPrice(existingCartItem.quantity, item.id);
        return existingCartItem;
    }

    private async createNewCartItem(cart: Cart, item: Item, request: AddCartItem): Promise<CartItem> {
        await this.validateStockAvailability(request.quantity, item);
        const newCartItem = new CartItem();
        newCartItem.cart = cart;
        newCartItem.item = item;
        newCartItem.quantity = request.quantity;
        newCartItem.price = await this.calculateSubTotalPrice(request.quantity, item.id);
        return this.cartItemRepository.save(newCartItem);
    }

    private async validateStockAvailability(quantity: number, item: Item) {
        const foundItem = await this.itemService.getItemById(item.id);
        if (foundItem.stock < quantity) {
            throw new BadRequestException(`Insuficient stock for item: ${foundItem.name}`);
        }
    }

    private async calculateSubTotalPrice(quantity: number, itemId: number): Promise<number> {
        const item = await this.itemService.getItemById(itemId);
        const result = item.price * quantity;
        return parseFloat(result.toFixed(2));
    }
}