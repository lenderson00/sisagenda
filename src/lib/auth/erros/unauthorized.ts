import { BaseError } from "@/lib/errors";

export class UnauthorizedError extends BaseError {
  constructor(message = "User is not authorized") {
    super(`Unauthorized Error: ${message}`);
  }
}
