---
title: wotlkdata 
---

[wotlkdata on GitHub](https://github.com/tswow/tswow/tree/master/tswow-scripts/wotlkdata)

WotlkData lives in `tswow/tswow-scrips/wotlkdata`. It was originally a standalone module that could read and patch all WotlK DBC files and SQL tables for various cores, however this has now been limited to TrinityCore database tables only.

The purpose of this module is to provide:

- Object-relational models for all 3.3.5 DBC files and TrinityCore SQL tables.

- Data-script loading and patch building

- Persistent [ID generation](Ids.md)

- Multi-user Lua/XML file text patching

- Base classes for [cell-oriented programming](CellOrientedProgramming.md)

The aim for WotlkData is to be as minimal, unchanging and objective as possible. Code that does not fit in WotlkData should instead be added to the [standard library](StandardLibrary.md).


## Building

These sections will briefly explain how WotlkData builds various file formats and tables.

## DBC Building

TSWoW keeps two sets of DBC files, a source set (`coredata/dbc_source`) which is created from client files, and a destination set (`coredata/dbc`) which is built from the source set and data scripts. When the data script in a module requests a DBC file, it is read from the source set into an in-memory buffer, which is kept open for other scripts until building is finished. This buffer can be accessed through a cell-based row for that particular DBC file: 

```ts
// Creates a new row in the Spell.dbc buffer, and returns a cell-based spell row pointing at it.
const spell = DBC.Spell.add(1007688)
// Writes a new string to the DBC buffer
spell.Name.set({enGB:'My New Spell'})
```

Once all data scripts are finished, all loaded buffers are saved into the **destination** set, which is later copied to the client and loaded by the server. Separating files into source and destination sets allow us to always read "clean" DBC data when we start new patches.

## SQL Building

SQL builds targets the "world" database of our TrinityCore installation. Similar to the DBC files, we keep a source world database to read from and a destination database to write to, which again ensures that data scripts always read "clean" data. We use the `deasync` module to make SQL calls to the source database synchronous, since asynchronous calls would be too complex to effectively work with. To boost performance, we attempt to cache as much data in memory as possible, and when data is finally written to the destination database, we again use asynchronous calls since users never do this directly.

### Cleaning

Since SQL tables are a lot slower than DBC files, we cannot completely rebuild them every time we patch (that would take multiple minutes every time). Instead, we attempt to clean up the destination tables before we build as good as we can. We especially try to clean up tables that can easily have unexpected behaviors with stray rows, such as `smart_scripts` and `trainer_spells`, since their primary keys are actually foreign keys owned by creatures and gameobjects. To clean them, we abuse columns such as `VerifiedBuild` and `Comment` in rows added by TSWoW to place tags we can easily use to drop all rows that contain them. For VerifiedBuild columns, we use the number `17688`, and for Comment columns we use the string `"tswow"`. Before we start executing data scripts, we drop all columns in those tables that contain these tags. This strategy can successfully remove any new rows that tswow adds in supported tables, but cannot do so in tables without these columns. Furthermore, it cannot fix pre-existing rows that TSWoW modifies, since we have no way of keeping track of those changes. Modders are encouraged to be aware of these caveats, even if they don't understand entirely why they exist.

Cleaning is **always** performed every time data scripts are rebuilt, because it is a very fast operation.

### Rebuild

TSWoW does have a way to completely rebuild the destination world database in mere seconds, but because it is fairly unstable and hacky we try to avoid it as much as possible. We abuse the fact that all the tables in the world database use MyISAM as its storage engine, which means that all database items are stored in a folder with no external pointers. We can therefore rebuild the entire database by doing the following:

First, when we have initially built the world database, we shut down MySQL and create **two** copies of the clean database directory (written to `coredata/mysql_plain/world_plain_1` and `coredata/mysql_plain/world_plain_2`).

Then, when we want to rebuild the database:

1. Shut down MySQL and the world server

2. Remove the world database folder

3. Synchronously **move** `world_plain_1` to the world database location

4. Asynchronously **copy** `world_plain_2` to `world_plain_1`.

5. Restart MySQL and the world server without waiting for the above copy.

6. Wait for the copy before allowing another rebuild.

This copies the clean version of the destination database without even waiting for the filesystem copy before restarting the database. 

To build data patches with rebuilding, you can use the "rebuild" flag: `data build rebuild`. Be aware that this has a tendency to corrupt your entire mysql data directory, so you should not use it on a production database with players without backing it up. If your mysql folder becomes corrupt (worldserver crash after rebuild, mysql errors, TSWoW crashes) then shut down TSWoW, remove `coredata/mysql` and start TSWoW again, it will automatically rebuild from the source TDB and this can take a couple of minutes to complete.

## Lua/XML Building

For client Lua and XML file, we have a scheme to manipulate them line-by-line to attempt to allow multiple TSWoW modules and data patches to modify the same lua and xml files without conflicts. Similar to DBC files, we keep Lua/XML files in a source and a destination set, load files into memory from the source set when they are requested, and then save them to the destination set when all data scripts are done. Just like DBC files and unlike SQL tables, Lua/XML files are always rebuilt in their entirety.

_Note: Lua/XML building is about modifying built-in client files by replacing source code lines, not for creating add-ons using TypeScript. TSWoW currently has no system to create add-ons._