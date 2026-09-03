#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from '../commands/init.js';
import { switchCommand } from '../commands/switch.js';
import { runCommand } from '../commands/run.js';
import { statusCommand } from '../commands/status.js';
import { doctorCommand } from '../commands/doctor.js';
import { currentCommand } from '../commands/current.js';
import { completionCommand } from '../commands/completion.js';
import { addProfileCommand } from '../commands/profile/add.js';
import { listProfilesCommand } from '../commands/profile/list.js';
import { removeProfileCommand } from '../commands/profile/remove.js';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

const program = new Command();

program
  .name('agyw')
  .description('Agency Profile Switcher for agy (Google Antigravity CLI)')
  .version(pkg.version);

program.command('init').description('Initialize agyw from existing ~/.gemini/antigravity-cli/').action(initCommand);

program
  .command('switch <name>')
  .description('Switch to profile (supports prefix matching)')
  .option('-k, --kill', 'Terminate running agy processes before switching')
  .action((name: string, opts: { kill?: boolean }) => switchCommand(name, opts));

program.command('status').description('Show active profile and symlink health').action(statusCommand);

program
  .command('current')
  .alias('whoami')
  .description('Print active profile name')
  .action(currentCommand);

program
  .command('doctor')
  .description('Diagnose profile and symlink issues')
  .option('--fix', 'Repair broken/missing symlinks and resolve real-file conflicts')
  .action(doctorCommand);

const run = program
  .command('run <name>')
  .description('Switch profile and spawn agy')
  .option('-k, --kill', 'Terminate running agy processes before switching');

run.allowUnknownOption(true);
run.action((name: string, opts: { kill?: boolean }, cmd: Command) => {
  const extra = cmd.args.slice(1);
  runCommand(name, extra, opts);
});

program
  .command('add <name>')
  .description('Add a new profile')
  .option('--clone <source>', 'Clone from source profile')
  .option('--email <email>', 'Associated Google account email')
  .action(addProfileCommand);

program.command('list').description('List all profiles').action(listProfilesCommand);
program.command('remove <name>').description('Remove a profile').action(removeProfileCommand);

program
  .command('completion [shell]')
  .description('Generate shell autocompletion script (bash, zsh, fish)')
  .action(completionCommand);

program.parse();
