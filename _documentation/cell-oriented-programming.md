---
title: Cell-oriented Programming
---

One the most fundamental features of the WotlkData modding framework are the modules that enable what we call "Cell-oriented programming". 

In World of Warcraft, related data can live in a lot of very sparse places. For example, classes are defined in the DBC file `ChrClasses.dbc`. The races that can be this class is defined in `ChrBaseData.dbc`, the default clothing in `CharStartOutfit.dbc`, some spells in `SkillLineAbilities.DBC`, `ChrRaceClassInfo.dbc`, other spells in SQL tables, stat data in six different DBC files, character creation and UI information in five different LUA files and an XML file and so on.

Traditional object-oriented programming isn't very good at modelling data that lives in such vastly different places and formats, partially for the code structure and partially as a performance concern: we don't want to load massive DBC files into javascript objects if we can avoid it*. However, we still want the auto-completion, inheritance and information hiding that OOP is typically very good at providing, and to reconcile this we invented what we call cell-oriented programming.

_*Before we had cell-oriented programming, loading Spell.dbc into memory took ~3 seconds on my machine as we had to create JavaScript objects for every single entry, and after we implemented it this time is down to 100ms, since we can now just represent the entire file as a raw memory buffer. For most applications, this is worth the cost of indirection since the vast majority of rows will likely never be touched_.

## Cells

In cell-oriented programming, we use classes, methods and inheritance just like in standard OOP. The difference is that instead of fields, classes contain **cells**.

A Cell is simply a structure that knows how to read and write some value or an array of values of a specific type. It contains two abstract functions, `set` and `get`, and for arrays also `setIndex`, `getIndex` and `length`. For example, a number Cell might know how to write an int32 to some specific offset in a DBC file, or set one or multiple columns in an SQL table. It might also not do anything at all and just return a random value when `get` is called.

Cells are quite similar to pointers, in that they allow us to modify values at very arbitrary places in memory. However, a cell does not necessarily point at a memory location, but can do pretty much anything in response to a read or write. This allows us first and foremost to create hidden indirection: A pointer cannot point at another pointer and hide this fact from the user without breaking it, but a cell can do this since its accessors are just abstract functions.

Another important difference is that Cells, and cell-based classes, retains knowledge of what object "owns" them. When the "set" function of a cell is called, it always returns its owner, which allows for efficient method chaining: 

```ts
// name, subname and IconName are Cells
SQL.creature_template.add(1007688)
    .name.set('My Creature')
    .subname.set('My Title')
    .IconName.set('Interface\\Icons\\MyIcon.blp')
```

## Systems, Subsystems and Ownership

Classes that contain cells typically, but not necessarily, inherit from either MainSystem or SubSystem. A Main System is a system that does not have an owner, while a SubSystem does. Systems are used to contain multiple cells, and have methods to automatically wrap cells belonging to other systems, which creates a new cell indirectly pointing at the wrapped cell, but with the current System as the owner instead. This allows us to easily build multiple layers of abstractions on top of each others, while retaining the simplicity of allowing users to just assign values to an object: 

```ts
std.CreatureTemplates.create('my-mod','my-creature',480)
    // Name cell, wraps multiple SQL cells in different tables
    .Name.set({enGB:'My Creature'})
    // Subsystem with a "set" method, wraps two SQL cells
    .Level.set(10,20)
    // Subsystem that adds values to an SQL table
    .Loot.Normal.addItem(25,10,1,1)
```

Subsystems allow us to also do composition in a cell-oriented manner: Just like cells, they contain references to their owners. The owner of a subsystem can always be accessed via the special "end" field.

```ts
std.CreatureTemplates.create('my-mod','my-creature',480)
    .Loot.Normal
        // addItem returns the "Normal" subsystem, not the CreatureTemplate
        .addItem(25,10,1,1)
        .addItem(35,10,1,1)
    .end
    
    // Now, we're back at CreatureTemplate (notice how we skipped past "Loot")
    .Name.set({enGB: "Creature Name"})
```

One issue with subsystem ownership is that it isn't entirely clear whether a method should return its immediate subsystem or the owner of the subsystem, nor whether a direct container of a subsystem should always be considered its owner (above, CreatureTemplate is the owner of Loot.Normal, not Loot). In our standard library, this isn't as consistent or well-documented as it perhaps should. Generally, we try to make deep composed subsystems or array entries return themselves in their methods and cells, while shallow non-array subsystems returns the most important container as the owner, typically the "root" entity (creature, quest, item, class etc.).

Hopefully, autocompletion makes it clear enough what system a method chain is currently accessing, and if it's not users can always opt for just not using them at all. We consider ownership and method chaining to be advanced features of TSWoW, and thus our introductory tutorial does not even mention it. **Ownership has no meaningful use outside of method chaining**.

## Objectify

A final benefit of cell-oriented programming is what we call "objectifying". Since Systems and Subsystems can contain arbitrary cells pointing at many different files and formats, and a cell knows how to access concrete values even through layers of indirection, we can write a function that automatically translates a complex Cell-based system down to a simple JSON object that can be used to inspect it as a coherent unit. In TSWoW, this function is called "objectify", which we use extensively in the introductory tutorial. 