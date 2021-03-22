---
title: Commands
---

There are types of commands in TSWoW: **ingame commands**, **terminal commands** and **startup commands**.

## Terminal Commands

These are typed directly into the command window of a running TSWoW process. These commands should not be outlined in this document, because they can all be found by typing the `help` terminal command.

## Ingame Commands

These commands can be typed by a player in the game.

| Command   | Arguments   |  Description  |
|-----------|-------------|---------------|
| `.at`     | comment?    |  Appends the players current world position to `positions.txt` in the root TSWoW directory. Any comments are added as code comments
| `.id`     | _None_      |  Prints the ID of the players selected creature to the ingame console.

## Command-line Programs

These are the commands you can type into a command-line prompt in the root TSWoW directory.

| Command        | Arguments   |  Description  |
|----------------|-------------|---------------|
| `npm run start`     | noac? |  Starts TSWoW. If noac is provided, the client/server won't be started automatically.
| `npm run symlink`          | modulename? letter? |  **Must be run from an administrator console**. Creates symlinks for module asset directories. If a module name is provided, only this module will be symlinked otherwise all modules will be checked. If a letter is provided (only valid for a specific module name), this letter will be used in the MPQ patch directory name, otherwise the first unused letter will be selected.