# Upload Service Guide

## 📋 Tổng quan

Upload Service đã được refactor để sử dụng **local filesystem** thay vì SSH. Tất cả file sẽ được lưu trực tiếp vào `/var/www/uploads` trên server.

## 🔧 Cấu hình

### Environment Variables

Thêm vào file `.env`:

```env
# Public URL của domain (không có trailing slash)
PUBLIC_BASE_URL=https://yourdomain.com
```

### Ví dụ:

```env
PUBLIC_BASE_URL=https://api.dogiadung.com
```

## 📁 Cấu trúc thư mục

File sẽ được lưu theo cấu trúc:

```
/var/www/uploads/
├── images/
│   ├── product-name-1/
│   │   ├── abc-123-uuid.jpg
│   │   └── def-456-uuid.png
│   ├── service-name-2/
│   │   └── xyz-789-uuid.webp
│   └── project-name-3/
│       └── ghi-012-uuid.jpg
```

## [object Object]ách sử dụng

### 1. Upload ảnh mới với subfolder (entity name)

```typescript
const result = await uploadService.uploadImage(
  buffer,              // Buffer của file
  'images',            // Folder chính
  'iphone-15-pro'      // Tên entity (product/service/project name)
);

// Kết quả:
// {
//   url: 'https://yourdomain.com/uploads/images/iphone-15-pro/abc-123.jpg',
//   public_id: 'images/iphone-15-pro/abc-123.jpg',
//   width: 1920,
//   height: 1080,
//   bytes: 245678,
//   format: 'jpeg'
// }
```

### 2. Upload ảnh không dùng subfolder

```typescript
const result = await uploadService.uploadImage(
  buffer,
  'images'
  // Không truyền entityName
);

// Kết quả:
// {
//   url: 'https://yourdomain.com/uploads/images/abc-123.jpg',
//   public_id: 'images/abc-123.jpg',
//   ...
// }
```

### 3. Update ảnh hiện có

```typescript
const result = await uploadService.uploadImage(
  newBuffer,
  'images',
  'product-name',
  existingPublicId  // 'images/product-name/old-file.jpg'
);

// File cũ sẽ được ghi đè
```

### 4. Xóa ảnh

```typescript
await uploadService.deleteImage('images/product-name/abc-123.jpg');

// Nếu folder 'product-name' rỗng sau khi xóa, nó sẽ tự động bị xóa
```

## ✨ Tính năng

### ✅ Đã giữ lại:

- ✅ Validate file size (max 20MB)
- ✅ Validate file format (jpeg, jpg, png, webp)
- ✅ Watermark tự động
- ✅ Metadata (width, height, bytes, format)
- ✅ Entity name subfolder logic
- ✅ Public_id logic
- ✅ Update file (reuse existing filename)

### 🆕 Thay đổi:

- ❌ Gỡ bỏ SSH upload
- ✅ Sử dụng `fs.promises` để ghi file local
- ✅ Tự động tạo thư mục với `mkdir -p`
- ✅ Xóa folder rỗng tự động khi delete file
- ✅ Public URL từ `PUBLIC_BASE_URL` env variable

## 🔒 Bảo mật

### Quyền truy cập thư mục

Đảm bảo thư mục `/var/www/uploads` có quyền phù hợp:

```bash
sudo mkdir -p /var/www/uploads
sudo chown -R www-data:www-data /var/www/uploads
sudo chmod -R 755 /var/www/uploads
```

### Nginx Configuration

Cấu hình Nginx để serve static files:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # API
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static uploads
    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📝 Ví dụ trong Controller

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  const result = await this.uploadService.uploadImage(
    file.buffer,
    'images',
    'product-abc-123'  // Tên product/service/project
  );
  
  return result;
}

@Delete(':publicId')
async deleteFile(@Param('publicId') publicId: string) {
  // publicId format: 'images/product-name/abc-123.jpg'
  return this.uploadService.deleteImage(publicId);
}
```

## [object Object]eshooting

### Lỗi: Permission denied

```bash
sudo chown -R $USER:$USER /var/www/uploads
# hoặc
sudo chown -R www-data:www-data /var/www/uploads
```

### Lỗi: Cannot find module 'ssh2'

```bash
yarn install
```

### URL không đúng

Kiểm tra `PUBLIC_BASE_URL` trong `.env`:

```env
# ✅ Đúng
PUBLIC_BASE_URL=https://api.dogiadung.com

# ❌ Sai (có trailing slash)
PUBLIC_BASE_URL=https://api.dogiadung.com/
```

## 📊 Migration từ SSH

Nếu bạn đang migrate từ SSH sang local filesystem:

1. Copy tất cả file từ remote server về `/var/www/uploads`
2. Cập nhật `PUBLIC_BASE_URL` trong `.env`
3. Restart application
4. Test upload/delete functionality

```bash
# Copy files từ remote server
rsync -avz user@remote:/var/www/uploads/ /var/www/uploads/
```

## 🎯 Best Practices

1. **Sử dụng entity name** làm subfolder để dễ quản lý
2. **Không hardcode** folder names trong code
3. **Luôn validate** file trước khi upload
4. **Xử lý errors** properly
5. **Log** upload/delete operations để debug

## 📞 Support

Nếu có vấn đề, kiểm tra:

1. Quyền truy cập `/var/www/uploads`
2. `PUBLIC_BASE_URL` trong `.env`
3. Nginx configuration
4. Application logs

