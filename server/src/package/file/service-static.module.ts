import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, normalize } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: normalize(join(process.cwd(), 'public')),
            serveRoot: '/',
        }),
    ],
})
export class ServiceStaticModule { }
