import { copyFile, mkdir, rm, stat } from 'fs/promises';
import { dirname, join } from 'path';
import { homedir } from 'os';
import type { CredentialStore } from './CredentialStore.js';

/**
 * Linux credential store.
 *
 * On Linux with agy 1.1.x+, credentials can exist as:
 * 1. ~/.gemini/oauth_creds.json (OAuth token JSON with id_token)
 * 2. ~/.gemini/antigravity-cli/antigravity-oauth-token (managed by FileSwapper)
 *
 * LinuxCredentialStore synchronizes ~/.gemini/oauth_creds.json with the profile directory.
 */
export class LinuxCredentialStore implements CredentialStore {
  constructor(
    private profilesDir: string,
    private geminiDir: string = join(homedir(), '.gemini'),
  ) {}

  async save(profileName: string): Promise<void> {
    const oauthSrc = join(this.geminiDir, 'oauth_creds.json');
    const oauthDest = join(this.profilesDir, profileName, 'oauth_creds.json');
    try {
      await stat(oauthSrc);
      await mkdir(dirname(oauthDest), { recursive: true });
      await copyFile(oauthSrc, oauthDest);
    } catch {
      // File doesn't exist; nothing to save
    }
  }

  async load(profileName: string): Promise<void> {
    const oauthSrc = join(this.profilesDir, profileName, 'oauth_creds.json');
    const oauthDest = join(this.geminiDir, 'oauth_creds.json');
    try {
      await stat(oauthSrc);
      await mkdir(dirname(oauthDest), { recursive: true });
      await copyFile(oauthSrc, oauthDest);
    } catch {
      // Profile does not have oauth_creds.json; clear it so this profile starts clean
      await rm(oauthDest, { force: true });
    }
  }
}
