import {PaginationRequest} from "src/package/api";
import { UserRole } from "@Modules/user";

export class GetAllUserDto extends PaginationRequest {
    role?: string; // Can be comma-separated roles like "admin,operator"
}