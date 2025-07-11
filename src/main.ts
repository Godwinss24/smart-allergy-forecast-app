import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './shared/pipes/validationPipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());

  const config = new DocumentBuilder();
  config.setTitle("Smart allergy API");
  config.setDescription("Smart allerggy API description");
  config.addBearerAuth();

  const builtConfig = config.build();

  const documentFactory = () => SwaggerModule.createDocument(app, builtConfig);
  SwaggerModule.setup('api', app, documentFactory);


  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
