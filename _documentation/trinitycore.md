---
title: TrinityCore
---

[Project Root](https://github.com/tswow/TrinityCore/tree/tswow)

TSWoW uses a slightly modified version of TrinityCore that tries to stay close to the upstream. While we haven't renamed any projects yet, we sometimes call this fork "TSCore".

## Code Structure

Most TSWoW-related code lies in the [TsWow](https://github.com/tswow/TrinityCore/tree/tswow/src/server/game/Tswow) directory, and some of it is in [Scripts/Custom](https://github.com/tswow/TrinityCore/tree/tswow/src/server/scripts/Custom). Any code outside of these two directories should be marked with `@tswow-begin/@tswow-end` tags, or for single-line edits, `@tswow-line` is sufficient. We do this because it clearly displays intent even for people who do not closely inspect git diffs. It also serves as a warning that we should not modify the core more than is actually necessary for critical bug-fixes and well-motivated customization.

We have merged code from some popular core modifications into our fork, such as Rochet2's transmogrification, multi-vendor and multi-trainer modules. Some of this code lives in their own directories, but if such modifications touches TrinityCores own files, they should also be marked up with appropriate `@tswow` tags. 

## External Modules

We have currently merged the following external modules into our core:

- Rochet2/Multivendor
- Rochet2/Multitrainer
- Rochet2/Transmogrification

## Live Scripting

The largest part of TSCore handles live scripting, the events they can register and the APIs they can access. The live scripting API is a heavily modified version of Elunas API, changed to replace the lua functionality with normal C++ functions, since live scripting is a C++ system. The majority of these files live in `TrinityCore/src/server/game/TsWoW`, but we have also modified `TrinityCore/src/server/game/Scripting/ScriptReloadMgr.cpp` to load our modules. 

The reason we have tswow-specific functionality for script reloading is that we don't always use the standard event managers to register events, so we need to call our own routines to properly load and unload event handlers.

## Data Scripting

We don't need much core functionality for data scripts aside from loading the `coredata/ids.txt` file, since data scripting only modifies existing entity types. However, some modifications that are not supported by TrinityCore have been added, such as custom languages.