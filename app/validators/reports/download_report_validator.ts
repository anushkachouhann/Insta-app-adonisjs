import vine from '@vinejs/vine'

export const downloadReportValidator = vine.compile(
  vine.object({
    format: vine.enum(['excel', 'pdf'] as const),
  })
)
