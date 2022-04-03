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

Persistent IDs are stored in the file `coredata/datasets/<dataset>/ids.txt`, for most typical cases `coredata/datasets/default/ids.txt`. This file is written in plaintext, as users may sometimes have to edit it manually. For example, if they remove a module that inserted a value into a table that requires continuity they must choose how to resolve this issue so at to not corrupt the characters database if they are developing a live server.

### Strategies for handling ID gaps

Since 0.13, TSWoW will attempt to automatically find and report gap errors. There are three primary ways a user may resolve issues like these, each fit for different situations. These examples will assume custom classes (the `ChrClasses` table), as that is by far the most common place where this happens, but the same logic will apply to any other table that does not allow discontinuity. Additionally, removing **any** kind of persistent entity, even those that do not cause gap errors, is very likely to require manually cleaning up the realms `tswow_characters_<realmname>` database.

#### Flushing out the ID file completely
This is the simplest method, but also the most destructive. Simply type in `clear ids default` (or any other dataset name in place of 'default') and run your datascripts again. This will force the build script to recalculate all persistent ids, but will completely break the characters database. This is a good solution when a server is just in development because it's very easy to do.

#### Manually rewriting the id file
Users may also open their id file, typically located at `coredata/datasets/default.ids.txt` and remove the lines causing discontinuity. For example, if a user registered two development classes `modid:a` to id 12 and `modid:b` to id 13 and later removing `modid:a`, they may open the id file and change the class lines as such:

```
ChrClasses|modid:a|12|12|
ChrClasses|modid:b|13|13|
```

To

```
ChrClasses|modid:b|12|12|
```

This will ensure that the only thing breaking in the characters database is players who had any of the classes `modid:a` (who are now the class `modid:b`) or `modid:b` (who are no longer valid characters, and won't show up in the character selection screen).

#### Dummy entities / Manually cleaning characters database
This is the least destructive option, and thus fit for changes to a live server where the characters database is not allowed to corrupt. Instead of removing the old classes, we can simply leave them be, but without adding any valid races (stopping new characters serverside) and hiding away their creation UI button (hiding their existence from the client):

```
std.Classes.create('modid','a','MAGE').UI.ClassButton.setPos(-9999,-9999)
```

For existing characters, it may be necessary to additionally remove them from the `characters` table in the `tswow_characters_<realmname>` database . TSWoW does not provide any specific tools to do this, but we would recommend a database administration tool such as [HeidiSQL](https://www.heidisql.com/), [MySQL Workbench](https://www.mysql.com/products/workbench/) and [DBeaver](https://dbeaver.io/).

## Live Scripts

Sometimes, it is necessary to use ids we generate in datascripts in livescripts, usually to attach behaviors to specific creatures, gameobjects or maps. Instead of hardcoding numeric ids, it is recommended to use the `GetID` function in your scripts global scope to read ids directly from the ids.txt file itself.

Currently, TSWoW will generate such statements to the file `coredata/IDs.ts` whenever datascripts are built, and it's recommended to copy them from that file instead of typing them out manually to ensure the correct table id is used.

### Example

For example, if we have created the creature `mymod:mycreature` and wish to reference it in a livescript, we first open the file `coredata/IDs.ts`. This file may contain many entries, so it is recommended to ctrl+f search for `"mymod","mycreature"`. This should get us a line like this:

```ts
export const MYMOD_MYCREATURE : uint32 = GetID("creature_template","mymod","mycreature");
```

This line can then be copied to a livescript to use for script attachment or references:

```ts
export const MYMOD_MYCREATURE : uint32 = GetID("creature_template","mymod","mycreature");

function Main(events: TSEventHandlers) {
    // use to attach a script
    events.CreatureID.OnDeath(MYMOD_MYCREATURE,(creature,killer)=>{

    });

    // use in a comparison
    events.Creatures.OnDeath((creature,killer)=>{
        if(killer.GetEntry() === MYMOD_MYCREATURE) {

        }
    })}
```

## Technical

The system code for persistent allocation is currently stored in `wow/data/Ids`, while all ID range definitions and temporary allocation are stored in `wow/wotlk/std/Ref/Ids.ts`.

The server core files that loads IDs are in `TrinityCore/src/server/game/TsWow/Scripting/Public/TSIDs.h` and `TrinityCore/src/server/game/TsWow/Scripting/Private/TSEventLoader.cpp`
