import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { Cart } from 'src/core/domain/entities/cart.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateCartRequest } from '../model/update-cart.request';
import { ICartService } from 'src/core/domain/ports/inbound/cart.service';
import { TYPES } from 'src/core/application/shared/types';

describe('CartController', () => {
  let cartController: CartController;
  let cartService: jest.Mocked<ICartService>;

  beforeEach(async () => {
    const mockCartService = {
      createCart: jest.fn().mockResolvedValue(new Cart()),
      getCartById: jest.fn().mockResolvedValue(null),
      getActiveCart: jest.fn().mockResolvedValue(null),
      updateCart: jest.fn().mockResolvedValue(new Cart()),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: TYPES.services.CartService, 
          useValue: mockCartService,
        },
      ],
    }).compile();

    cartController = module.get<CartController>(CartController);
    cartService = module.get('ICartService'); 
  });

  it('should be defined', () => {
    expect(cartController).toBeDefined();
  });

  it('should create a cart', async () => {
    const result = await cartController.createCart();
    expect(cartService.createCart).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Cart);
  });

  it('should return a cart by id', async () => {
    cartService.getCartById.mockResolvedValueOnce(new Cart());
    const result = await cartController.getCartById(1);
    expect(cartService.getCartById).toHaveBeenCalledWith(1);
    expect(result).toBeInstanceOf(Cart);
  });

  it('should throw NotFoundException if cart not found', async () => {
    cartService.getCartById.mockResolvedValueOnce(null);
    await expect(cartController.getCartById(1)).rejects.toThrow(NotFoundException);
  });
  
  it('should return a cart active', async () => {
    cartService.getActiveCart.mockResolvedValueOnce(new Cart());
    const result = await cartController.getActiveCart();
    expect(cartService.getActiveCart).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Cart);
  });

  it('should throw NotFoundException if no there are carts active', async () => {
    cartService.getActiveCart.mockResolvedValueOnce(null);
    await expect(cartController.getActiveCart()).rejects.toThrow(NotFoundException);
  });

  it('should update a cart', async () => {
    const updateData: UpdateCartRequest = { isPaymentUpdate: true };
    const result = await cartController.updateCart(1, updateData);
    expect(cartService.updateCart).toHaveBeenCalledWith(1, updateData);
    expect(result).toBeInstanceOf(Cart);
  });
});
