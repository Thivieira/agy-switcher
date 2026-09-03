import { ConfigStore } from '../core/ConfigStore.js';
import { handleError } from '../utils/cli-helpers.js';
import { homedir } from 'os';
import { join } from 'path';

export async function currentCommand(): Promise<void> {
  try {
    const agywDir = join(homedir(), '.agyw');
    const configStore = new ConfigStore(agywDir);
    const active = await configStore.getActive();
    process.stdout.write(`${active.profile}\n`);
  } catch (err) {
    handleError(err);
  }
}
