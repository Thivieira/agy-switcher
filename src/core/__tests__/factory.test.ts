import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createProfileManager } from '../factory.js';
import { MacOSKeychainStore } from '../KeychainManager.js';
import { LinuxCredentialStore } from '../LinuxCredentialStore.js';
import { ProfileManager } from '../ProfileManager.js';

vi.mock('../KeychainManager.js', () => ({
  MacOSKeychainStore: vi.fn(),
  KeychainManager: vi.fn(),
}));

vi.mock('../LinuxCredentialStore.js', () => ({
  LinuxCredentialStore: vi.fn(),
}));

describe('factory', () => {
  it('returns a ProfileManager', () => {
    const manager = createProfileManager('/tmp/agyw');
    expect(manager).toBeInstanceOf(ProfileManager);
  });

  describe('on macOS', () => {
    const origPlatform = process.platform;
    beforeAll(() => Object.defineProperty(process, 'platform', { value: 'darwin' }));
    afterAll(() => Object.defineProperty(process, 'platform', { value: origPlatform }));

    it('uses MacOSKeychainStore', () => {
      vi.clearAllMocks();
      createProfileManager('/tmp/agyw');
      expect(MacOSKeychainStore).toHaveBeenCalled();
      expect(LinuxCredentialStore).not.toHaveBeenCalled();
    });
  });

  describe('on linux', () => {
    const origPlatform = process.platform;
    beforeAll(() => Object.defineProperty(process, 'platform', { value: 'linux' }));
    afterAll(() => Object.defineProperty(process, 'platform', { value: origPlatform }));

    it('uses LinuxCredentialStore', () => {
      vi.clearAllMocks();
      createProfileManager('/tmp/agyw');
      expect(LinuxCredentialStore).toHaveBeenCalled();
      expect(MacOSKeychainStore).not.toHaveBeenCalled();
    });
  });
});
