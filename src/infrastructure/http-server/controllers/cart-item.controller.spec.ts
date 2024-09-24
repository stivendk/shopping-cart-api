import { Test, TestingModule } from '@nestjs/testing';
import { CartItemController } from './cart-item.controller';
import { ICartItemService } from 'src/core/domain/ports/inbound/cart-item.service';
import { CartItem } from 'src/core/domain/entities/cart-item.entity';
import { AddCartItem } from '../model/add-cart-item.request';
import { UpdateCartItemRequest } from '../model/update-cart-item.request';
import { NotFoundException } from '@nestjs/common';
import { TYPES } from 'src/core/application/shared/types';

describe('CartItemController', () => {
  let cartItemController: CartItemController;
  let cartItemService: jest.Mocked<ICartItemService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [
        {
          provide: TYPES.services.CartItemService,
          useValue: {
            createCartItem: jest.fn(),
            getCartItemById: jest.fn(),
            updateCartItem: jest.fn(),
            deleteCartItem: jest.fn(),
          },
        },
      ],
    }).compile();

    cartItemController = module.get<CartItemController>(CartItemController);
    cartItemService = module.get('ICartItemService') as jest.Mocked<ICartItemService>;
  });

  it('should be defined', () => {
    expect(cartItemController).toBeDefined();
  });

  describe('createCartItem', () => {
    it('should create a cart item and return it', async () => {
      const addCartItem: AddCartItem = { itemId: 1, cartId: 1, quantity: 2 };
      const mockCartItem = new CartItem();
      mockCartItem.id = 1;
      mockCartItem.item = { id: 1 } as any;
      mockCartItem.cart = { id: 1 } as any;
      mockCartItem.quantity = 2;
      mockCartItem.price = 10;

      jest.spyOn(cartItemService, 'createCartItem').mockResolvedValue(mockCartItem);

      const result = await cartItemController.createCartItem(addCartItem);
      expect(result).toEqual(mockCartItem);
      expect(cartItemService.createCartItem).toHaveBeenCalledWith(addCartItem);
    });

    it('should throw NotFoundException if an error occurs', async () => {
      const addCartItem: AddCartItem = { itemId: 1, cartId: 1, quantity: 2 };
      jest.spyOn(cartItemService, 'createCartItem').mockRejectedValue(new Error('Error creating cart item'));

      await expect(cartItemController.createCartItem(addCartItem)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCartItemById', () => {
    it('should return a cart item if found', async () => {
      const cartItemId = 1;
      const mockCartItem = new CartItem();
      mockCartItem.id = 1;
      mockCartItem.item = { id: 1 } as any;
      mockCartItem.cart = { id: 1 } as any;
      mockCartItem.quantity = 2;
      mockCartItem.price = 10;

      jest.spyOn(cartItemService, 'getCartItemById').mockResolvedValue(mockCartItem);

      const result = await cartItemController.getCartItemById(cartItemId);
      expect(result).toEqual(mockCartItem);
      expect(cartItemService.getCartItemById).toHaveBeenCalledWith(cartItemId);
    });

    it('should throw NotFoundException if cart item is not found', async () => {
      const cartItemId = 1;
      jest.spyOn(cartItemService, 'getCartItemById').mockRejectedValue(new Error('Cart item not found'));

      await expect(cartItemController.getCartItemById(cartItemId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCartItem', () => {
    it('should update the cart item', async () => {
      const cartItemId = 1;
      const updateCartItemRequest: UpdateCartItemRequest = { itemId: 1, quantity: 3 };
      const mockCartItem = new CartItem();
      mockCartItem.id = 1;
      mockCartItem.item = { id: 1 } as any;
      mockCartItem.cart = { id: 1 } as any;
      mockCartItem.quantity = 3;
      mockCartItem.price = 10;

      jest.spyOn(cartItemService, 'updateCartItem').mockResolvedValue(mockCartItem);

      await cartItemController.updateCartItem(cartItemId, updateCartItemRequest);
      expect(cartItemService.updateCartItem).toHaveBeenCalledWith(cartItemId, updateCartItemRequest);
    });

    it('should throw NotFoundException if cart item is not found', async () => {
      const cartItemId = 1;
      const updateCartItemRequest: UpdateCartItemRequest = { itemId: 1, quantity: 3 };
      jest.spyOn(cartItemService, 'updateCartItem').mockRejectedValue(new Error('Cart item not found'));

      await expect(cartItemController.updateCartItem(cartItemId, updateCartItemRequest)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCartItem', () => {
    it('should delete the cart item', async () => {
      const cartItemId = 1;

      jest.spyOn(cartItemService, 'deleteCartItem').mockResolvedValue();

      await cartItemController.deleteCartItem(cartItemId);
      expect(cartItemService.deleteCartItem).toHaveBeenCalledWith(cartItemId);
    });

    it('should throw NotFoundException if cart item is not found', async () => {
      const cartItemId = 1;
      jest.spyOn(cartItemService, 'deleteCartItem').mockRejectedValue(new Error('Cart item not found'));

      await expect(cartItemController.deleteCartItem(cartItemId)).rejects.toThrow(NotFoundException);
    });
  });
});
