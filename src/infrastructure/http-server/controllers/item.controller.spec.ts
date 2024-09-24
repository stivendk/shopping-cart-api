import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { IItemService } from 'src/core/domain/ports/inbound/item.service';
import { Item } from 'src/core/domain/entities/item.entity';
import { UpdateStockItemRequest } from '../model/update-stock-item.request';
import { NotFoundException } from '@nestjs/common';
import { ItemTypeEnum } from 'src/core/domain/enums/item-type.enum';
import { ItemStatusEnum } from 'src/core/domain/enums/item-status.enum';
import { TYPES } from 'src/core/application/shared/types';

describe('ItemController', () => {
    let itemController: ItemController;
    let itemService: jest.Mocked<IItemService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ItemController],
            providers: [
                {
                    provide: TYPES.services.ItemService,
                    useValue: {
                        getItemById: jest.fn(),
                        getAllItems: jest.fn(),
                        updateStockItem: jest.fn(),
                    },
                },
            ],
        }).compile();

        itemController = module.get<ItemController>(ItemController);
        itemService = module.get('IItemService') as jest.Mocked<IItemService>;
    });

    it('should be defined', () => {
        expect(itemController).toBeDefined();
    });

    describe('getItemById', () => {
        it('should return an item if found', async () => {
            const itemId = 1;
            const mockItem: Item = {
                id: 1,
                name: 'Test Item',
                price: 100.00,
                stock: 10,
                date: new Date(),
                type: ItemTypeEnum.EVENT,
                status: ItemStatusEnum.AVAILABLE,
                urlImage: 'http://example.com'
            };

            jest.spyOn(itemService, 'getItemById').mockResolvedValue(mockItem);

            const result = await itemController.getItemById(itemId);
            expect(result).toEqual(mockItem);
            expect(itemService.getItemById).toHaveBeenCalledWith(itemId);
        });

        it('should throw NotFoundException if item is not found', async () => {
            const itemId = 1;
            jest.spyOn(itemService, 'getItemById').mockRejectedValue(new NotFoundException(`Item with ID ${itemId} not found`));

            await expect(itemController.getItemById(itemId)).rejects.toThrow(NotFoundException);
        });

    });

    describe('getAllItems', () => {
        it('should return an array of items', async () => {
            const mockItems: Item[] = [
                {
                    id: 1,
                    name: 'Test Item 1',
                    price: 100.00,
                    stock: 10,
                    date: new Date(),
                    type: ItemTypeEnum.PRODUCT,
                    status: ItemStatusEnum.AVAILABLE,
                    urlImage: 'http://example.com'
                },
                {
                    id: 2,
                    name: 'Test Item 2',
                    price: 200.00,
                    stock: 5,
                    date: new Date(),
                    type: ItemTypeEnum.PRODUCT,
                    status: ItemStatusEnum.UNAVAILABLE,
                    urlImage: 'http://example.com'
                }
            ];

            jest.spyOn(itemService, 'getAllItems').mockResolvedValue(mockItems);

            const result = await itemController.getAllItems();
            expect(result).toEqual(mockItems);
            expect(itemService.getAllItems).toHaveBeenCalled();
        });
    });

    describe('updateStockItem', () => {
        it('should update and return the item', async () => {
            const itemId = 1;
            const updateStockRequest: UpdateStockItemRequest = { stock: 20 };
            const mockItem: Item = {
                id: 1,
                name: 'Test Item',
                price: 100.00,
                stock: 20,
                date: new Date(),
                type: ItemTypeEnum.PRODUCT,
                status: ItemStatusEnum.AVAILABLE,
                urlImage: 'http://example.com'
            };

            jest.spyOn(itemService, 'updateStockItem').mockResolvedValue(mockItem);

            const result = await itemController.updateStockItem(itemId, updateStockRequest);
            expect(result).toEqual(mockItem);
            expect(itemService.updateStockItem).toHaveBeenCalledWith(itemId, updateStockRequest);
        });

        it('should throw NotFoundException if item is not found', async () => {
            const itemId = 1;
            const updateStockRequest: UpdateStockItemRequest = { stock: 20 };
            jest.spyOn(itemService, 'updateStockItem').mockRejectedValue(new NotFoundException(`Item with ID ${itemId} not found`));

            await expect(itemController.updateStockItem(itemId, updateStockRequest)).rejects.toThrow(NotFoundException);
        });
    });
});
