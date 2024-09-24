import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ItemTypeEnum } from "../enums/item-type.enum";
import { ItemStatusEnum } from "../enums/item-status.enum";

@Entity('tbl_items')
export class Item {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column()
    stock: number;

    @Column({ type: 'datetime', nullable: true })
    date: Date;

    @Column({ name: 'url_image', type: 'text' })
    urlImage: string;

    @Column({
        type: 'text',
        enum: ItemTypeEnum
    })
    type: ItemTypeEnum

    @Column({
        type: 'text',
        enum: ItemStatusEnum
    })
    status: ItemStatusEnum;
}