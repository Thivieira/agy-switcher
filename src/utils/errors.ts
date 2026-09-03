export type ErrorCode =
  | 'ERR_PROFILE_NOT_FOUND'
  | 'ERR_PROFILE_EXISTS'
  | 'ERR_REMOVE_ACTIVE'
  | 'ERR_REMOVE_LAST'
  | 'ERR_AMBIGUOUS_PROFILE'
  | 'ERR_NO_PROFILES'
  | 'ERR_AGY_NOT_FOUND'
  | 'ERR_ANTIGRAVITY_NOT_INIT'
  | 'ERR_CONCURRENT_SWITCH'
  | 'ERR_ANTIGRAVITY_RUNNING'
  | 'ERR_ENV_WRITE_FAILED';

import { getLocale, ERROR_MESSAGES_EN, ERROR_MESSAGES_VI, type Locale } from './i18n.js';

export class AgywError extends Error {
  readonly code: ErrorCode;
  readonly exitCode = 1;

  constructor(code: ErrorCode, context?: Record<string, string>, locale: Locale = getLocale()) {
    const messages = locale === 'vi' ? ERROR_MESSAGES_VI : ERROR_MESSAGES_EN;
    let message = messages[code] ?? ERROR_MESSAGES_EN[code];
    if (context) {
      for (const [key, val] of Object.entries(context)) {
        message = message.replace(`{${key}}`, val);
      }
    }
    super(message);
    this.code = code;
    this.name = 'AgywError';
  }
}
