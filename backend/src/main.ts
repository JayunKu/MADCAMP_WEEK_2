import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './config/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

function logConfig(appConfig: ConfigService) {
  console.info('=== Configuration Settings ===');
  console.info(`Environment: ${appConfig.get('app.env')}`);
  console.info(`Port: ${appConfig.get('app.port')}`);
  console.info(`Session URL: ${appConfig.get('session.url') || 'Not set'}`);
  console.info(`Session Key: ${appConfig.get('session.key') || 'Not set'}`);
  console.info('===============================');
}

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
  logConfig(appConfig);

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
  if (appConfig.get('app.env') === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('MalGreem API')
      .setDescription('The API description for MalGreem')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  const port = appConfig.get('app.port') || 8000;
  await app.listen(port);
  console.info(`=> Server listening at http://localhost:${port}`);
}
bootstrap();
