import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ICartRepository } from '../../core/domain/ports/outbound/cart.repository';
import { Cart } from 'src/core/domain/entities/cart.entity';
import { CartStatusEnum } from 'src/core/domain/enums/cart-status.enum';

@Injectable()
export class CartRepository implements ICartRepository {

    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>
    ) { }
    
    async findByStatusNot(status: CartStatusEnum): Promise<Cart[]> {
        const result = await this.cartRepository.find({
            where: {
                status: Not(status),
            },
        });
        return result;
    }

    async findByStatusIn(statuses: CartStatusEnum[]): Promise<Cart | null> {
        const result = await this.cartRepository.findOne({
            where: statuses.map((status) => ({ status })),
            relations: ['items', 'items.item']
        });
        return result;
    }

    async save(cart: Cart): Promise<Cart> {
        return await this.cartRepository.save(cart);
    }

    async findById(cartId: number): Promise<Cart | null> {
        return await this.cartRepository.findOne({ 
            where: {id: cartId},
            relations: ['items', 'items.item']
        });
    }

    async update(cart: Cart): Promise<Cart> {
        return await this.cartRepository.save(cart);
    }

}