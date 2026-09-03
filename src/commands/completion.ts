export function completionCommand(shell?: string): void {
  const target = (shell || detectShell()).toLowerCase();
  switch (target) {
    case 'bash':
      process.stdout.write(getBashCompletion());
      break;
    case 'zsh':
      process.stdout.write(getZshCompletion());
      break;
    case 'fish':
      process.stdout.write(getFishCompletion());
      break;
    default:
      process.stderr.write(
        `Unsupported shell: ${target}. Supported shells: bash, zsh, fish.\nUsage: agyw completion <bash|zsh|fish>\n`,
      );
      process.exit(1);
  }
}

function detectShell(): string {
  const shellPath = process.env.SHELL || '';
  if (shellPath.includes('zsh')) return 'zsh';
  if (shellPath.includes('fish')) return 'fish';
  return 'bash';
}

function getBashCompletion(): string {
  return `# bash completion for agyw
_agyw_completions() {
  local cur prev commands
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  commands="init switch run status current whoami doctor add list remove completion"

  if [ $COMP_CWORD -eq 1 ]; then
    COMPREPLY=( $(compgen -W "$commands" -- "$cur") )
    return 0
  fi

  case "$prev" in
    switch|run|remove)
      local profiles
      if [ -f "$HOME/.agyw/config.yaml" ]; then
        profiles=$(grep -E '^[[:space:]]{2}[a-zA-Z0-9_-]+:' "$HOME/.agyw/config.yaml" | sed -e 's/^[[:space:]]*//' -e 's/://')
      fi
      COMPREPLY=( $(compgen -W "$profiles" -- "$cur") )
      return 0
      ;;
    completion)
      COMPREPLY=( $(compgen -W "bash zsh fish" -- "$cur") )
      return 0
      ;;
  esac
}
complete -F _agyw_completions agyw
`;
}

function getZshCompletion(): string {
  return `#compdef agyw

_agyw() {
  local -a commands
  commands=(
    'init:Initialize agyw from existing ~/.gemini/antigravity-cli/'
    'switch:Switch to profile'
    'run:Switch profile and spawn agy'
    'status:Show active profile and symlink health'
    'current:Print active profile name'
    'whoami:Print active profile name'
    'doctor:Diagnose profile and symlink issues'
    'add:Add a new profile'
    'list:List all profiles'
    'remove:Remove a profile'
    'completion:Generate shell autocompletion script'
  )

  _arguments -C \\
    '1: :->command' \\
    '*:: :->args'

  case $state in
    command)
      _describe -t commands 'agyw command' commands
      ;;
    args)
      case $words[1] in
        switch|run|remove)
          local -a profiles
          if [[ -f "$HOME/.agyw/config.yaml" ]]; then
            profiles=(\${(f)"$(grep -E '^[[:space:]]{2}[a-zA-Z0-9_-]+:' "$HOME/.agyw/config.yaml" | sed -e 's/^[[:space:]]*//' -e 's/://')"})
            _describe -t profiles 'profile' profiles
          fi
          ;;
        completion)
          _values 'shell' bash zsh fish
          ;;
      esac
      ;;
  esac
}

_agyw "$@"
`;
}

function getFishCompletion(): string {
  return `# fish completion for agyw
function __agyw_profiles
  if test -f "$HOME/.agyw/config.yaml"
    grep -E '^[[:space:]]{2}[a-zA-Z0-9_-]+:' "$HOME/.agyw/config.yaml" | string trim | string replace -r ':$' ''
  end
end

complete -c agyw -f
complete -c agyw -n "__fish_use_subcommand" -a "init" -d "Initialize agyw"
complete -c agyw -n "__fish_use_subcommand" -a "switch" -d "Switch to profile"
complete -c agyw -n "__fish_use_subcommand" -a "run" -d "Switch profile and spawn agy"
complete -c agyw -n "__fish_use_subcommand" -a "status" -d "Show active profile and symlink health"
complete -c agyw -n "__fish_use_subcommand" -a "current" -d "Print active profile name"
complete -c agyw -n "__fish_use_subcommand" -a "whoami" -d "Print active profile name"
complete -c agyw -n "__fish_use_subcommand" -a "doctor" -d "Diagnose profile and symlink issues"
complete -c agyw -n "__fish_use_subcommand" -a "add" -d "Add a new profile"
complete -c agyw -n "__fish_use_subcommand" -a "list" -d "List all profiles"
complete -c agyw -n "__fish_use_subcommand" -a "remove" -d "Remove a profile"
complete -c agyw -n "__fish_use_subcommand" -a "completion" -d "Generate shell completion script"

complete -c agyw -n "__fish_seen_subcommand_from switch run remove" -a "(__agyw_profiles)"
complete -c agyw -n "__fish_seen_subcommand_from completion" -a "bash zsh fish"
`;
}
