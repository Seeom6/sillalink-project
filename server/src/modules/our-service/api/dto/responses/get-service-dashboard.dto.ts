import {OurServiceDocument} from "@Modules/our-service/entity/our-service.schema";

export class GetServiceDashboardDto {
  name: string;
  description: string;
  image: string;
  id: string;
  constructor(service: OurServiceDocument) {
    this.name = service.name;
    this.description = service.description;
    this.image = service.image;
    this.id = service.id;
  }
}