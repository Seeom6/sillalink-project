import { Global, Module } from "@nestjs/common";
import { MailService } from "./email.service";

@Global()
@Module({
    providers: [MailService],
    exports: [MailService]
})
export class EmailModule {}