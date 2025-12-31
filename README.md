# Mesa Fresh

A restaurant management system API built with Express.js, Prisma, and PostgreSQL.

## Features

- **User Management** - Authentication, roles, and staff invitations
- **Location Management** - Multi-location support for restaurant chains
- **Menu Management** - Menu items, ingredients, and addons
- **Inventory Tracking** - Real-time ingredient tracking with precise quantity management
- **Order Processing** - Complete order lifecycle from creation to completion
- **Payment Processing** - Support for POS, Transfer, and Cash payments
- **File Uploads** - AWS S3 integration for image uploads

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Validation**: Zod
- **File Storage**: AWS S3
- **File Uploads**: Multer



## API Endpoints

### Authentication
- `POST /auth/signup`
- `POST /auth/login`

### Locations
- `POST /locations`
- `GET /locations`

### Menus
- `POST /locations/:locationId/menus`
- `GET /locations/:locationId/menus`

### Orders
- `POST /locations/:locationId/orders`
- `GET /locations/:locationId/orders`
- `PATCH /locations/:locationId/:orderId/status`
- `PATCH /locations/:locationId/:orderId/cancel`
- `PATCH /locations/:locationId/:orderId/payment`

### Staff
- `POST /staff/invite`
- `GET /staff`

## Project Structure

```
backend/
├── src/
│   ├── controller/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── schemas/
│   ├── lib/
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── package.json
```
