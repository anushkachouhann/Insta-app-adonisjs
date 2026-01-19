import type { HttpContext } from '@adonisjs/core/http'

export type Locale = 'en' | 'hi'

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    OK: 'Success',
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',

    USER_NOT_FOUND: 'User not found',
    POST_NOT_FOUND: 'Post not found',
    LIKE_NOT_FOUND: 'Like not found',
    COMMENT_NOT_FOUND: 'Comment not found',
    PARENT_COMMENT_NOT_FOUND: 'Parent comment not found',

    POST_ALREADY_LIKED: 'Post already liked',
    POST_ALREADY_SHARED: 'Post already shared by this user',

    VALIDATION_ERROR: 'Validation error',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    REPORT_GENERATED: 'Report generated successfully',
  },
  hi: {
    OK: 'सफल',
    CREATED: 'सफलतापूर्वक बनाया गया',
    UPDATED: 'सफलतापूर्वक अपडेट किया गया',
    DELETED: 'सफलतापूर्वक हटाया गया',

    USER_NOT_FOUND: 'यूज़र नहीं मिला',
    POST_NOT_FOUND: 'पोस्ट नहीं मिली',
    LIKE_NOT_FOUND: 'लाइक नहीं मिला',
    COMMENT_NOT_FOUND: 'कमेंट नहीं मिला',
    PARENT_COMMENT_NOT_FOUND: 'पैरेंट कमेंट नहीं मिला',

    POST_ALREADY_LIKED: 'पोस्ट पहले से लाइक की गई है',
    POST_ALREADY_SHARED: 'यह पोस्ट पहले से इस यूज़र द्वारा शेयर की गई है',

    VALIDATION_ERROR: 'वैलिडेशन त्रुटि',
    INTERNAL_SERVER_ERROR: 'सर्वर त्रुटि',
    REPORT_GENERATED: 'रिपोर्ट सफलतापूर्वक बनाई गई',
  },
}

export function getLocale(ctx: HttpContext): Locale {
  const langFromQuery = (ctx.request.qs()?.lang as string | undefined)?.toLowerCase()
  if (langFromQuery === 'hi' || langFromQuery === 'en') return langFromQuery

  const header = (ctx.request.header('accept-language') || '').toLowerCase()
  if (header.includes('hi')) return 'hi'
  return 'en'
}

export function t(locale: Locale, key: string): string {
  return TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS.en[key] ?? key
}
