import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, rm, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { LinuxCredentialStore } from '../LinuxCredentialStore.js';

const testRoot = '/tmp/agyw-linux-cred-test';
const profilesDir = join(testRoot, 'profiles');
const geminiDir = join(testRoot, 'gemini');

describe('LinuxCredentialStore', () => {
  beforeEach(async () => {
    await mkdir(join(profilesDir, 'work'), { recursive: true });
    await mkdir(geminiDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testRoot, { recursive: true, force: true });
  });

  it('saves oauth_creds.json from geminiDir to profile dir', async () => {
    const creds = JSON.stringify({ access_token: 'abc' });
    await writeFile(join(geminiDir, 'oauth_creds.json'), creds, 'utf-8');

    const store = new LinuxCredentialStore(profilesDir, geminiDir);
    await store.save('work');

    const saved = await readFile(join(profilesDir, 'work', 'oauth_creds.json'), 'utf-8');
    expect(saved).toBe(creds);
  });

  it('loads oauth_creds.json from profile dir to geminiDir', async () => {
    const creds = JSON.stringify({ access_token: 'xyz' });
    await writeFile(join(profilesDir, 'work', 'oauth_creds.json'), creds, 'utf-8');

    const store = new LinuxCredentialStore(profilesDir, geminiDir);
    await store.load('work');

    const loaded = await readFile(join(geminiDir, 'oauth_creds.json'), 'utf-8');
    expect(loaded).toBe(creds);
  });

  it('clears geminiDir oauth_creds.json if profile does not have one on load', async () => {
    await writeFile(join(geminiDir, 'oauth_creds.json'), 'old-token', 'utf-8');

    const store = new LinuxCredentialStore(profilesDir, geminiDir);
    await store.load('work');

    const { access } = await import('fs/promises');
    await expect(access(join(geminiDir, 'oauth_creds.json'))).rejects.toThrow();
  });
});
