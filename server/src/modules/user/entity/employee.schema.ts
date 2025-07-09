import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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

@Schema({_id: false})
export class Employee {

    @Prop({type: String})
    position: string;

    @Prop({type: Date})
    startDate: Date;

    @Prop({type: Date})
    endDate?: Date;

    @Prop({ type: String, default: null})
    image: string;

    @Prop({type: String})
    department?: string;

    @Prop({type: String, enum: ['full-time', 'part-time', 'contractor', 'intern'], default: 'full-time'})
    employmentStatus?: string;

    @Prop({type: String})
    managerId?: string;

    @Prop({type: [String], default: []})
    projectIds?: string[];

    @Prop({type: EmergencyContact})
    emergencyContact?: EmergencyContact;

    @Prop({type: Address})
    address?: Address;

    @Prop({type: Salary})
    salary?: Salary;

}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)