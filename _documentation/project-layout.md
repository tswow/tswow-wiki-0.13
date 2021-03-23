---
title: Project Layout
---

This document should outline the various sub-projects of TSWoW and their components.

## wotlkdata - [Main article](../wotlkdata/)

[wotlkdata on GitHub](https://github.com/tswow/tswow/tree/master/tswow-scripts/wotlkdata)

WotlkData is a TypeScript Object-Relational-Mapping framework that contains mappings for every DBC file for the 3.3.5a version of the game and every SQL table available for the current revision of TrinityCore that we use, and also contains some crude tools to modify client Lua/XML files. This project is the basis for all TSWoW _data scripts_ and the TSWoW standard library.

## tswow-stdlib - [Main article](../tswow-stdlib/)

[tswow-stdlib on GitHub](https://github.com/tswow/tswow-stdlib)

The TSWoW standard library is a TSWoW module that comes pre-packaged with the TSWoW release. It contains an API for data scripts that wraps around the raw DBC/SQL files WotlkData provides into coherent **entities** that can be more easily edited by users, such as _Items_, _Classes_, _Quests_ and _Creatures_.

## TrinityCore - [Main article](../trinitycore/)

[tswow/TrinityCore on GitHub](https://github.com/tswow/TrinityCore/tree/tswow)

TrinityCore is the **server core** that TSWoW uses. It stays fairly close to the original TrinityCore upstream to stay up to date with the latest bugfixes and improvements, and to not further split the community along yet another incompatible fork. 

## Compile Scripts

[tswow-scripts on GitHub](https://github.com/tswow/tswow/tree/master/tswow-scripts/compile)

_This project could probably use a better name._

This project contains script files used to build TSWoW. It is located in `tswow/tswow/tswow-scripts/compile/`

## Runtime

[tswow-scripts/Runtime on GitHub](https://github.com/tswow/tswow/tree/master/tswow-scripts/Runtime)

_This project could probably use a better name._

This project contains script files used by the main TSWoW process that developers interact with. It contains tasks such as running a MySQL server, starting and stopping the worldserver, applying patches and so on.

Most of its files are located in `tswow/tswow/tswow-scripts/runtime`.

### MPQBuilder

[MPQBuilder on GitHub](https://github.com/tswow/tswow/tree/master/mpqbuilder)

This project is a c++ binary that is used to package MPQ files and to extract DBC/LUA/XML files from them. 

Its files are located in `tswow/mpqbuilder`.

### External Modules

These are the external modules used with little to no modification by TSWoW:

- BLPConverter: Used to mass-convert blp and png images back and forth with the `png` and `blp` commands.

- StormLib: The MPQ library used by [MPQBuilder](#MPQBuilder)