---
title: Datascripts
---

Datascripts are the TSWoW way to generate static game data for the server (SQL, DBC) and the client (DBC,lua,xml). Datascripts contain powerful tools to create anything from spells, creatures and transports to entire classes, maps, dungeons and much more.

## Basics

Datascripts are kept in the `datascripts` endpoint in your module, and you can make tswow generate all necessary configuration files simply by creating this directory while tswow is running.

Datascripts are executed in tswow with the `build data` command, which will load all script files it can find, execute them, and then store the generated data in the various files and databases that wow clients and servers normally use.

The standard entrypoint for datascripts is the file `datascripts/datascripts.ts`, but datascripts do not really need an entrypoint as the build system will automatically run every script file it can find.

A very simple datascript that only prints out a message to the console when you `build data`:
```ts
console.log("Hello world")
```

## TSWoW Standard Library

The tswow standard library (wow/wotlk) contains most of the useful tools that you will need when creating datascripts. Almost all of its tools are defined via a single interface that only requires one import in your scripts:

```ts
import { std } from "wow/wotlk"
```

## Creating Entities

To create new entities, we typically use the `create` method on one of the substructs we can find through the std interface. Below is a basic example to create a new custom creature:

```ts
import { std } from "wow/wotlk"

std.CreatureTemplates.create('my-module','my-custom-creature')
```

## Loading Entities

Loading existing entities instead uses the `load` method, also commonly found on substructs to `std`:

```ts
import { std } from "wow/wotlk"

// Loads creature template with id 25
std.CreatureTemplates.load(25)
```

## Modifying Entities

Once we have created or loaded an entity, we can modify it using a special convention evolved from method-chaining that the early developers of tswow dubbed "cell-based programming". Before elaborating, a brief example of how this looks:

```ts
import { std } from "wow/wotlk"

std.CreatureTemplates
    .create('my-module','my-creature')
    .Name.enGB.set('My Creature')
    .Level.set(10)
    .Stats.ArmorMod.set(2)
```

In cell-based programming, we create data by accessing entities in a long method chain and modifying individual properties via "set" functions (or, sometimes, other functions). Once a property has been "set", the method chain always returns to the root entity again, and the process starts over. This allows a very efficient way to create data for many different types of entities in a way that almost just looks like a configuration or json file.

Understanding how a cell-based method chain works can be a bit difficult at first, and some users prefer to ignore the technical details and assume the code does what it looks like it's doing, while others prefer to avoid looping back by storing created objects in a variable, as it makes the code look a little bit more like something you would normally expect in the language:

```ts
import { std } from "wow/wotlk"

// This looks a little more like "normal" TypeScript,
// but is more verbose and cluttered.

const MY_CREATURE = std.CreatureTemplates.create('my-module','my-creature')

MY_CREATURE.Name.enGB.set('My Creature')

MY_CREATURE.Level.set(10)

MY_CREATURE.Stats.ArmorMod.set(2)
```

## Enums

Some values in the game can only take one of a few predetermined values. For example, Creatures can be one of a few predetermined `Types`, such as `UNDEAD`, `DEMON`, `HUMANOID`, `BEAST` and so on. These special types are known as `Enums`, and are commonly represented as a number in databases. TSWoW often offers convenient ways to write and read these using sensible names instead of raw numbers:

```ts
std.CreatureTemplates.create('my-mod','my-creature')
    // Changes the creature type to UNDEAD
    // Note how enum values are commonly written in ALL_UPPERCASE.
    .Type.UNDEAD.set()
```

## Masks and Flags

Enums can normally only take on one value at a time. A Creature cannot be both `UNDEAD` and a `BEAST` at the same time.

_Masks_ are similar to enums in that they can represent a predetermined set of values, but contrary to enums can take on multiple such values at once.

_note: In the database, masks are commonly represented as a single number just like enums. The technical details about how multiple discrete values can be stored in a single number isn't necessary to understand how to use masks in tswow, but for the curious reader wikipedia has a [good article on how masks/bitmasks work](https://en.wikipedia.org/wiki/Mask_(computing))._

### Flags
Masks commonly implement on/off settings fields. Masks used in that way are commonly known as _Flags_. Generally, flags are initialized to be unset / false until enabled. For example, a spells `Attributes` field is a mask/flag value that allows specifying a large amount of individual on/off settings for spells:

```ts
// Creates a spell and enables multiple flags
std.Spells.create('my-mod','my-spell')
    // Turns the spell into a passive spell that automatically applies
    // any aura effects it contains.
    .Attributes.IS_PASSIVE.set(true)

    // Hides the spell from the spellbook when taught.
    .Attributes.IS_HIDDEN_IN_SPELLBOOK.set(true)
```

### Classmasks and Racemasks

Another very common use of masks are classmasks and racemasks, which allow or deny access to a resource to certain combination of classes or races.

For example, ClassMasks can be applied to items to only allow certain classes to use them:

```ts
// Creates an item limited to human mages, priests and warlocks
std.Items.create('my-mod','my-item')
    .ClassMask.PRIEST.set(true)
    .ClassMask.MAGE.set(true)
    .ClassMask.WARLOCK.set(true)
    .RaceMask.HUMAN.set(true)
```

### Set/Add

An alternative convention to set masks is to use `set/add` on the mask object itself and specify arguments to enable in a list:

```ts
// Does the same thing as the previous example
std.Items.create('my-mod','my-item')
    .ClassMask.set(['PRIEST','MAGE','WARLOCK'])
    .RaceMask.set(['HUMAN'])
```

Similarly, we can call `remove` to disable multiple values at the same time:

```ts
std.Items.create('my-mod','my-item')
    .ClassMask.set(['PRIEST','MAGE','WARLOCK']) // priest + mage + lock enabled
    .ClassMask.remove(['PRIEST'])               // mage + lock enabled
```

**Important**: There is an important difference between `set` and `add` when called on the mask object directly:

```ts
std.Items.create('my-mod','my-item')
    .ClassMask.PRIEST.set(true) // priests enabled
    .ClassMask.MAGE.set(true)   // priests + mages enabled
    .ClassMask.add(['WARLOCK']) // priests + mages + warlocks enabled

    .ClassMask.set(['WARRIOR']) // only warrior is now enabled,
                                // because "set" overwrites any
                                // previous data.
```

### Raw manipulation
If you are comfortable writing your own bitmasks, it is still possible to set mask values by raw numbers. It is also possible to specify a second argument to specify how the input number should be merged with the existing value:

```ts
std.Items.create('my-mod','my-item')
    .ClassMask.set(0x1|0x2)       // warrior + paladin enabled
    .ClassMask.set(0x1|0x4,'AND') // warrior enabled
    .ClassMask.set(0x4,'OR')      // warrior + hunter enabled
```

## Refs

Some entities in World of Warcraft are easy to explain. A CreatureTemplate is a type of creature in the world, defining its name, stats, level, and so on. A Class is a playable character type with a defined set of learnable spells, talents and attribute points.

Other entities are more difficult to explain. For example, any data that defines how a specific spell looks is an entity on its own, called `SpellVisual`, and a single `SpellVisual` can be shared by multiple spells at once! Spells contain a special id on them to point at such a spell visual. The common name for these "pointer" ids is `Refs`.

TSWoW has a special convention to allow users fast and powerful control over how to access and modify properties across references. When accessing a reference property, the user will be met with a selection of four common functions: `set`, `get`, `getRef`, `modRef`, `getRefCopy` and `modRefCopy`. The following section will briefly explain each and provide code examples for how to use them, and what they achieve.

### get/set()

Refs are simply numeric ids stored on an entity, and calling `get/set` on them will achieve the same as calling it on any normal property: it will write the id to the underlying cell with no extra magic applied.

```ts
// Loads spell with id 133 (Firebolt rank 1)
const spell = std.Spells.load(133)

// Sets the visual reference to 0 (no reference = spell has no visuals)
spell.Visual.set(0);

// Sets the visual reference to 870 (the SpellVisual used by ShadowBolt, causes spell to look like shadowbolt when cast)
spell.Visual.set(870);

// Will print out 870, since we just set the id to 870
console.log(spell.Visual.get());
```

### getRef() / getRefCopy()

Calling `getRef()` on a reference will return the referenced entity itself, rather than the reference id. This means you can modify entities across references without externally loading the referenced entity:

```ts
import { std } from "wow/wotlk"

const spell = std.Spells.load(133)

// Returns the SpellVisual referenced by spell 133
const visual = spell.Visual.getRef();

// Changes the missile model of this spell visual
visual.Missile.Model.setSimple('Spells\\Shadowbolt_Missile.mdx')
```

One issue of `getRef` (and references in general) is that we don't really know what other entities might reference it. In the example of spells, all ranks of Firebolt (including those cast by monsters) all reference the exact same spell visual, meaning that if we use `getRef` on one spell to modify the reference, it will change it not just for our own spell, but for every single spell that reference it.

The solution is to use `getRefCopy` instead, which creates a copy of the previously referenced entity with a new id and writes this new id to the reference cell before returning the copy. Now, any changes made to the referenced entity are sure to only affect the specific entity we are modifying

_A general rule of thumb is to only ever use `getRef` when **reading** data from a reference, and `getRefCopy` when **writing** data to a reference._

### modRef / modRefCopy ()

An alternative convention to using `getRef/getRefCopy` to modify references is to use `modRef/modRefCopy`, which instead of returning the referenced entity accepts a callback that receives it. This allows modifying referenced objects without breaking cell-based method chains:

```ts
import { std } from "wow/wotlk"

std.Spells.load(133)
    .Name.enGB.set('New Firebolt spell')
    .Visual.modRefCopy(visual=>{
        visual.Missile.Model
            .setSimple('Spells\\Shadowbolt_Missile.mdx')
    })
    // outside of the callback, we are still modifying the Spell
    .Power.setMana(100)
```

_You should almost always prefer `modRefCopy` to `modRef`_

## Arrays and One-To-Many relationships

Arrays and one-to-many relationships are handled similarly to references, typically offering functions on the form `addGet(...)`, `addMod(...,callback)`, `get(...)`, `mod(...)`. The exact arguments these functions accept vary depending on the type of relation it describes. Typically, they do not have `copy` versions, since they cannot be shared by multiple outbound references at the same time the way `Refs` can.

### Arrays

Some entities in the game contain arrays of other entities. One such example is that `Spells` can contain 3 separate `SpellEffects`, all stored inside the spell itself.

Example of various ways to access array entries (using `Spell#Effects`):

```ts
import { std } from "wow/wotlk"

const spell = std.Spells.create('my-mod','my-new-spell')

// Adds a new spell effect (maximum of 3 per spell)
const eff = spell.Effects.addGet();
eff.Type.SCHOOL_DAMAGE.set();

// Modifies an existing spell effect
const oldEff = spell.Effects.get(0);
eff.Type.SCHOOL_DAMAGE.set();

// Adds a new spell effect and modifies it in a callback
spell.Effects.addMod(()=>{
    eff.Type.SCHOOL_DAMAGE.set();
})

// Modifies an existing spell effect in a callback
spell.Effects.mod(0, ()=>{
    eff.Type.SCHOOL_DAMAGE.set()
})
```

### One-To-Many Relationships

Similar to entity arrays, some entities in the game are defined as with a backreference to another entity. One such example is `SkillLineAbilities`, which defines a unique way that a specific spell can be taught, by which classes/races and to which `SkillLine` it belongs.

Example of various ways to access one-to-many entities:

```ts
// Makes spellid 133 (Firebolt rank 1) learnable
// through the fishing skill for druids
const spell = std.Spells.load(133)
let sla = spell.SkillLines.addGet()
sla.SkillLine.set(356); // skilline 356 = fishing
sla.ClassMask.set(['DRUID'])
sla.AcquireMethod.TRAINER.set()
```

## Building data

Once we have written a datascript to create or modify an entity in tswow, we use the `build data` command in the tswow shell to apply these changes to game. Normally, it will then restart the client and server for us automatically so that we can immediately log back in again and see our changes.

The `build data` command comes with a couple of useful flags:

- `--readonly`: Will execute all datascripts, but will not output any data to the game. Useful for debugging, will not restart server or client on use.

- `--client-only`: Will execute all datascripts, but will only write client and not server data. Useful for aesthetic changes, and will only restart the client on completion.

- `--no-shutdown`: Will execute all datascripts and write data, but will not shutdown or restart the server or client.

- `--rebuild`: Will rebuild the entire destination `world` database, which is sometimes necessary to clean out changes to existing entities in the game. This is a slow operation, and should only be used when you really find old game data.


## Dirty database
TSWoW is a migration system that expects users to continuously execute their scripts to update the world state.

To achieve this, datascripts separates the **input** data that it reads from the **output** data that it writes. For DBC, this means tswow **reads** from one set of DBC files and **writes** to another set. For SQL, it means tswow **reads** from one world database and **writes** to another.

Most data that tswow builds is completely rewritten and undone on each execution, but not all of it. SQL data specifically is so slow to rebuild entirely that we have to leave some of it hanging until a full rebuild is triggered with the `--rebuild` flag. TSWoW does its best to clean up after itself even without it, but there are a few instances where it falls short:

### Modifying an entity in the game and removing the modification:

First build:
```ts
import { std } from "wow/wotlk"

std.CreatureTemplates.load(25).Name.enGB.set('Hello');
```

Second build:
```ts
import { std } from "wow/wotlk"

//std.CreatureTemplates.load(25).Name.enGB.set('Hello');
```

Becasue creature names live in the SQL database, tswow will not notice that the name of creature with id 25 is no longer changed from its original value. The solution to this is simply to use the `--rebuild` flag when you need to test something with the original data again.

## Client Interface Manipulation (Lua/XML mods)

The graphical interface in the game are implemented using Lua and XML files. There are three ways that client interfaces can be manipulated and created in tswow:

- Replacing existing files by overriding them in your mods `assets` directory.

- Creating an [addon](../addons/)

- LUAXML manipulations in datascripts.

Overriding interface files via the `assets` directory or an addon are commonly easier for major changes, but will not work if multiple modules or parts of the build pipeline need to modify the same files. This is especially common to break if modifying class-related interface files and also creating your own custom classes using datascripts, as tswow will automatically apply modifications to lua and xml files to make those work.

For files that need to be accessed by multiple modules, or that collide with custom class modifications, it is therefore recommended to use the third method and manipulate luaxml through datascripts.

This can be done via the `std.LUAXML` interface. Through this interface, we can either `replace` lines, or insert values `before` or `after` a line matching a regular expression.

```ts
import { std } from "wow/wotlk"

const file = std.LUAXML.file('Interface/GlueXML/GlueStrings.lua')
file.replace(/RACE_INFO_BLOODELF =/,'RACE_INFO_BLOODELF = "Custom blood elf description";')
file.before(/RACE_INFO_BLOODELF/, '-- Comment before blood elf description')
file.after(/RACE_INFO_BLOODELF/,  '-- Comment after blood elf description')
```

To allow multiple edits targeting the same tags or line numbers, edits are stored and not applied until all scripts have finished executing. It is also possible to access a previously made edit and change its text to avoid adding multiple edits to a single line:

```ts
const file = std.LUAXML.file('Interface/GlueXML/GlueStrings.lua')

const blood_elf_description =
    file.replace(
          /RACE_INFO_BLOODELF = /
        , `RACE_INFO_BLOODELF = "Your description here"`
    )
blood_elf_description.text = `RACE_INFO_BLOODELF = "My description"`;
```

## InlineScripts

_InlineScripts is an advanced and **highly experimental** feature_

Do you hate having to switch between datascripts and livescripts and spamming out GetID declarations for every single entity you want to register events for?

InlineScripts is a new API to write a livescripts _inline_ with your datascripts. A simple example:

```ts
import { std } from "wow/wotlk"

// This is a normal datascript
std.Spells.create('my-module','my-spell')
    .Name.enGB.set('My Spell')
    .CastTime.setSimple(1000)
    .Cooldown.set(1000)
    .InlineScripts.OnCast((spell)=>{
        // now, we're inside a livescript!
        if(spell.GetCaster().IsPlayer()) {
            spell.GetCaster().ToPlayer()
                .SendBroadcastMessage(`You cast "My Spell"!`)
        }
    })
```

It is also possible to register non id-bound events through InlineScripts:

```ts
import { std } from "wow/wotlk"

std.InlineScripts.Player.OnSay((player, message)=>{
    player.SendBroadcastMessage(`You said: ${message.get()}`);
});
```

While InlineScripts allow a very convenient way to keep scripts in the same files as you define the data for them, they come with a lot of caveats:

- InlineScripts cannot access **any** variables or functions outside of themselves and the arguments that they receive, not even constant primitives. External IDs need to be fetched with `GetID` calls just like normal livescripts.

- InlineScripts are experimental and much more prone to compiler bugs than normal livescripts, and could end up locking you to specific versions of `swc` or `tsc` to build correctly in the future.

- InlineScripts can be very deceiving for people that don't already know what they are. All of a sudden a callback runs in a completely different runtime from the outside scope, and isn't even transpiled to the same language in the end. It _looks_ like you can access variables or functions just like a normal callback, but in reality that is not possible at all.

- InlineScripts cannot be written in C++

- InlineScripts must always execute at least the datascript files that they belong to in order to update. The more InlineScripts you add to different datascript files, the more your livescripts build times will depend on your datascript build times.

Generally, InlineScripts are handy to add very simple scripted behavior on the level of a `SmartScript`, but very quickly falls apart for complex behavior or anything that references multiple entity ids. More complex entities, such as battlegrounds, are generally much cleaner to write in a real livescript.

### Building

For completely new entities it is necessary to run both `build data` and `build scripts` for the entity to be created and the script to work, but once the entity has already been created it is enough to run `build scripts` to add, remove or modify InlineScripts.

_InlineScripts were inspired by the Warcraft III modding language [WurstScript](https://wurstlang.org/)._