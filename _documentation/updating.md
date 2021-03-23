---
title: Updating
---

There are two things you may want to update in TSWoW, modules and TSWoW itself. This guide will outline how to do both.

## Updating TSWoW

_Note: TSWoW version 0.11 made some fundamental changes to the project structure, you must follow some [additional instructions](todo) for migrating from older versions._ 

TSWoW itself is distributed through our [main repository](https://github.com/tswow/tswow/releases). If you wish to change your version of TSWoW, all you need to do is:

1. Download your desired version 

2. Thoroughly shut down TSWoW and vscodium. 

3. Extract `bin`, `node_modules` and `package.json` from the archive, and replace all those files in your installation.

4. Run `npm i` in the installation directory once.

5. Start TSWoW normally.

## Updating Modules

To update a module to the latest version, follow these steps:

1. Start TSWoW normally

2. Use the terminal command `module update`, optionally with a module name following it. TSWoW will then pull the source from the remote repository if any updates are available.

Currently, doing other git operations or edits on installed modules is somewhat broken. To make sure your scripts are compiled correctly, shut down tswow, remove the `noedit` file from the project root if it's present, make your changes, and then start tswow again.
