import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { CartStatusEnum } from "../enums/cart-status.enum";

@Entity('tbl_carts')
export class Cart {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
    total: number;

    @Column({
        type: 'text',
        enum: CartStatusEnum,
        default: CartStatusEnum.BUY
    })
    status: CartStatusEnum;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItem[];
}