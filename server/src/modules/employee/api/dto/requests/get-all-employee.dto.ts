import { PositionEnum } from "@Modules/employee/databases/position.enum";
import { PaginationRequest} from "src/package/api";

export class GetAllEmployee extends PaginationRequest {
    name?: string;
    position?: PositionEnum
}