# Hướng Dẫn Prisma Migration

## Cài Đặt Ban Đầu

1. Sao chép `.env.example` thành `.env` và cấu hình kết nối database:
```bash
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/network-dogiadung?schema=public"
```

## Các Lệnh Thường Dùng

### Tạo Prisma Client
```bash
yarn prisma:generate
# hoặc
npx prisma generate
```

### Tạo migration mới và áp dụng vào database
```bash
yarn prisma:migrate
# hoặc
npx prisma migrate dev --name ten_migration_cua_ban
```

### Áp dụng migrations có sẵn vào database (production)
```bash
yarn prisma:migrate:deploy
# hoặc
npx prisma migrate deploy
```

###  Đẩy schema lên database mà không tạo migration (development)
```bash
yarn db:push
# hoặc
npx prisma db push
```

### Kéo schema từ database hiện có
```bash
yarn db:pull
# hoặc
npx prisma db pull
```

### Mở Prisma Studio (Giao diện quản lý database)
```bash
yarn prisma:studio
# hoặc
npx prisma studio
```

### Tạo dữ liệu mẫu (Seed)
```bash
yarn prisma:seed
# hoặc
npx prisma db seed
```

### Xóa dữ liệu mẫu
```bash
yarn prisma:clear
# hoặc
npx ts-node prisma/clear-seed.ts
```

## Chuyển Đổi Từ TypeORM

Dự án này đã được chuyển đổi từ TypeORM sang Prisma. Các migration cũ của TypeORM đã được xóa.

Nếu bạn có database hiện tại với dữ liệu:

1. **Phương án 1: Baseline migration (khuyến nghị cho database đã có dữ liệu)**
   ```bash
   # Tạo migration mà không áp dụng nó
   npx prisma migrate dev --create-only --name init
   
   # Đánh dấu migration đã được áp dụng mà không chạy nó
   npx prisma migrate resolve --applied init
   ```

2. **Phương án 2: Reset database (⚠️ CẢNH BÁO: Sẽ xóa toàn bộ dữ liệu)**
   ```bash
   npx prisma migrate reset
   ```

## Thay Đổi Schema

Sau khi chỉnh sửa file `schema.prisma`:

1. Tạo Prisma Client:
   ```bash
   yarn prisma:generate
   ```

2. Tạo và áp dụng migration:
   ```bash
   yarn prisma:migrate
   ```

## Seed Dữ Liệu Mẫu

Dự án đã được cấu hình sẵn script seed để tạo dữ liệu mẫu. Xem chi tiết tại [SEED_GUIDE.md](./SEED_GUIDE.md).

### Tạo 60 records dữ liệu mẫu

```bash
yarn prisma:seed
```

Dữ liệu được tạo:
- 10 Categories (Danh mục sản phẩm)
- 10 Products (Sản phẩm điện)
- 10 Services (Dịch vụ)
- 10 Product Categories (Danh mục theo thương hiệu)
- 10 Project Categories (Danh mục dự án)
- 10 Projects (Dự án đã thực hiện)

### Xóa dữ liệu mẫu

```bash
yarn prisma:clear
```

## Xử Lý Sự Cố

### Lỗi "Migration history is out of sync"
Lỗi này xảy ra khi schema database không khớp với lịch sử migration. Giải pháp:

1. Cho development: `npx prisma migrate reset` (⚠️ xóa toàn bộ dữ liệu)
2. Cho production: Tạo baseline migration và resolve nó

### Lỗi "Cannot find module '@prisma/client'"
Chạy lệnh: `yarn prisma:generate`

### Lỗi kết nối database
Kiểm tra lại `DATABASE_URL` trong file `.env`.

