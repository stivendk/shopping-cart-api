# API de Carrito de Compras

Esta es una API para gestionar un carrito de compras, construida con NestJS, usando TypeScript y SQLite como base de datos en memoria. La aplicación incluye la gestión de productos, carritos y los ítems dentro de un carrito.

## Tabla de Contenidos
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Despliegue](#despliegue)
- [Uso](#uso)
- [Endpoints y Ejemplos](#endpoints-y-ejemplos)
  - [Items](#items)
  - [Carts](#carts)
  - [Cart Items](#cart-items)

## Requisitos

- Node.js v14 o superior
- npm o yarn como gestor de dependencias

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/stivendk/shopping-cart-api.git
cd shopping-cart-api
```
2. Instala las dependencias necesarias:

```bash
npm install
```

## Despliegue

1. Inicia el servidor de desarrollo:

```bash
npm run start
```

2. El servidor se ejecutará en el puerto 3000. Puedes acceder a la API a través de http://localhost:3000.

### Endpoints y Ejemplos
#### Items

`GET /items/:id`
Obtiene los detalles de un ítem por su ID.

**Request:**

`http://localhost:3000/items/1`

**Response:**

```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "stock": 10,
  "date": "2024-09-22T12:00:00Z",
  "urlImage": "https://example.com/laptop.jpg",
  "type": "ELECTRONICS",
  "status": "AVAILABLE"
}
```

`GET /items`
Obtiene una lista de todos los ítems disponibles.

**Request:**

`http://localhost:3000/items`

**Response:**

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "stock": 10,
    "date": "2024-09-22T12:00:00Z",
    "urlImage": "https://example.com/laptop.jpg",
    "type": "ELECTRONICS",
    "status": "AVAILABLE"
  },
  {
    "id": 2,
    "name": "Smartphone",
    "price": 599.99,
    "stock": 20,
    "date": "2024-09-21T11:00:00Z",
    "urlImage": "https://example.com/phone.jpg",
    "type": "ELECTRONICS",
    "status": "OUT_OF_STOCK"
  }
]
```

`PUT /items/:id`
Actualiza el stock de un ítem.

**Request:**

```bash
curl -X PUT http://localhost:3000/items/1 \
-H "Content-Type: application/json" \
-d '{
  "stock": 15
}'
```
**Response:**

```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "stock": 15,
  "date": "2024-09-22T12:00:00Z",
  "urlImage": "https://example.com/laptop.jpg",
  "type": "ELECTRONICS",
  "status": "AVAILABLE"
}
```

#### Carts
`POST /carts`
Crea un nuevo carrito.

**Request:**

```bash
http://localhost:3000/carts
```

**Response:**

```json
{
  "id": 1,
  "total": 0.00,
  "status": "BUY",
  "createdAt": "2024-09-24T12:34:56Z",
  "updatedAt": "2024-09-24T12:34:56Z",
  "items": []
}
```

`GET /carts/active`
Obtiene el carrito activo.

**Request:**

```bash
http://localhost:3000/carts/active
```

**Response:**

```json
{
  "id": 1,
  "total": 1200.99,
  "status": "BUY",
  "createdAt": "2024-09-24T12:34:56Z",
  "updatedAt": "2024-09-24T13:00:00Z",
  "items": [
    {
      "id": 1,
      "item": {
        "id": 1,
        "name": "Laptop",
        "price": 999.99,
        "urlImage": "https://example.com/laptop.jpg"
      },
      "quantity": 1,
      "price": 999.99
    },
    {
      "id": 2,
      "item": {
        "id": 2,
        "name": "Smartphone",
        "price": 599.99,
        "urlImage": "https://example.com/phone.jpg"
      },
      "quantity": 1,
      "price": 599.99
    }
  ]
}
```

`PUT /carts/:id`
Actualiza el carrito.

**Request:**

```bash
curl -X PUT http://localhost:3000/carts/1 \
-H "Content-Type: application/json" \
-d '{
  "isPaymentUpdate": true
}'
```

**Response:**

```json
{
  "id": 1,
  "total": 1600.98,
  "status": "PAID",
  "createdAt": "2024-09-24T12:34:56Z",
  "updatedAt": "2024-09-24T13:30:00Z",
  "items": [
    {
      "id": 1,
      "item": {
        "id": 1,
        "name": "Laptop",
        "price": 999.99,
        "urlImage": "https://example.com/laptop.jpg"
      },
      "quantity": 1,
      "price": 999.99
    },
    {
      "id": 2,
      "item": {
        "id": 2,
        "name": "Smartphone",
        "price": 599.99,
        "urlImage": "https://example.com/phone.jpg"
      },
      "quantity": 1,
      "price": 599.99
    }
  ]
}
```

#### Cart Items
`POST /cart-items`
Agrega un ítem al carrito.

**Request:**

```bash
curl -X POST http://localhost:3000/cart-items \
-H "Content-Type: application/json" \
-d '{
  "itemId": 1,
  "cartId": 1,
  "quantity": 2
}'
```

**Response:**

```json
{
  "id": 1,
  "cart": {
    "id": 1
  },
  "item": {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "urlImage": "https://example.com/laptop.jpg"
  },
  "price": 1999.98,
  "quantity": 2
}
```

`GET /cart-items/cart/:id`
Obtiene todos los ítems de un carrito por el ID del carrito.

**Request:**

```bash
 http://localhost:3000/cart-items/cart/1
```

**Response:**

```json
[
  {
    "id": 1,
    "item": {
      "id": 1,
      "name": "Laptop",
      "price": 999.99,
      "urlImage": "https://example.com/laptop.jpg"
    },
    "quantity": 2,
    "price": 1999.98
  }
]
```

`DELETE /cart-items/:id`
Elimina un ítem de un carrito.

**Request:**

```bash
 DELETE http://localhost:3000/cart-items/1
```

**Response:**

```json
{
  "message": "Cart item deleted successfully"
}
```