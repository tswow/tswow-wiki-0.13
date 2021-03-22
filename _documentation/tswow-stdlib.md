---
title: tswow-stdlib
---

[Project Root](https://github.com/tswow/tswow-stdlib)

The TSWoW standard library is a TSWoW module that comes pre-packaged with TSWoW releases. It is intended to complete the [WotlkData](WotlkData.md) data script framework with easy-to-use entity builders and more experimental features.

By creating this standard library, we try to keep WotlkData itself as minimal, objective, and unchanging as possible. By their nature, entity builders and ID generation offsets are not very objective as they have to take many different perspectives into consideration. They are not very minimal since they need to be user-friendly and contain connections between many different SQL tables and DBC files, and because of the complexity this introduces they will also have to change more often to fix bugs and add missing features.

## ID Allocation

[ID Alloaction Source](https://github.com/tswow/tswow-stdlib/blob/main/data/Base/Ids.ts)

[Main Article](Ids.md)

While the core system for persistent ID allocation exists in [WotlkData](WotlkData.md), it's the standard library that defines where IDs should begin to be allocated in the different tables. Some IDs are automatically allocated since their IDs are only written when building, while some require you to provide a mod/name combination to keep them persistent.

## Entities

Most systems in the standard library servers as "Entity classes" that represent the various game entities we can create and modify.