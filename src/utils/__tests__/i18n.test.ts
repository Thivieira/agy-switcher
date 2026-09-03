import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getLocale } from '../i18n.js';
import { AgywError } from '../errors.js';

describe('i18n and localization', () => {
  const origEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...origEnv };
  });

  it('defaults to en when no env is set', () => {
    delete process.env.AGYW_LANG;
    delete process.env.LC_ALL;
    delete process.env.LANG;
    expect(getLocale()).toBe('en');
  });

  it('detects vi when AGYW_LANG is set', () => {
    process.env.AGYW_LANG = 'vi';
    expect(getLocale()).toBe('vi');
    const err = new AgywError('ERR_NO_PROFILES');
    expect(err.message).toContain('Chưa có profile nào');
  });

  it('uses English by default in AgywError', () => {
    process.env.AGYW_LANG = 'en';
    const err = new AgywError('ERR_NO_PROFILES');
    expect(err.message).toContain('No profiles configured yet');
  });

  it('allows explicit locale parameter in AgywError', () => {
    const errEn = new AgywError('ERR_NO_PROFILES', undefined, 'en');
    const errVi = new AgywError('ERR_NO_PROFILES', undefined, 'vi');
    expect(errEn.message).toContain('No profiles configured yet');
    expect(errVi.message).toContain('Chưa có profile nào');
  });
});
