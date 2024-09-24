import { Test, TestingModule } from '@nestjs/testing';
import { CartItem } from 'src/core/domain/entities/cart-item.entity';
import { Cart } from 'src/core/domain/entities/cart.entity';
import { Item } from 'src/core/domain/entities/item.entity';
import { ICartItemRepository } from 'src/core/domain/ports/outbound/cart-item.repository';
import { IItemService } from 'src/core/domain/ports/inbound/item.service';
import { ICartService } from 'src/core/domain/ports/inbound/cart.service';
import { AddCartItem } from 'src/infrastructure/http-server/model/add-cart-item.request';
import { UpdateCartItemRequest } from 'src/infrastructure/http-server/model/update-cart-item.request';
import { CartItemDomainService } from './cart-item.domain.service';
import { TYPES } from '../shared/types';

describe('CartItemDomainService', () => {
    let service: CartItemDomainService;
    let cartItemRepository: jest.Mocked<ICartItemRepository>;
    let itemService: jest.Mocked<IItemService>;
    let cartService: jest.Mocked<ICartService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartItemDomainService,
                {
                    provide: TYPES.adapters.CartItemRepository,
                    useValue: {
                        findById: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        findByItemIdAndCartId: jest.fn(),
                    },
                },
                {
                    provide: TYPES.services.ItemService,
                    useValue: {
                        getItemById: jest.fn(),
                    },
                },
                {
                    provide: TYPES.services.CartService,
                    useValue: {
                        getCartById: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CartItemDomainService>(CartItemDomainService);
        cartItemRepository = module.get('ICartItemRepository') as jest.Mocked<ICartItemRepository>;
        itemService = module.get('IItemService') as jest.Mocked<IItemService>;
        cartService = module.get('ICartService') as jest.Mocked<ICartService>;
    });

    describe('createCartItem', () => {
        it('should create a new cart item if it does not exist', async () => {
            const addCartItem: AddCartItem = { cartId: 1, itemId: 1, quantity: 2 };
            const cart = new Cart();
            const item = new Item();
            const cartItem = new CartItem();

            cartService.getCartById.mockResolvedValue(cart);
            itemService.getItemById.mockResolvedValue(item);
            cartItemRepository.findByItemIdAndCartId.mockResolvedValue(null);
            cartItemRepository.save.mockResolvedValue(cartItem);

            const result = await service.createCartItem(addCartItem);

            expect(result).toBe(cartItem);
            expect(cartItemRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                cart,
                item,
                quantity: addCartItem.quantity,
                price: expect.any(Number),
            }));
        });
    });

    describe('getCartItemById', () => {
        it('should return a cart item by id', async () => {
            const cartItem = new CartItem();
            cartItemRepository.findById.mockResolvedValue(cartItem);

            const result = await service.getCartItemById(1);

            expect(result).toBe(cartItem);
            expect(cartItemRepository.findById).toHaveBeenCalledWith(1);
        });
    });

    describe('updateCartItem', () => {
        it('should update an existing cart item', async () => {
            const cartItemId = 1;
            const updateRequest: UpdateCartItemRequest = { itemId: 1, quantity: 3 };
            const cartItem = new CartItem();
            const item = new Item();

            itemService.getItemById.mockResolvedValue(item);
            cartItemRepository.findById.mockResolvedValue(cartItem);
            jest.spyOn(service as any, 'calculateSubTotalPrice').mockResolvedValue(30);
            jest.spyOn(service as any, 'validateStockAvailability').mockImplementation();

            await service.updateCartItem(cartItemId, updateRequest);

            expect(cartItem.quantity).toBe(updateRequest.quantity);
            expect(cartItem.price).toBe(30);
            expect(cartItemRepository.update).toHaveBeenCalledWith(cartItem);
        });
    });

    describe('deleteCartItem', () => {
        it('should delete a cart item by id', async () => {
            const cartItem = new CartItem();
            cartItem.id = 1;
            cartItemRepository.findById.mockResolvedValue(cartItem);
            cartItemRepository.delete.mockResolvedValue();

            await service.deleteCartItem(cartItem.id);

            expect(cartItemRepository.delete).toHaveBeenCalledWith(cartItem.id);
        });
    });
});
