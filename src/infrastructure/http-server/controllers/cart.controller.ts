import { Body, Controller, Get, Inject, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { Cart } from "src/core/domain/entities/cart.entity";
import { ICartService } from "src/core/domain/ports/inbound/cart.service";
import { UpdateCartRequest } from "../model/update-cart.request";
import { TYPES } from "src/core/application/shared/types";

@Controller('carts')
export class CartController {

    constructor(
        @Inject(TYPES.services.CartService)
        private cartService: ICartService
    ) { }

    @Post()
    async createCart(): Promise<Cart> {
        return await this.cartService.createCart();
    }

    @Get('active')
    async getActiveCart(): Promise<Cart> {
        const cart = await this.cartService.getActiveCart();
        if (!cart) {
            throw new NotFoundException('There are no active carts');
        }
        return cart;
    }

    @Get(':id')
    async getCartById(@Param('id') cartId: number): Promise<Cart> {
        
        const cart = await this.cartService.getCartById(cartId);
        if (!cart) {
            throw new NotFoundException(`Cart with ID ${cartId} not found`);
        }
        return cart;
    }

    @Put(':id')
    async updateCart(
        @Param('id') cartId: number, 
        @Body() updateCartRequest: UpdateCartRequest
    ): Promise<Cart> {
        return await this.cartService.updateCart(cartId, updateCartRequest);
    }
}