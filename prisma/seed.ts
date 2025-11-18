import {
  PrismaClient,
  ServiceStatus,
  ServiceThemeVariant,
  Category,
} from '@prisma/client';
import { servicesSeedData } from './services-seed-data';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Interface cho category với keywords
interface CategoryWithKeywords extends Category {
  keywords: string[];
}

// Hàm tạo slug từ tên
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Hàm tạo ảnh ngẫu nhiên với từ khóa
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getImageUrl(_keywords: string[]): string {
  // Sử dụng picsum.photos hoặc placeholder.com
  return `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/640/480`;
}

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...\n');

  // Xóa dữ liệu cũ để tránh lỗi unique constraint
  console.log('🗑️  Xóa dữ liệu cũ...');
  await prisma.project.deleteMany();
  await prisma.projectCategory.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.service.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Xóa dữ liệu cũ thành công.\n');

  // 1. Seed Categories (10 records)
  console.log('📁 Tạo Categories...');
  const categories: CategoryWithKeywords[] = [];
  const categoryNames = [
    { name: 'Thiết bị điện gia dụng', keywords: ['fan', 'vacuum', 'kitchen'] },
    { name: 'Thiết bị chiếu sáng', keywords: ['lamp', 'light', 'led'] },
    {
      name: 'Thiết bị an toàn điện',
      keywords: ['circuit', 'safety', 'breaker'],
    },
    { name: 'Dây cáp điện', keywords: ['cable', 'wire', 'electric'] },
    { name: 'Ổ cắm và công tắc', keywords: ['socket', 'switch', 'outlet'] },
    {
      name: 'Thiết bị đo lường điện',
      keywords: ['meter', 'voltage', 'tester'],
    },
    {
      name: 'Thiết bị tự động hóa',
      keywords: ['automation', 'robot', 'control'],
    },
    { name: 'Thiết bị bảo vệ điện', keywords: ['surge', 'protector', 'fuse'] },
    { name: 'Phụ kiện điện', keywords: ['plug', 'adapter', 'connector'] },
    {
      name: 'Thiết bị điện công nghiệp',
      keywords: ['industrial', 'factory', 'machine'],
    },
  ];

  for (const cat of categoryNames) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        description: faker.commerce.productDescription(),
        updatedByUserId: faker.number.int({ min: 1, max: 5 }),
        updatedByName: faker.person.fullName(),
      },
    });
    categories.push({ ...category, keywords: cat.keywords });
  }
  console.log(`✅ Đã tạo ${categories.length} categories\n`);

  // 2. Seed Products (30 products per category = 300 total)
  console.log('📦 Tạo Products...');
  let totalProducts = 0;
  for (const category of categories) {
    for (let i = 0; i < 30; i++) {
      const productName = `${faker.commerce.productName()} - ${category.name}`;
      await prisma.product.create({
        data: {
          name: productName,
          description: {
            overview: faker.commerce.productDescription(),
            details: faker.lorem.paragraphs(3),
          },
          technicalSpecs: {
            voltage: '220V',
            power: `${faker.number.int({ min: 10, max: 2000 })}W`,
            warranty: `${faker.number.int({ min: 12, max: 36 })} tháng`,
            origin: faker.helpers.arrayElement([
              'Việt Nam',
              'Trung Quốc',
              'Nhật Bản',
              'Hàn Quốc',
              'Đức',
            ]),
          },
          price: faker.commerce.price({ min: 50000, max: 10000000, dec: 0 }),
          warrantyPolicy: 'Đổi mới trong 30 ngày, bảo hành chính hãng',
          images: [
            getImageUrl(category.keywords),
            getImageUrl(category.keywords),
            getImageUrl(category.keywords),
          ],
          categoryId: category.id,
          isFeatured: faker.datatype.boolean(0.3), // 30% chance of being featured
        },
      });
      totalProducts++;
    }
  }
  console.log(`✅ Đã tạo ${totalProducts} products\n`);

  // 3. Seed Services
  console.log('⚡ Tạo Services...');
  for (const service of servicesSeedData) {
    await prisma.service.create({ data: service });
  }
  console.log(`✅ Đã tạo ${servicesSeedData.length} services\n`);

  // ... (Các phần seed khác giữ nguyên)
  console.log('🎉 Hoàn thành seed dữ liệu!\n');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
