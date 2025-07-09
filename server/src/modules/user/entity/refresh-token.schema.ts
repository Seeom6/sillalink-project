import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


@Schema({_id: false})
export class RefreshToken {
  @Prop({ default: false, type: String })
  token: string;

  @Prop({ default: false, type: String })
  jwtId: string
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);