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

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  ERR_PROFILE_NOT_FOUND: "Profile '{name}' does not exist. Run `agyw profile list` to view available profiles.",
  ERR_PROFILE_EXISTS: "Profile '{name}' already exists. Use `agyw profile list` to view existing profiles.",
  ERR_REMOVE_ACTIVE: "Cannot remove the active profile. Switch to another profile first: `agyw switch <other>`.",
  ERR_REMOVE_LAST: "Cannot remove the last profile. At least 1 profile is required.",
  ERR_AMBIGUOUS_PROFILE: "Prefix '{name}' matches multiple profiles: {matches}. Please specify the full name.",
  ERR_NO_PROFILES: "No profiles configured yet. Run `agyw init` to get started.",
  ERR_AGY_NOT_FOUND: "`agy` was not found in PATH. Please install `agy` and ensure it is available in your PATH.",
  ERR_ANTIGRAVITY_NOT_INIT: "Directory `~/.gemini/antigravity-cli/` does not exist. Run `agy` once to initialize it.",
  ERR_CONCURRENT_SWITCH: "Another switch operation is currently running. Please try again later. Lock will expire automatically after 30 seconds.",
  ERR_ANTIGRAVITY_RUNNING: "Antigravity/agy is currently running ({detail}). This process retains credentials in memory and writes them back to storage/keychain, which invalidates profile switches and cross-contaminates credentials. Please quit Antigravity / terminate all `agy` processes, then try switching again.",
  ERR_ENV_WRITE_FAILED: "Cannot write to `~/.gemini/antigravity-cli/`: {detail}. Check directory permissions.",
};

export class AgywError extends Error {
  readonly code: ErrorCode;
  readonly exitCode = 1;

  constructor(code: ErrorCode, context?: Record<string, string>) {
    let message = ERROR_MESSAGES[code];
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
