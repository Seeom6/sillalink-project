import { Module } from '@nestjs/common';
import { Modules } from './modules';
import { PackageModule } from './package';

@Module({
  imports: [
    ...PackageModule,
    ...Modules
  ],
})
export class AppModule {
}
