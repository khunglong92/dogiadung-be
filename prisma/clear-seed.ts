import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Bắt đầu xóa dữ liệu seed...\n');

  try {
    // Xóa theo thứ tự ngược lại để tránh lỗi foreign key
    console.log('Xóa Projects...');
    const deletedProjects = await prisma.project.deleteMany();
    console.log(`✅ Đã xóa ${deletedProjects.count} projects\n`);

    console.log('Xóa Project Categories...');
    const deletedProjectCategories = await prisma.projectCategory.deleteMany();
    console.log(`✅ Đã xóa ${deletedProjectCategories.count} project categories\n`);

    console.log('Xóa Product Categories...');
    const deletedProductCategories = await prisma.productCategory.deleteMany();
    console.log(`✅ Đã xóa ${deletedProductCategories.count} product categories\n`);

    console.log('Xóa Services...');
    const deletedServices = await prisma.service.deleteMany();
    console.log(`✅ Đã xóa ${deletedServices.count} services\n`);

    console.log('Xóa Products...');
    const deletedProducts = await prisma.product.deleteMany();
    console.log(`✅ Đã xóa ${deletedProducts.count} products\n`);

    console.log('Xóa Categories...');
    const deletedCategories = await prisma.category.deleteMany();
    console.log(`✅ Đã xóa ${deletedCategories.count} categories\n`);

    console.log('🎉 Hoàn thành xóa dữ liệu seed!\n');
    console.log('📊 Tổng kết:');
    console.log(`   - Categories: ${deletedCategories.count} records`);
    console.log(`   - Products: ${deletedProducts.count} records`);
    console.log(`   - Services: ${deletedServices.count} records`);
    console.log(`   - Product Categories: ${deletedProductCategories.count} records`);
    console.log(`   - Project Categories: ${deletedProjectCategories.count} records`);
    console.log(`   - Projects: ${deletedProjects.count} records`);
    console.log(`   - Tổng cộng: ${
      deletedCategories.count +
      deletedProducts.count +
      deletedServices.count +
      deletedProductCategories.count +
      deletedProjectCategories.count +
      deletedProjects.count
    } records đã bị xóa\n`);
  } catch (error) {
    console.error('❌ Lỗi khi xóa dữ liệu:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Lỗi không mong muốn:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

