<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Do Gia Dung - Backend (NestJS + PostgreSQL + TypeORM)

API backend phục vụ xác thực người dùng, quản lý danh mục (categories) và sản phẩm (products), tích hợp Swagger, gửi mail, JWT access/refresh token.

### Công nghệ chính
- NestJS, TypeScript
- PostgreSQL, TypeORM (migrations)
- JWT (access + refresh)
- Swagger UI (tài liệu API)

---

## Cấu trúc thư mục

```text
src/
  app.module.ts
  main.ts
  auth/
    auth.controller.ts
    auth.module.ts
    auth.service.ts
    jwt.guard.ts
    jwt.strategy.ts
    dto/
      login.dto.ts
      register.dto.ts
      refresh-token.dto.ts
  users/
    user.entity.ts
    users.controller.ts
    users.module.ts
    users.service.ts
  categories/
    categories.controller.ts
    categories.module.ts
    categories.service.ts
    category.entity.ts
    dto/
      create-category.dto.ts
      update-category.dto.ts
  products/
    products.controller.ts
    products.module.ts
    products.service.ts
    product.entity.ts
    dto/
      create-product.dto.ts
      update-product.dto.ts
  migrations/
    1762073747329-InitMigration.ts
    1762150000000-CreateProductsAndCategories.ts
  typeorm-cli.config.ts
```

---

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

---

## Yêu cầu môi trường
- Node.js >= 18
- Yarn
- PostgreSQL

Biến môi trường (tùy chọn, có giá trị mặc định trong code):
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `PORT` (mặc định 8080)
- `JWT_SECRET` (mặc định 'SECRET_KEY')
- `JWT_EXPIRES_IN` (mặc định '15m' cho access, '7d' cho refresh – có thể cấu hình riêng trong auth.service.ts nếu muốn)
- `CORS_ORIGINS` (danh sách origin, phân tách bằng dấu phẩy)

---

## Database & Migrations (TypeORM)

DataSource CLI: `src/typeorm-cli.config.ts` (đã khai báo entity và đường dẫn migrations).

Chạy migration:
```bash
# chạy migrations
yarn typeorm-ts-node-commonjs migration:run -d src/typeorm-cli.config.ts

# revert migration cuối
yarn typeorm-ts-node-commonjs migration:revert -d src/typeorm-cli.config.ts

# generate migration mới (ví dụ)
yarn typeorm-ts-node-commonjs migration:generate src/migrations/<Name> -d src/typeorm-cli.config.ts
```

Reset DB nhanh (xóa và tạo lại bảng theo migrations):
```bash
# Revert tất cả (chạy lặp lại tới khi sạch)
yarn typeorm-ts-node-commonjs migration:revert -d src/typeorm-cli.config.ts

# Run lại toàn bộ migrations
yarn typeorm-ts-node-commonjs migration:run -d src/typeorm-cli.config.ts
```

Migration `1762150000000-CreateProductsAndCategories.ts` sẽ tạo bảng `categories`, `products` và seed sẵn 4 danh mục.

---

### Migrate quickstart (TL;DR)

```bash
# Tạo tất cả bảng còn thiếu theo migrations
yarn db:migrate

# Xem trạng thái migrations
yarn db:show

# Revert 1 migration gần nhất (chạy nhiều lần để về sạch)
yarn db:revert

# Reset sạch DB (drop schema + chạy lại migrations)
yarn db:reset

# Tạo migration mới từ thay đổi entity hiện tại
yarn db:generate

# (Tuỳ chọn) Tạo file migration trống để tự viết tay
yarn db:create
```

Lưu ý: đảm bảo biến môi trường DB đúng (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

## Tài liệu API (Swagger)
- URL: `http://localhost:8080/api`
- Servers đã cấu hình: `/` và `http://localhost:8080` để tránh lỗi URL tương đối.

---

## Xác thực (Auth)

- Đăng ký: `POST /auth/register`
  - body: `{ email, name, password, role? }`
- Đăng nhập: `POST /auth/login`
  - body: `{ email, password }`
  - response: `{ access_token, refresh_token }`
- Refresh token: `POST /auth/refresh`
  - body: `{ refresh_token }`
  - response: `{ access_token, refresh_token }`
- Lấy profile: `GET /users/profile`
  - header: `Authorization: Bearer <access_token>`

Lưu ý:
- `access_token` mặc định hết hạn nhanh, `refresh_token` lâu hơn. Có thể điều chỉnh trong `auth.service.ts` hoặc env.
- `JwtStrategy` trả về full thông tin user (trừ password) dưới `req.user`.

---

## Danh mục (Categories)
- `POST /categories` (Create)
- `GET /categories` (List)
- `GET /categories/:id` (Detail)
- `PATCH /categories/:id` (Update)
- `DELETE /categories/:id` (Delete)

Entity chính: `category.entity.ts` có `name`, `slug` (unique), `description?`.

---

## Sản phẩm (Products)
- `POST /products` (Create) – yêu cầu `categoryId`
- `GET /products` (List) – bao gồm quan hệ category
- `GET /products/:id` (Detail)
- `PATCH /products/:id` (Update)
- `DELETE /products/:id` (Delete)

Fields: `name`, `description?`, `price?` (bigint lưu số dạng chuỗi), `images?` (mảng text), `category` (ManyToOne Category).

---

## Upload ảnh (Cloudinary)

- Env: dùng 1 trong 2 cách
  - `CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>`
  - Hoặc: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Endpoint: `POST /uploads/image`
  - Content-Type: `multipart/form-data`
  - form fields:
    - `file`: binary (required)
    - `folder`: string (optional, ví dụ `products`)
- Response ví dụ:
```json
{
  "url": "https://res.cloudinary.com/<cloud_name>/image/upload/v.../sample.jpg",
  "public_id": "products/abc123",
  "width": 800,
  "height": 600,
  "bytes": 123456,
  "format": "jpg"
}
```

Tham khảo Cloudinary Getting Started: [Cloudinary Getting Started](https://console.cloudinary.com/app/c-594ed1cc56a21a1c08be7191a77a90/image/getting-started)

---

## CORS
Mặc định cho phép origin local phổ biến (7000, 5173). Có thể cấu hình qua `CORS_ORIGINS`:

```bash
export CORS_ORIGINS=http://localhost:7000,http://localhost:5173
yarn dev
```

---

## Development scripts

```bash
# Development
yarn dev

# Build
yarn build

# Start production
yarn start:prod
```

---

## Troubleshooting
- CORS: cấu hình `CORS_ORIGINS` hoặc thêm origin vào `main.ts`.
- 401 Login: đảm bảo user đăng ký sau khi sửa hash, hoặc reset mật khẩu.
- Swagger trả URL sai: đã set servers trong `main.ts`; dùng `/auth/...` (không có `/api` prefix trong path thực tế).

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

MIT
