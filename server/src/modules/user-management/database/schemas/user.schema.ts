import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { UserRole } from "../../interfaces/user-role.enum";
import {RefreshToken, RefreshTokenSchema} from "./refresh-token.schema";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
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

    @Prop({
        type: String,
        unique: true,
        sparse: true // Allows multiple null values but ensures uniqueness for non-null values
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

// Remove password from query results
UserSchema.post("find", (docs) => {
    docs.map((doc) => {
        delete doc.password;
    })
});

UserSchema.post("findOne", (doc) => {
    if (doc) {
        delete doc.password;
    }
});
