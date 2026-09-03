import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { detectProfileEmail } from '../email.js';

const testDir = '/tmp/agyw-email-test';

describe('detectProfileEmail', () => {
  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('extracts email from oauth_creds.json id_token', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ email: 'john@example.com' })).toString('base64url');
    const idToken = `${header}.${payload}.signature`;

    await writeFile(
      join(testDir, 'oauth_creds.json'),
      JSON.stringify({ id_token: idToken }),
      'utf-8',
    );

    const email = await detectProfileEmail(testDir);
    expect(email).toBe('john@example.com');
  });

  it('returns undefined when no credential files exist', async () => {
    const email = await detectProfileEmail(testDir);
    expect(email).toBeUndefined();
  });
});
