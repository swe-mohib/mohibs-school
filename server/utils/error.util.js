export class AppError extends Error {
  constructor(statusCode = 500, message = "Something went wrong") {
    if (typeof statusCode !== "number") {
      message = statusCode;
      statusCode = typeof arguments[1] === "number" ? arguments[1] : 500;
    }

    super(message);

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
