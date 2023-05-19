/**
 * Error that throws when response status equals 500.
 */
export class ServerError extends Error {
  /**
   * @constructor
   */
  constructor() {
    super('500: Server Error');
  }
}
