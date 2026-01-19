import { Exception } from '@adonisjs/core/exceptions'

export class ApiException extends Exception {
  declare status: number

  constructor(
    public messageKey: string,
    status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(messageKey, { status, code })
    this.status = status
  }
}
