import { createProfileManager } from '../core/factory.js';
import { handleError } from '../utils/cli-helpers.js';

export async function switchCommand(name: string, opts?: { kill?: boolean }): Promise<void> {
  try {
    const manager = createProfileManager();
    await manager.switch(name, opts);
    process.stdout.write(`Switched to profile: ${name}\n`);
  } catch (err) {
    handleError(err);
  }
}
