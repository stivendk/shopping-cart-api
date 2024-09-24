import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "src/core/domain/entities/item.entity";
import { IItemRepository } from "src/core/domain/ports/outbound/item.repository";
import { Repository } from "typeorm";

@Injectable()
export class ItemRepository implements IItemRepository {

    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>
    ) { }

    async findById(itemId: number): Promise<Item | null> {
        return await this.itemRepository.findOneBy({ id: itemId });
    }

    async findAll(): Promise<Item[]> {
        return await this.itemRepository.find();
    }

    async update(item: Item): Promise<Item> {
        return await this.itemRepository.save(item);
    }

}