import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration for frontend -> API calls
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4000',
      'http://103.200.23.65:3000', // dev/local FE
      'http://103.200.23.65:4000', // dev/local FE
      'http://kimloaitamthienloc.vn', // production FE
      'http://www.kimloaitamthienloc.vn',
      'https://kimloaitamthienloc.vn', // production FE
      'https://www.kimloaitamthienloc.vn',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Do Gia Dung API')
    .setDescription('API documentation for Do Gia Dung application')
    .setVersion('1.0')
    .addBearerAuth()
    // Explicit servers to avoid Swagger UI resolving paths relative to /api
    .addServer('/')
    .addServer(`http://localhost:${process.env.PORT ?? 8080}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0'); // bind tất cả IP
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api`,
  );
}

void bootstrap();
