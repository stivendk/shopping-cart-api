import { Test, TestingModule } from '@nestjs/testing';
import { CartDomainService } from './cart.domain.service';
import { ICartRepository } from 'src/core/domain/ports/outbound/cart.repository';
import { IItemService } from 'src/core/domain/ports/inbound/item.service';
import { Cart } from 'src/core/domain/entities/cart.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CartStatusEnum } from 'src/core/domain/enums/cart-status.enum';
import { UpdateCartRequest } from 'src/infrastructure/http-server/model/update-cart.request';
import { TYPES } from '../shared/types';

describe('CartDomainService', () => {
    let service: CartDomainService;
    let cartRepository: jest.Mocked<ICartRepository>;
    let itemService: jest.Mocked<IItemService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartDomainService,
                {
                    provide: TYPES.adapters.CartRepository,
                    useValue: {
                        findById: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        findByStatusIn: jest.fn(),
                        findByStatusNot: jest.fn(),
                    },
                },
                {
                    provide: TYPES.services.ItemService,
                    useValue: {
                        getItemById: jest.fn(),
                        updateStockItem: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CartDomainService>(CartDomainService);
        cartRepository = module.get(TYPES.adapters.CartRepository);
        itemService = module.get(TYPES.services.ItemService);
    });

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getActiveCart', () => {
        it('should return active cart', async () => {
            const activeCart = new Cart();
            activeCart.status = CartStatusEnum.BUY;

            jest.spyOn(cartRepository, 'findByStatusIn').mockResolvedValue(activeCart);

            const result = await service.getActiveCart();
            expect(result).toEqual(activeCart);
        });

        it('should return null if no active cart exists', async () => {
            jest.spyOn(cartRepository, 'findByStatusIn').mockResolvedValue(null);

            const result = await service.getActiveCart();
            expect(result).toBeNull();
        });
    });

    describe('createCart', () => {
        it('should throw ConflictException if active cart exists', async () => {
            jest.spyOn(cartRepository, 'findByStatusIn').mockResolvedValue(new Cart());

            await expect(service.createCart()).rejects.toThrow(BadRequestException);
        });

        it('should create a new cart if no active cart exists', async () => {
            jest.spyOn(cartRepository, 'findByStatusIn').mockResolvedValue(null);
            const newCart = new Cart();
            jest.spyOn(cartRepository, 'save').mockResolvedValue(newCart);

            const result = await service.createCart();
            expect(result).toEqual(newCart);
            expect(cartRepository.save).toHaveBeenCalled();
        });
    });

    describe('getCartById', () => {
        it('should return cart if found', async () => {
            const cartId = 1;
            const cart = new Cart();
            jest.spyOn(cartRepository, 'findById').mockResolvedValue(cart);

            const result = await service.getCartById(cartId);
            expect(result).toEqual(cart);
        });

        it('should throw NotFoundException if cart not found', async () => {
            const cartId = 1;
            jest.spyOn(cartRepository, 'findById').mockResolvedValue(null);

            await expect(service.getCartById(cartId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateCart', () => {

        it('should update cart details and return updated cart', async () => {
            const cartId = 1;
            const updateData: UpdateCartRequest = { isPaymentUpdate: true };
            const cart = new Cart();
            cart.items = [{ id: 1, quantity: 2, price: 50 } as any];
            cart.status = CartStatusEnum.BUY;

            const item = { id: 1, stock: 5 } as any;

            jest.spyOn(cartRepository, 'findById').mockResolvedValue(cart);
            jest.spyOn(itemService, 'getItemById').mockResolvedValue(item);
            jest.spyOn(cartRepository, 'update').mockResolvedValue(cart);

            const updatedCart = await service.updateCart(cartId, updateData);
            expect(cartRepository.update).toHaveBeenCalledWith(cart);
            expect(updatedCart.total).toBe(50);
        });

        it('should throw NotFoundException if cart not found', async () => {
            const cartId = 1;
            jest.spyOn(cartRepository, 'findById').mockResolvedValue(null);
            const updateData: UpdateCartRequest = { isPaymentUpdate: true };

            await expect(service.updateCart(cartId, updateData)).rejects.toThrow(NotFoundException);
        });

        it('should throw error if stock is insufficient', async () => {
            const cartId = 1;
            const updateData: UpdateCartRequest = { isPaymentUpdate: true };
            const cart = new Cart();
            cart.items = [{ id: 1, quantity: 2, price: 50 } as any];
            
            const item = { id: 1, name: 'Test Item', stock: 1 } as any;

            jest.spyOn(cartRepository, 'findById').mockResolvedValue(cart);
            jest.spyOn(itemService, 'getItemById').mockResolvedValue(item);

            await expect(service.updateCart(cartId, updateData)).rejects.toThrow(BadRequestException);
        });
    });
});
