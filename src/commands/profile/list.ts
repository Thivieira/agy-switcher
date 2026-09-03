import { createProfileManager } from '../../core/factory.js';
import { ConfigStore } from '../../core/ConfigStore.js';
import { HistoryTracker } from '../../core/HistoryTracker.js';
import { handleError } from '../../utils/cli-helpers.js';
import { homedir } from 'os';
import { join } from 'path';

import { detectProfileEmail } from '../../utils/email.js';

export async function listProfilesCommand(): Promise<void> {
  try {
    const agywDir = join(homedir(), '.agyw');
    const configStore = new ConfigStore(agywDir);
    const historyTracker = new HistoryTracker(configStore);

    const config = await configStore.readConfig();
    const active = await configStore.getActive();
    const lastUsed = await historyTracker.getLastUsedForCwd(process.cwd());

    const names = Object.keys(config.profiles);
    const emails = await Promise.all(
      names.map(async name => {
        const prof = config.profiles[name];
        return prof.email || (await detectProfileEmail(prof.path)) || '-';
      }),
    );

    const colNameW = Math.max(4, ...names.map(n => n.length)) + 2;
    const colEmailW = Math.max(7, ...emails.map(e => e.length)) + 2;

    const header =
      'NAME'.padEnd(colNameW) +
      'ACTIVE'.padEnd(8) +
      'ACCOUNT'.padEnd(colEmailW) +
      'LAST_USED'.padEnd(11) +
      'MODEL';
    process.stdout.write(header + '\n');
    process.stdout.write('-'.repeat(header.length) + '\n');

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const email = emails[i];
      const isActive = name === active.profile ? '*' : '';
      const isLast = name === lastUsed ? 'yes' : '';
      const model = config.profiles[name].model ?? '';
      process.stdout.write(
        name.padEnd(colNameW) +
          isActive.padEnd(8) +
          email.padEnd(colEmailW) +
          isLast.padEnd(11) +
          model +
          '\n',
      );
    }
  } catch (err) {
    handleError(err);
  }
}
