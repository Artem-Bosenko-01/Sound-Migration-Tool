/**
 * Indicates that the request has not been applied because it
 * lacks valid authentication credentials for the target resource.
 */
export class UnauthorizedError extends Error {
  /**
   * @constructor
   */
  constructor() {
    super('401: User with this credentials are not exist.');
  }
}
