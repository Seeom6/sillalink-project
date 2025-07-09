import { applyDecorators } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import {UserTypesMetadata} from "src/package/api";
import {UserTypesGuard} from "@Package/auth/guards/permission.guard";
import {UserRole} from "@Modules/user";

export function AllowRole(values: UserRole[]) {
  return applyDecorators(
    UserTypesMetadata(values),
    UseGuards(UserTypesGuard),
  );
}
