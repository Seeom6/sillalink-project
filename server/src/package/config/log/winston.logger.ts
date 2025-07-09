import { WinstonModule } from 'nest-winston';
import * as winstonLib from 'winston';
import {Module} from "@nestjs/common";


@Module({
  imports: [
    WinstonModule.forRoot({
    level: 'error',
    format: winstonLib.format.combine(
      winstonLib.format.json(),
      winstonLib.format.timestamp(),
      winstonLib.format.prettyPrint(),
    ),

    transports: [
      new winstonLib.transports.Console(),
      new winstonLib.transports.File({
        filename: './Logs/system_error.log',
        level: 'error',
        format: winstonLib.format.json(),
      }),
    ],
  })]
})
export class WinstonLogger {}
