import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema({_id: false})
export class EmergencyContact {
    @Prop({type: String})
    name: string;

    @Prop({type: String})
    phone: string;

    @Prop({type: String})
    relationship: string;
}

@Schema({_id: false})
export class Address {
    @Prop({type: String})
    street: string;

    @Prop({type: String})
    city: string;

    @Prop({type: String})
    state: string;

    @Prop({type: String})
    zipCode: string;

    @Prop({type: String})
    country: string;
}

@Schema({_id: false})
export class Salary {
    @Prop({type: Number})
    amount: number;

    @Prop({type: String, default: 'USD'})
    currency: string;

    @Prop({type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly'})
    frequency: string;
}

@Schema({ timestamps: true })
export class Employee {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: Types.ObjectId;

    @Prop({type: String, required: true})
    position: string;

    @Prop({type: Date, required: true})
    startDate: Date;

    @Prop({type: Date})
    endDate?: Date;

    @Prop({ type: String, default: null})
    image: string;

    @Prop({type: String})
    department?: string;

    @Prop({type: String, enum: ['full-time', 'part-time', 'contractor', 'intern'], default: 'full-time'})
    employmentStatus?: string;

    @Prop({type: Types.ObjectId, ref: 'Employee'})
    managerId?: Types.ObjectId;

    @Prop({type: [Types.ObjectId], ref: 'Project', default: []})
    projectIds?: Types.ObjectId[];

    @Prop({type: EmergencyContact})
    emergencyContact?: EmergencyContact;

    @Prop({type: Address})
    address?: Address;

    @Prop({type: Salary})
    salary?: Salary;

    @Prop({ default: false })
    isActive?: boolean;

    @Prop({
        type: Date,
        default: null
    })
    deletedAt?: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);
export const AddressSchema = SchemaFactory.createForClass(Address);
export const SalarySchema = SchemaFactory.createForClass(Salary);
