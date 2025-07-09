import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeederService } from './seeder.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongoConnection } from './database/mongodb/mongo.module';

@Module({
  imports: [
    MongoConnection,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {} 