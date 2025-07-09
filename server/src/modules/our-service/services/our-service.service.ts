import {Injectable} from '@nestjs/common';
import {OurServiceError} from './our-service.error';
import {OurServiceRepository} from '../entity/our-service.repository';
import {Pagination} from 'src/package/api';
import {CreateServiceDto} from "@Modules/our-service/api/dto/requests";
import {UpdateServiceDashboardDto} from "@Modules/our-service/api/dto/requests/update-service-dashboard.dto";
import {toMongoId} from "@Package/services";
import {parsImageUrl} from "@Package/file";
import {ErrorCode} from "../../../common/error/error-code";

@Injectable()
export class OurServiceService {
    constructor(
        private readonly ourServiceError: OurServiceError,
        private readonly ourServiceRepository: OurServiceRepository,
    ) {}

    async getService(id: string) {

        const service = await this.ourServiceRepository.findOne({
            filter: { _id: id }
        });

        if (!service) {
            this.ourServiceError.throw(ErrorCode.SERVICE_NOT_FOUND);
        }

        return service;
    }

    async createService(data: CreateServiceDto) {

        const existingService = await this.ourServiceRepository.findOne({
            filter: { name: data.name }
        });

        if (existingService) {
            this.ourServiceError.throw(ErrorCode.SERVICE_ALREADY_EXISTS);
        }

        await this.ourServiceRepository.create({
            doc: {
                name: data.name,
                description: data.description,
                image: data.image || null,
            }
        });
        return;
    }

    async getAllServices(pagination?: Pagination) {
        const services = await this.ourServiceRepository.findAllServices(pagination);
        services.map((service)=>{
            service.image = parsImageUrl(service.image)
        })
        return services
    }

    async updateService(id: string, data: UpdateServiceDashboardDto):Promise<void> {
        const existingService = await this.ourServiceRepository.findOne({
            filter: {
                id: id,
            }
        })

        if(existingService){
            this.ourServiceError.throw(ErrorCode.SERVICE_NOT_FOUND)
        }
        const isTheSameName = await this.ourServiceRepository.findOne({
            filter: {
                name: data.name
            }
        })
        if (isTheSameName) {
            this.ourServiceError.throw(ErrorCode.SERVICE_ALREADY_EXISTS);
        }
        await this.ourServiceRepository.findOneAndUpdate({
            filter: {
                _id: toMongoId(id)
            },
            update: data
        })
        return;
    }

    async delete(id: string): Promise<void> {
        const service = await this.ourServiceRepository.findOne({
            filter: { _id: id }
        });

        if (!service) {
            this.ourServiceError.throw(ErrorCode.SERVICE_NOT_FOUND);
        }

        await this.ourServiceRepository.findOneAndUpdate({
            filter: {
                _id: toMongoId(id)
            },
            update: {
                deletedAt: new Date()
            }
        })
        return;
    }
}
