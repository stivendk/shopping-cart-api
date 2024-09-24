import { Item } from "../../entities/item.entity";

export interface IItemRepository {
    findById(itemId: number): Promise<Item | null>;
    findAll(): Promise<Item[]>;
    update(item: Item): Promise<Item>;
  }