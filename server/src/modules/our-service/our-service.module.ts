import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OurServiceController } from './api/controllers/our-service.controller';
import { OurServiceService } from './services/our-service.service';
import { OurServiceError } from './services/our-service.error';
import { OurService, OurServiceSchema } from './entity/our-service.schema';
import { OurServiceRepository } from './entity/our-service.repository';
import { OurServiceWebController } from "@Modules/our-service/api/controllers/our-service-web.controller";
import { OurServiceWebService } from "@Modules/our-service/services/our-service-web.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: OurService.name, schema: OurServiceSchema }
        ])
    ],
    controllers: [OurServiceWebController, OurServiceController],
    providers: [OurServiceService, OurServiceWebService, OurServiceError, OurServiceRepository],
    exports: [OurServiceService]
})
export class OurServiceModule {}
