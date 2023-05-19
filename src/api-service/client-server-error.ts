/**
 * Error with status codes that indicate that there was likely an error in the request
 * which prevented the server from being able to process it.
 */
export class ClientServerError extends Error {
  /**
   * @constructor
   * @param {number} errorStatusCode
   */
  constructor(errorStatusCode: number) {
    super(`${errorStatusCode}: client error`);
  }
}
