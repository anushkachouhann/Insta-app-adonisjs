import { ApiException } from '#exceptions/api_exception'

export function parseId(param: unknown, name = 'id'): number {
  const n =
    typeof param === 'string' ? Number(param) : typeof param === 'number' ? param : Number.NaN
  if (!Number.isFinite(n) || n <= 0) {
    throw new ApiException('VALIDATION_ERROR', 422, 'E_INVALID_PARAM', { [name]: 'Invalid number' })
  }
  return n
}
