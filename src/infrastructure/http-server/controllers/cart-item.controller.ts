import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { ICartItemService } from "src/core/domain/ports/inbound/cart-item.service";
import { AddCartItem } from "../model/add-cart-item.request";
import { CartItem } from "src/core/domain/entities/cart-item.entity";
import { UpdateCartItemRequest } from "../model/update-cart-item.request";
import { TYPES } from "src/core/application/shared/types";

@Controller('cart-items')
export class CartItemController {

    constructor(
        @Inject(TYPES.services.CartItemService)
        private cartItemService: ICartItemService
    ) { }

    @Post()
    async createCartItem(@Body() addCartItem: AddCartItem): Promise<CartItem> {
        try {
            return await this.cartItemService.createCartItem(addCartItem);
        } catch (error) {
            throw new NotFoundException('Error creating cart item: ' + error.message);
        }
    }

    @Get('/cart/:id')
    async getCartItemByCartId(@Param('id') cartId: number): Promise<CartItem[]> {
        try {
            return await this.cartItemService.getCartItemsByCartId(cartId);
        } catch (error) {
            throw new NotFoundException(`Cart with ID ${cartId} not found`);
        }
    }

    @Get(':id')
    async getCartItemById(@Param('id') cartItemId: number): Promise<CartItem> {
        try {
            return await this.cartItemService.getCartItemById(cartItemId);
        } catch (error) {
            throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
        }
    }

    @Put(':id')
    async updateCartItem(
        @Param('id') cartItemId: number,
        @Body() updateCartItemRequest: UpdateCartItemRequest
    ): Promise<CartItem> {
        try {
            return await this.cartItemService.updateCartItem(cartItemId, updateCartItemRequest);
        } catch (error) {
            throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
        }
    }

    @Delete(':id')
    async deleteCartItem(@Param('id') cartItemId: number): Promise<void> {
        try {
            await this.cartItemService.deleteCartItem(cartItemId);
        } catch (error) {
            throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
        }
    }
}