import { spawn } from 'child_process';
import { createProfileManager } from '../core/factory.js';
import { AgywError } from '../utils/errors.js';
import { handleError } from '../utils/cli-helpers.js';

export async function runCommand(
  name: string,
  extraArgs: string[],
  opts?: { kill?: boolean },
): Promise<void> {
  try {
    const manager = createProfileManager();
    await manager.switch(name, opts);

    const agyBin = 'agy';
    const env = { ...process.env };
    if (process.platform === 'linux') {
      env.GEMINI_FORCE_FILE_STORAGE = env.GEMINI_FORCE_FILE_STORAGE ?? 'true';
      env.TZ = env.TZ ?? 'UTC';
      env.SSH_CONNECTION = env.SSH_CONNECTION ?? '127.0.0.1:1:127.0.0.1:1';
    }

    const child = spawn(agyBin, extraArgs, { stdio: 'inherit', env });

    child.on('error', err => {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        handleError(new AgywError('ERR_AGY_NOT_FOUND'));
      }
      handleError(err);
    });

    child.on('exit', code => process.exit(code ?? 0));
  } catch (err) {
    handleError(err);
  }
}
