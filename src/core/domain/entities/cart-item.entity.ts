import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from './item.entity';
import { Cart } from "./cart.entity";

@Entity('tbl_cart_items')
export class CartItem {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;

    @ManyToOne(() => Item)
    item: Item;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column()
    quantity: number;
}