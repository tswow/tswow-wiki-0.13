---
title: Updating
---

There are two things you may want to update in TSWoW, modules and TSWoW itself. This guide will outline how to do both.

## Updating TSWoW

TSWoW itself is distributed through our [main repository](https://github.com/tswow/tswow/releases). If you wish to change your version of TSWoW, all you need to do is:

1. Download your desired version 

2. Place the `.7z` file in your TSWoW installation directory, and rename it `update.7z`.

3. Start TSWoW, the update will be applied and TSWoW will then start normally. Note that you have to rebuild all live scripts if you update TSWoW.

Updating this way only replaces files in your `node_modules` and `bin` directories and keeps your configuration, modules and coredata.

## Updating Modules

To update a module to the latest version, follow these steps:

1. Start TSWoW normally

2. Use the terminal command `module update`, optionally with a module name following it. TSWoW will then pull the source from the remote repository if any updates are available.

Currently, doing other git operations or edits on installed modules is somewhat broken. To make sure your scripts are compiled correctly, shut down tswow, remove the `noedit` file from the project root if it's present, make your changes, and then start tswow again.
