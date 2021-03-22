---
title: Id Generation
---

In World of Warcraft, most static and dynamic entities have domain-local numeric IDs, meaning ID numbers can collide between tables but must be unique within them.

The problem with numerical IDs is that they don't make much sense to humans, and that there aren't enough of them to ensure that ID numbers of mods won't collide with each others. With a system of numerical IDs, very many mods are likely to use IDs at exactly 1,000,000, for example. Furthermore, some tables require IDs to increment in an exact order with no gaps, which would require users to manually figure out exactly how many other mods are incrementing that exact ID.

For this reason, TSWoW has schemes to allocate IDs dynamically. There are two schemes for this: temporary allocation and persistent allocation.

## Temporary Allocation

Temporary allocation simply means that we have an auto-incrementing id that starts at a specified value every time we build data scripts. This is used for IDs where it doesn't matter if it changes between runs, as it is always written directly to the fields that reference it and isn't used externally by the game anywhere. For example, **loot tables** are only referenced by the entities that bind them, and since we always construct all entities at build-time, it doesn't matter if these IDs change between builds. The CreatureLoot id counter starts at 1,000,000 every build, and the order that modules increment it should not matter.

## Persistent Allocation

Persistent allocation means that we bind an ID to a specific mod/name combination, as explained in the introduction tutorial. This ensures that, for example, if we create a creature template with the full identifier "my-mod:my-creature", this creature template will **always** receive the same ID if patches are built multiple times. This is necessary for tables that are referenced externally, such as spell IDs that are stored in player spellbooks, items that are stored in inventories, classes that are stored in character stats etc.

Persistent IDs are stored in the file `config/ids.txt`, which is copied to the read-only file `coredata/ids.txt` when the worldserver is started. This file is written in a plain-text format, as users may sometimes have to manually edit it. For example, if they remove a module that added to a table that requires continuity (such as `titles`), they must choose how to resolve the issue, since if they just decrease the following title IDs by 1 all those IDs in the character database will become incorrect.

## Live Scripts

Currently, IDs created by a module will all be written to the `scripts/IDs.ts` file in the module by that same name. This file can be used to reference persistent IDs from live scripts directly. However, this currently means that if you want to access persistent IDs in your module, the "mod" name you use must actually match your module name. Currently, there is no way to access the persistent IDs of another module in live scripts. These files are only written if there exists a `scripts` subdirectory in your module, so create one and rebuild if you don't receive any ID file.

## Technical

The system code for persistent allocation is currently stored in `wotlkdata/Ids`, while all ID range definitions and temporary allocation are stored in `tswow-stdlib/data/Base/Ids.ts`. While this is temporary, `tswow-stdlib/data/tswow-stdlib-data.ts` is the data script that writes `scripts/IDs.ts` files.

The server core files that loads IDs are in `TrinityCore/src/server/game/TsWow/Scripting/Public/TSIDs.h` and `TrinityCore/src/server/game/TsWow/Scripting/Private/TSEventLoader.cpp`