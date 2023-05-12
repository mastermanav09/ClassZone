import * as errorResponses from "./errorResponse";
import * as successResponses from "./successResponse";

export default function manageResponses(statusCode, message) {
  // success responses
  if (statusCode === 200) {
    return successResponses.successResponse(message);
  }

  if (statusCode === 201) {
    return successResponses.successResourceCreatedResponse(message);
  }

  // error responses
  if (statusCode === 500) {
    return errorResponses.serverErrorResponse(message);
  }

  if (statusCode === 400) {
    return errorResponses.badRequestResponse(message);
  }

  if (statusCode === 404) {
    return errorResponses.notFoundErrorResponse(message);
  }

  if (statusCode === 401) {
    return errorResponses.unauthorizedErrorResponse(message);
  }

  if (statusCode === 422) {
    return errorResponses.validationErrorResponse(message);
  }
}
