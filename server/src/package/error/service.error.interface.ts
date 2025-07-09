import { ErrorCode } from "@Common/error";
import { ErrorMessages } from "./error.interface";
import { ErrorFactory } from "./error.factory";
import { AppError } from "./app.error";

export abstract class IServiceError {
  constructor(
    private readonly errorMessages: ErrorMessages,
    private readonly errorType: string,
  ) {
  }
  throw(code: ErrorCode, context?: any): never {
    const message = this.errorMessages[code] || 'Unknown role error';
    throw ErrorFactory.createError({
        code,
        message,
        errorType: this.errorType,
    });
  }
  error(code: ErrorCode, context?: any): AppError {
    const message = this.errorMessages[code] || 'Unknown role error';
    return ErrorFactory.createError({
      code,
      message,
      errorType: this.errorType,
    });
  }
}