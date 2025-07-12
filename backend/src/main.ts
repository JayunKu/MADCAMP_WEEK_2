import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './config/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // Helmet settings
  // app.use(helmet());

  // GlobalPipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Env settings
  const appConfig = app.get(ConfigService);
  console.info(`=> Running as ${appConfig.get('app.env')}`);

  // Config for Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Cookie Parser
  app.use(cookieParser(appConfig.get('session.key')));

  // Config for RedisClient
  // const redisClient = Redis.createClient({
  //   url: appConfig.get('session.url'),
  //   legacyMode: true,
  // });
  // redisClient.on('connect', () => {
  //   console.info('=> Redis connected');
  // });
  // redisClient.on('error', (err) => {
  //   console.error('=> Redis Client Error', err);
  // });
  // await redisClient.connect();

  // Session settings
  // app.use(
  //   session({
  //     resave: false,
  //     saveUninitialized: true,
  //     secret: appConfig.get('session.key'),
  //     cookie: {
  //       httpOnly: true,
  //       secure: false,
  //     },
  //     store: new (RedisStore(session))({
  //       client: redisClient,
  //       prefix: 'session:',
  //     }),
  //   }),
  // );

  // Config for Swagger
  if (appConfig.get('app.env') === 'local') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('MalGreem API')
      .setDescription('The API description for MalGreem')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
