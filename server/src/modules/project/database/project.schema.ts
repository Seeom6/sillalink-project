import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {User} from "@Modules/user";
import {UserDocument} from "@Modules/user";

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  link: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String, default: '' })
  mainImage: string;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({type: [mongoose.Schema.Types.ObjectId], ref: User.name})
  members: mongoose.Types.ObjectId[] | UserDocument[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project); 

ProjectSchema.post("find", function(doc: ProjectDocument) {
  doc.mainImage = `${process.env.BASE_URL}/${doc.mainImage}`
})