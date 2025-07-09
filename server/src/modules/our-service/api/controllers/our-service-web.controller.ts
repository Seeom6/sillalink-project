import {ControllerWeb} from "@Package/api";
import {Get} from "@nestjs/common";
import {OurServiceWebService} from "@Modules/our-service/services/our-service-web.service";
import {GetAllServiceDto} from "@Modules/our-service/api/dto/responses/get-all-service.dto";


@ControllerWeb({
  prefix: 'our-service',
})
export class OurServiceWebController {
  constructor(
    private readonly ourServiceService: OurServiceWebService
  ) {}

  @Get()
  async getAll() {
    const data = await this.ourServiceService.getOurService()
    return data.map((s) => new GetAllServiceDto(s));
  }
}