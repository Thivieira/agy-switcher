import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Attempts to extract the Google Account email from stored credentials in a profile.
 * Checks oauth_creds.json first, then antigravity-oauth-token if present as a JWT.
 */
export async function detectProfileEmail(profilePath: string): Promise<string | undefined> {
  // 1. Try reading oauth_creds.json
  try {
    const oauthFile = join(profilePath, 'oauth_creds.json');
    const content = await readFile(oauthFile, 'utf-8');
    const parsed = JSON.parse(content);
    if (parsed.id_token) {
      const parts = parsed.id_token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
        if (payload.email) return payload.email as string;
      }
    }
  } catch {
    // Ignore and try fallback
  }

  // 2. Try reading antigravity-oauth-token (if plaintext JWT)
  try {
    const tokenFile = join(profilePath, 'antigravity-oauth-token');
    const content = await readFile(tokenFile, 'utf-8');
    if (content.includes('.')) {
      const parts = content.trim().split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
        if (payload.email) return payload.email as string;
      }
    }
  } catch {
    // Ignore
  }

  return undefined;
}
