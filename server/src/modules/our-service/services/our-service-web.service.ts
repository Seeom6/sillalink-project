import {Injectable} from "@nestjs/common";
import {OurServiceError} from "@Modules/our-service/services/our-service.error";
import {OurServiceRepository} from "@Modules/our-service/entity/our-service.repository";
import {OurServiceDocument} from "@Modules/our-service/entity/our-service.schema";


@Injectable()
export class OurServiceWebService {
  constructor(
    private readonly ourServiceError: OurServiceError,
    private readonly ourServiceRepository: OurServiceRepository,
  ) {}

  async getOurService(): Promise<OurServiceDocument[]> {
    return await this.ourServiceRepository.find({
      filter: {
        deletedAt: {
          $ne: null
        }
      }
    })
  }
}