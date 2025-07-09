import {applyDecorators, Delete, Get, Patch, Post, Put} from "@nestjs/common";
import { AllowRole } from "@Package/api";
import {UserRole} from "@Modules/user";

export function PostPolicy(options: { path: string; role: UserRole[]}){
  return applyDecorators(
    Post(options.path),
    AllowRole(options.role)
  )
}

export function GetPolicy(options: { path: string; role: UserRole[]}){
  return applyDecorators(
    Get(options.path),
    AllowRole(options.role)
  )
}

export function DeletePolicy(options: { path: string; role: UserRole[]}){
  return applyDecorators(
    Delete(options.path),
    AllowRole(options.role)
  )
}


export function PutPolicy(options: { path: string; role: UserRole[]}){
  return applyDecorators(
    Put(options.path),
    AllowRole(options.role)
  )
}

export function PatchPolicy(options: { path: string; role: UserRole[]}){
  return applyDecorators(
    Patch(options.path),
    AllowRole(options.role)
  )
}


