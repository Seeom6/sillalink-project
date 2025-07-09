import {Body, Get, Param, Query} from '@nestjs/common';
import {OurServiceService} from '@Modules/our-service';
import {AuthControllerAdmin} from "@Package/api";
import {CreateServiceValidation} from "@Modules/our-service/api/validation/create-service.dto";
import {CreateServiceDto} from "@Modules/our-service/api/dto/requests";
import {OurServiceDocument} from "@Modules/our-service/entity/our-service.schema";
import {GetAllServiceDto} from "@Modules/our-service/api/dto/responses/get-all-service.dto";
import {DeletePolicy, GetPolicy, PostPolicy, PutPolicy} from "@Package/api/decorators/auth-method.decorator";
import {UserRole} from "@Modules/user";
import {GetServiceDashboardDto} from "@Modules/our-service/api/dto/responses/get-service-dashboard.dto";
import {UpdateServiceValidation} from "@Modules/our-service/api/validation/update-service.dto";
import {UpdateServiceDashboardDto} from "@Modules/our-service/api/dto/requests/update-service-dashboard.dto";

@AuthControllerAdmin({
    prefix: 'our-service',
})
export class OurServiceController {
    constructor(
        private readonly ourServiceService: OurServiceService
    ) {
    }


    @PostPolicy({
        path: "",
        role: [UserRole.ADMIN]
    })
    async createService(
        @Body(CreateServiceValidation) data: CreateServiceDto
    ) {
        await this.ourServiceService.createService(data);
    }

    @Get(':id')
    async getService(
        @Param('id') id: string
    ) {
        const data = await this.ourServiceService.getService(id);
        return new GetServiceDashboardDto(data)
    }

    @GetPolicy({
        path: "",
        role: [UserRole.ADMIN]
    })
    async getAllServices(
        @Query() query: any,
    ) {
        const data = await this.ourServiceService.getAllServices();
        return data.map((d: OurServiceDocument) => new GetAllServiceDto(d))
    }

    @PutPolicy({
        path: ":id",
        role: [UserRole.ADMIN]
    })
    async updateService(
        @Param("id") id: string,
        @Body(UpdateServiceValidation) data: UpdateServiceDashboardDto) {
        return this.ourServiceService.updateService(id, data)
    }

    @DeletePolicy({
        path: ":id",
        role: [UserRole.ADMIN]
    })
    async delete(@Param('id') id: string) {
        return this.ourServiceService.delete(id)
    }
}
