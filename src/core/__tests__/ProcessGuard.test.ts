import { describe, it, expect } from 'vitest';
import { ProcessGuard } from '../ProcessGuard.js';
import { AgywError } from '../../utils/errors.js';

const guardWith = (psOutput: string) => new ProcessGuard(async () => psOutput);

describe('ProcessGuard.findRunning()', () => {
  describe('on macOS', () => {
    const origPlatform = process.platform;
    beforeAll(() => Object.defineProperty(process, 'platform', { value: 'darwin' }));
    afterAll(() => Object.defineProperty(process, 'platform', { value: origPlatform }));

    it('detects the Antigravity IDE language_server daemon', async () => {
      const ps = `
    31354 /Applications/Antigravity.app/Contents/Resources/bin/language_server --standalone --override_ide_name antigravity
  `;
      const found = await guardWith(ps).findRunning();
      expect(found).toHaveLength(1);
      expect(found[0]).toMatchObject({ pid: 31354, label: 'Antigravity IDE (language_server)' });
    });
  });

  describe('on linux', () => {
    const origPlatform = process.platform;
    beforeAll(() => Object.defineProperty(process, 'platform', { value: 'linux' }));
    afterAll(() => Object.defineProperty(process, 'platform', { value: origPlatform }));

    it('does not flag Antigravity IDE process (no IDE on Linux)', async () => {
      const ps = `31354 /Applications/Antigravity.app/Contents/Resources/bin/language_server`;
      const found = await guardWith(ps).findRunning();
      expect(found).toHaveLength(0);
    });

    it('still detects agy CLI on Linux', async () => {
      const ps = `5678 /home/user/.local/bin/agy chat`;
      const found = await guardWith(ps).findRunning();
      expect(found).toEqual([{ pid: 5678, label: 'agy CLI' }]);
    });
  });

  it('detects a running agy CLI', async () => {
    const ps = `57711 agy --print xin chào`;
    const found = await guardWith(ps).findRunning();
    expect(found).toEqual([{ pid: 57711, label: 'agy CLI' }]);
  });

  it('detects agy invoked via an absolute path', async () => {
    const ps = `12345 /usr/local/bin/agy auth login`;
    const found = await guardWith(ps).findRunning();
    expect(found).toEqual([{ pid: 12345, label: 'agy CLI' }]);
  });

  it('ignores agyw itself', async () => {
    const ps = `42 node /usr/local/lib/node_modules/agyw/dist/cli/index.js switch work`;
    const found = await guardWith(ps).findRunning();
    expect(found).toEqual([]);
  });

  it('ignores unrelated paths that merely contain "agy" as a substring', async () => {
    const ps = `999 tail -f /Users/me/.gemini/antigravity-cli/brain/x/task.log`;
    const found = await guardWith(ps).findRunning();
    expect(found).toEqual([]);
  });

  it('skips its own pid', async () => {
    const ps = `${process.pid} agy --print self`;
    const found = await guardWith(ps).findRunning();
    expect(found).toEqual([]);
  });

  it('returns empty when listing processes fails', async () => {
    const guard = new ProcessGuard(async () => {
      throw new Error('ps unavailable');
    });
    expect(await guard.findRunning()).toEqual([]);
  });
});

describe('ProcessGuard.assertNotRunning()', () => {
  it('throws ERR_ANTIGRAVITY_RUNNING with process detail when a blocker is alive', async () => {
    const ps = `57711 agy --print hello`;
    await expect(guardWith(ps).assertNotRunning()).rejects.toThrow(AgywError);
    await expect(guardWith(ps).assertNotRunning()).rejects.toMatchObject({
      code: 'ERR_ANTIGRAVITY_RUNNING',
    });
  });

  it('resolves silently when nothing is running', async () => {
    await expect(guardWith('').assertNotRunning()).resolves.toBeUndefined();
  });
});

describe('ProcessGuard.killRunning()', () => {
  it('sends signals to running processes and returns count', async () => {
    const killed: { pid: number; signal: string }[] = [];
    const fakeKiller = (pid: number, signal: NodeJS.Signals) => {
      killed.push({ pid, signal });
    };

    let runs = 0;
    const lister = async () => {
      runs++;
      // First call finds running process, second call finds none (simulating exit)
      return runs === 1 ? '1234 agy chat\n5678 /usr/bin/agy run' : '';
    };

    const guard = new ProcessGuard(lister, fakeKiller);
    const count = await guard.killRunning();

    expect(count).toBe(2);
    expect(killed).toContainEqual({ pid: 1234, signal: 'SIGTERM' });
    expect(killed).toContainEqual({ pid: 5678, signal: 'SIGTERM' });
  });

  it('returns 0 when no processes are running', async () => {
    const guard = new ProcessGuard(async () => '', () => {});
    const count = await guard.killRunning();
    expect(count).toBe(0);
  });
});
