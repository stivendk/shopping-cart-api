import { Test, TestingModule } from '@nestjs/testing';
import { ItemRepository } from 'src/infrastructure/adapters/item.repository.adapter';
import { NotFoundException } from '@nestjs/common';
import { Item } from 'src/core/domain/entities/item.entity';
import { UpdateStockItemRequest } from 'src/infrastructure/http-server/model/update-stock-item.request';
import { ItemStatusEnum } from 'src/core/domain/enums/item-status.enum';
import { ItemDomainService } from './item.domain.service';
import { ItemTypeEnum } from 'src/core/domain/enums/item-type.enum';
import { IItemRepository } from 'src/core/domain/ports/outbound/item.repository';
import { TYPES } from '../shared/types';

describe('ItemDomainService', () => {
    let itemService: ItemDomainService;
    let itemRepository: jest.Mocked<IItemRepository>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ItemDomainService,
          {
            provide: TYPES.adapters.ItemRepository,
            useValue: {
              findById: jest.fn(),
              findAll: jest.fn(),
              update: jest.fn(),
            },
          },
        ],
      }).compile();
  
      itemService = module.get<ItemDomainService>(ItemDomainService);
      itemRepository = module.get('IItemRepository');
    });
  
    it('should be defined', () => {
      expect(itemService).toBeDefined();
    });
  
    describe('getItemById', () => {
      it('should return an item if found', async () => {
        const itemId = 1;
        const mockItem = new Item();
        mockItem.id = itemId;
        mockItem.name = 'Test Item';
        mockItem.price = 100;
        mockItem.stock = 10;
        mockItem.date = new Date();
        mockItem.type = ItemTypeEnum.EVENT;
        mockItem.status = ItemStatusEnum.AVAILABLE;
  
        jest.spyOn(itemRepository, 'findById').mockResolvedValue(mockItem);
  
        const result = await itemService.getItemById(itemId);
        expect(result).toEqual(mockItem);
        expect(itemRepository.findById).toHaveBeenCalledWith(itemId);
      });
  
      it('should throw NotFoundException if item is not found', async () => {
        const itemId = 1;
  
        jest.spyOn(itemRepository, 'findById').mockResolvedValue(null);
  
        await expect(itemService.getItemById(itemId)).rejects.toThrow(NotFoundException);
        expect(itemRepository.findById).toHaveBeenCalledWith(itemId);
      });
    });
  
    describe('getAllItems', () => {
      it('should return an array of items', async () => {
        const mockItems: Item[] = [
          {
            id: 1,
            name: 'Test Item 1',
            price: 100,
            stock: 10,
            date: new Date(),
            type: ItemTypeEnum.PRODUCT,
            status: ItemStatusEnum.AVAILABLE,
            urlImage: 'http://example.com'
          },
          {
            id: 2,
            name: 'Test Item 2',
            price: 200,
            stock: 5,
            date: new Date(),
            type: ItemTypeEnum.PRODUCT,
            status: ItemStatusEnum.UNAVAILABLE,
            urlImage: 'http://example.com'
          },
        ];
  
        jest.spyOn(itemRepository, 'findAll').mockResolvedValue(mockItems);
  
        const result = await itemService.getAllItems();
        expect(result).toEqual(mockItems);
        expect(itemRepository.findAll).toHaveBeenCalled();
      });
    });
  
    describe('updateStockItem', () => {
      it('should update the stock and return the updated item', async () => {
        const itemId = 1;
        const mockItem = new Item();
        mockItem.id = itemId;
        mockItem.name = 'Test Item';
        mockItem.price = 100;
        mockItem.stock = 10;
        mockItem.date = new Date();
        mockItem.type = ItemTypeEnum.PRODUCT;
        mockItem.status = ItemStatusEnum.AVAILABLE;
  
        const updateStockRequest: UpdateStockItemRequest = {
          stock: 5,
        };
  
        const updatedItem = { ...mockItem, stock: 5, status: ItemStatusEnum.AVAILABLE };
  
        jest.spyOn(itemRepository, 'findById').mockResolvedValue(mockItem);
        jest.spyOn(itemRepository, 'update').mockResolvedValue(updatedItem);
  
        const result = await itemService.updateStockItem(itemId, updateStockRequest);
        expect(result).toEqual(updatedItem);
        expect(itemRepository.findById).toHaveBeenCalledWith(itemId);
        expect(itemRepository.update).toHaveBeenCalledWith(updatedItem);
      });
  
      it('should throw NotFoundException if item is not found', async () => {
        const itemId = 1;
        const updateStockRequest: UpdateStockItemRequest = { stock: 5 };
  
        jest.spyOn(itemRepository, 'findById').mockResolvedValue(null);
  
        await expect(itemService.updateStockItem(itemId, updateStockRequest)).rejects.toThrow(NotFoundException);
        expect(itemRepository.findById).toHaveBeenCalledWith(itemId);
      });
  
      it('should update item status to UNAVAILABLE if stock is 0 or less', async () => {
        const itemId = 1;
        const mockItem = new Item();
        mockItem.id = itemId;
        mockItem.name = 'Test Item';
        mockItem.price = 100;
        mockItem.stock = 10;
        mockItem.date = new Date();
        mockItem.type = ItemTypeEnum.EVENT;
        mockItem.status = ItemStatusEnum.AVAILABLE;
  
        const updateStockRequest: UpdateStockItemRequest = {
          stock: 0,
        };
  
        const updatedItem = { ...mockItem, stock: 0, status: ItemStatusEnum.UNAVAILABLE };
  
        jest.spyOn(itemRepository, 'findById').mockResolvedValue(mockItem);
        jest.spyOn(itemRepository, 'update').mockResolvedValue(updatedItem);
  
        const result = await itemService.updateStockItem(itemId, updateStockRequest);
        expect(result.status).toBe(ItemStatusEnum.UNAVAILABLE);
        expect(itemRepository.update).toHaveBeenCalledWith(updatedItem);
      });
    });
  });
