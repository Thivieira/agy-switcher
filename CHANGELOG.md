# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-09-03

### Added
- `-k, --kill` flag for `switch` and `run` commands to terminate running `agy` processes before switching profiles.
- `current` (alias `whoami`) command to quickly print the active profile name for shell prompts and scripts.
- `completion` command generating shell autocompletion for bash, zsh, and fish.
- Automatic Google account email detection from credentials (`id_token`) displayed in `agyw list` and `agyw status`.
- `--email` option for `agyw add` to explicitly assign an email address to a profile.
- `LinuxCredentialStore` for syncing `~/.gemini/oauth_creds.json` across profiles.
- Automatic injection of required Linux file-storage environment variables (`GEMINI_FORCE_FILE_STORAGE`, `TZ`, `SSH_CONNECTION`) in `agyw run`.
- i18n support with automatic environment locale detection (`AGYW_LANG`, `LC_ALL`, `LANG`), supporting English and Vietnamese.

### Changed
- `switch` and `run` return immediately without error if the target profile is already active, avoiding unnecessary process blocking.
- Default error messages translated to clear, idiomatic English with Vietnamese fallback.

### Fixed
- Fixed bug in `ProfileManager.init` that accidentally populated the `private` config list with shared directory names.
- Added `oauth_creds.json` to profile credential cleanup list to ensure newly added profiles start with clean authentication.
