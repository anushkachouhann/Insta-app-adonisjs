import type { HttpContext } from '@adonisjs/core/http'
import { getLocale, t } from '#config/i18n'
import { ApiException } from '#exceptions/api_exception'

type SuccessPayload<T> = {
  messageKey?: string
  data?: T
}

export function ok<T>(ctx: HttpContext, payload: SuccessPayload<T> = {}) {
  const locale = getLocale(ctx)
  return ctx.response.status(200).json({
    success: true,
    message: t(locale, payload.messageKey ?? 'OK'),
    data: payload.data ?? null,
  })
}

export function created<T>(ctx: HttpContext, payload: SuccessPayload<T> = {}) {
  const locale = getLocale(ctx)
  return ctx.response.status(201).json({
    success: true,
    message: t(locale, payload.messageKey ?? 'CREATED'),
    data: payload.data ?? null,
  })
}

export function noContent(ctx: HttpContext, payload: SuccessPayload<null> = {}) {
  const locale = getLocale(ctx)
  return ctx.response.status(200).json({
    success: true,
    message: t(locale, payload.messageKey ?? 'DELETED'),
    data: null,
  })
}

export function errorResponse(
  ctx: HttpContext,
  opts: { status: number; messageKey: string; errors?: unknown; code?: string }
) {
  const locale = getLocale(ctx)
  return ctx.response.status(opts.status).json({
    success: false,
    message: t(locale, opts.messageKey),
    code: opts.code,
    errors: opts.errors,
  })
}

export function handleError(ctx: HttpContext, err: unknown) {
  const e = err as any

  if (err instanceof ApiException) {
    return errorResponse(ctx, {
      status: err.status,
      messageKey: err.messageKey,
      code: err.code,
      errors: err.details,
    })
  }

  // Vine/Adonis validation errors
  if (e?.code === 'E_VALIDATION_ERROR') {
    return errorResponse(ctx, {
      status: 422,
      messageKey: 'VALIDATION_ERROR',
      code: e.code,
      errors: e.messages ?? e.messagesBag ?? e,
    })
  }

  return errorResponse(ctx, {
    status: 500,
    messageKey: 'INTERNAL_SERVER_ERROR',
    code: e?.code,
  })
}
