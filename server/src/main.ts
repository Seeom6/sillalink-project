import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvironmentService } from '@Package/config';
import { nestjsFilter } from '@Package/error';
import { nestConfig } from '@Package/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  nestjsFilter(app)
  nestConfig(app)
  const port = app.get(EnvironmentService).get("app.port", 12345);
  await app.listen(port).then(() => {
    console.log(`Server running on port: ${port}`);
  });
}
void bootstrap()
  