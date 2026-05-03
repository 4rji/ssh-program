# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-file Go CLI (`ssh_navigator.go`) that reads `~/.ssh/config`, classifies each host as online/offline via a short TCP dial, and feeds the list to `fzf` for interactive selection. The picked alias is then handed to `ssh`.

## Module and local workflow

This repository is module-enabled as `github.com/4rji/ssh-navigator`. The normal local workflow is:

```sh
go build -o ssh-navigator .
go run .
```

There are no tests and no lint config in this directory.

## Architecture — single binary, two modes

The binary is re-invoked by `fzf` as its own preview provider. `main()` dispatches on `os.Args[1]`:

- Default mode — parse `~/.ssh/config`, probe each host in parallel, render a tab-delimited list, spawn `fzf`, then `exec ssh <alias>` with the selection.
- `preview` mode — `ssh-navigator preview <alias>` prints the detail panel for a single host. `fzf` is started with `--preview "<self> preview '{1}'"` where `{1}` is the first (hidden) field of the current line.

The preview command uses `os.Executable()` to find the current binary and `shellQuote` to escape it, so the tool works regardless of install path.

### Input format fed to fzf

Each line is `alias\t<displayed text with ANSI>`. `fzf` is started with `--delimiter "\t" --with-nth=2..`, so column 1 (the raw alias) is hidden from the user but available as `{1}` for the preview command and for the final selection parse. This is deliberate — the displayed text contains ANSI color codes and could otherwise be ambiguous.

Ordering is controlled manually: online hosts are emitted first, then offline. `fzf` is launched with `--no-sort --tiebreak=index` to preserve that order; `ctrl-s` toggles `fzf`'s own sort.

### Status probe

`classifyStatus` runs `net.Dialer.Dial("tcp", ...)` in parallel with a worker pool capped at `max(4, NumCPU*4)`. Timeout defaults to 400 ms, overridable via `SSH_NAVIGATOR_TIMEOUT_MS`. A successful TCP dial counts as online — there is no SSH handshake.

### SSH config parsing

`parseSSHConfig` is a minimal hand-rolled parser. It recognizes only `Host`, `Hostname`, `Port`, `User` (case-insensitive) and stops at the first `#`. `firstRunnableHostAlias` filters out wildcards (`*`, `?`, `[`, `]`), negations (`!...`), and anything starting with `-` so flag-like tokens can't reach `ssh`. If `Hostname` is absent the alias itself is dialed; `Port` defaults to `22`.

### Security-relevant detail

`sanitizeSSHTarget` strips ANSI, drops control runes, and keeps only the first whitespace-separated token before the alias is passed to `exec.Command("ssh", "--", alias)`. The `--` is there on purpose: combined with the alias filter in `isRunnableHostAlias`, it prevents a malicious `Host` entry from injecting `ssh` flags. Preserve both layers if you refactor the selection pipeline.
