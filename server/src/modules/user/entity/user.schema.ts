import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { UserRole } from "../types/role.enum";
import { Employee, EmployeeSchema } from "./employee.schema";
import {RefreshToken, RefreshTokenSchema} from "@Modules/user/entity/refresh-token.schema";


export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({
        type: String,
        required: true
    }) 
    firstName: string;

    @Prop({
        type: String,
        required: true,
    })
    lastName: string;

    @Prop({
        type: String,
        default: UserRole.USER,
        enum: UserRole
    })
    role?: UserRole

    @Prop({type: EmployeeSchema, default: null})
    employee: Employee

    @Prop({
        type: String,
    })
    phone?: string;

    @Prop({type: [RefreshTokenSchema], default: []})
    refreshToken?: RefreshToken[]

    @Prop({ default: false })
    isActive?: boolean;

    @Prop({
        type: Date,
        default: null
    })
    deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.post("find",(docs)=>{
    docs.map((doc)=>{
        delete doc.password;
    })
})