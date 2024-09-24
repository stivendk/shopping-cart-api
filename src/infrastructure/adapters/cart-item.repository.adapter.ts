import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItem } from "src/core/domain/entities/cart-item.entity";
import { ICartItemRepository } from "src/core/domain/ports/outbound/cart-item.repository";
import { Repository } from "typeorm";

@Injectable()
export class CartItemRepository implements ICartItemRepository {

    constructor(
        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>
    ) { }


    async save(cartItem: CartItem): Promise<CartItem> {
        return await this.cartItemRepository.save(cartItem);
    }

    async findById(cartItemId: number): Promise<CartItem | null> {
        return await this.cartItemRepository.findOneBy({ id: cartItemId });
    }

    async findByItemIdAndCartId(cartId: number, itemId: number): Promise<CartItem | null> {
        return await this.cartItemRepository.findOne({ where: { cart: { id: cartId }, item: { id: itemId } } });
    }

    async findByCartId(cartId: number): Promise<CartItem[]> {
        return await this.cartItemRepository.find({
            where: { cart: { id: cartId } },
            relations: ['item'],
        });
    }

    async update(cartItem: CartItem): Promise<CartItem> {
        return await this.cartItemRepository.save(cartItem);
    }

    async delete(cartItemId: number): Promise<void> {
        await this.cartItemRepository.delete(cartItemId);
    }


}