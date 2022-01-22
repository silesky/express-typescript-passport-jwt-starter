//  all of these errors are meant to be serializable to JSON
interface ResponseError extends Error {
  type: string;
}
export class AuthErr extends Error implements ResponseError {
  type = 'auth';
}

export class ValidationErr extends Error implements ResponseError {
  type = 'validation';
}

export class NotFoundErr extends Error implements ResponseError {
  type = 'not_found';
}
