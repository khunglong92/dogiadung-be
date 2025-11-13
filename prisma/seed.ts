import {
  PrismaClient,
  ServiceStatus,
  ServiceThemeVariant,
  Category,
} from '@prisma/client';
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

  // 3. Seed Services (20 records)
  console.log('⚡ Tạo Services...');
  const serviceData = [
    {
      title: 'Thi công hệ thống điện dân dụng',
      icon: '🏠',
      keywords: ['house', 'construction', 'electric'],
    },
    {
      title: 'Lắp đặt hệ thống điện công nghiệp',
      icon: '🏭',
      keywords: ['factory', 'industrial', 'machine'],
    },
    {
      title: 'Bảo trì và sửa chữa điện',
      icon: '🔧',
      keywords: ['repair', 'maintenance', 'tools'],
    },
    {
      title: 'Tư vấn thiết kế hệ thống điện',
      icon: '📋',
      keywords: ['blueprint', 'design', 'consulting'],
    },
    {
      title: 'Lắp đặt hệ thống điện mặt trời',
      icon: '☀️',
      keywords: ['solar', 'panel', 'energy'],
    },
    {
      title: 'Hệ thống chiếu sáng thông minh',
      icon: '💡',
      keywords: ['smart', 'home', 'light'],
    },
    {
      title: 'Lắp đặt camera an ninh',
      icon: '📹',
      keywords: ['cctv', 'security', 'camera'],
    },
    {
      title: 'Hệ thống báo cháy tự động',
      icon: '🚨',
      keywords: ['fire', 'alarm', 'safety'],
    },
    {
      title: 'Thi công hệ thống điện nhẹ',
      icon: '🌐',
      keywords: ['internet', 'network', 'cable'],
    },
    {
      title: 'Kiểm định an toàn điện',
      icon: '✅',
      keywords: ['inspection', 'safety', 'certificate'],
    },
    {
      title: 'Lắp đặt tủ điện phân phối',
      icon: '📦',
      keywords: ['panel', 'distribution', 'box'],
    },
    {
      title: 'Hệ thống chống sét',
      icon: '🌩️',
      keywords: ['lightning', 'protection', 'storm'],
    },
    {
      title: 'Cung cấp vật tư điện',
      icon: '🛒',
      keywords: ['supply', 'store', 'equipment'],
    },
    {
      title: 'Sửa chữa thiết bị điện gia dụng',
      icon: '🛠️',
      keywords: ['appliance', 'repair', 'home'],
    },
    {
      title: 'Tối ưu hóa hệ thống điện',
      icon: '⚙️',
      keywords: ['optimization', 'efficiency', 'power'],
    },
    {
      title: 'Thi công điện cho tòa nhà văn phòng',
      icon: '🏢',
      keywords: ['office', 'building', 'commercial'],
    },
    {
      title: 'Hệ thống điện cho khách sạn',
      icon: '🏨',
      keywords: [
        'hotel',
        'hospital[object Object]smart home',
        'iot',
        'automation',
      ],
    },
    {
      title: 'Thi công điện cho nhà hàng',
      icon: '🍽️',
      keywords: ['restaurant', 'kitchen', 'lighting'],
    },
    {
      title: 'Hệ thống điện dự phòng (UPS)',
      icon: '🔋',
      keywords: ['ups', 'battery', 'backup'],
    },
  ];

  for (let i = 0; i < serviceData.length; i++) {
    const data = serviceData[i];
    const slug = createSlug(data.title);

    await prisma.service.create({
      data: {
        slug: `${slug}-${faker.string.alphanumeric(4)}`,
        title: data.title,
        subtitle: faker.company.catchPhrase(),
        shortDescription: faker.lorem.sentences(3),
        content: faker.lorem.paragraphs(8),
        features: JSON.stringify(
          Array.from({ length: 4 }, () => faker.lorem.sentence()),
        ),
        technologies: JSON.stringify(
          Array.from({ length: 3 }, () => faker.company.buzzPhrase()),
        ),
        benefits: JSON.stringify([
          'Tiết kiệm chi phí',
          'An toàn tuyệt đối',
          'Bảo hành dài hạn',
          'Hỗ trợ 24/7',
        ]),
        customers: JSON.stringify(
          Array.from({ length: 3 }, () => faker.company.name()),
        ),
        imageUrls: [getImageUrl(data.keywords), getImageUrl(data.keywords)],
        icon: data.icon,
        ctaLabel: 'Yêu cầu tư vấn',
        ctaLink: '/lien-he',
        orderIndex: i,
        tags: [faker.commerce.department(), faker.commerce.department()],
        seoTitle: `${data.title} - Dịch vụ chuyên nghiệp`,
        seoDescription: faker.lorem.sentences(2),
        altText: data.title,
        status: faker.helpers.arrayElement<ServiceStatus>([
          'published',
          'draft',
        ]),
        themeVariant: faker.helpers.arrayElement<ServiceThemeVariant>([
          'light',
          'dark',
        ]),
        isFeatured: faker.datatype.boolean(0.4), // 40% chance
      },
    });
  }
  console.log(`✅ Đã tạo ${serviceData.length} services\n`);

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
