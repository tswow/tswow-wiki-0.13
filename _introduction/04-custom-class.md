---
title: Custom Class
---

This tutorial will demonstrate how to create a fully functional custom class with TSWoW. Custom classes have been a thing in WotLK for a long time, but used to be very tedious and error-prone to set up. As we will see in this tutorial, TSWoW makes creating custom classes very simple. In the next tutorials, we will also cover custom spells and trainers. 

The class we will be creating is the very same necromancer class that was shown in the [promotional video]().

_In these tutorials, you will be asked to start writing TSWoW code. It is highly recommended that you **type out** the code yourself into the editor instead of copypasting to get a feel for the autocompletion that VSCodium offers._

## Class Definition

_Note: If you create a class and later remove it (or change the modid:entityid), you need to **remove** the `config/ids.txt` file, as the current generation algorithm does not work with holes in the class IDs (your client will crash)._

Our first task will be to create the definition for our new custom class. Create a new file called `Necromancer.ts` in your `datascripts` mod folder. Enter the following code: 

```ts
import { std } from 'tswow-stdlib';

export const NECROMANCER_CLASS = 
    std.Classes.create(
        // Mod id
        'myname-mymod',
        // Entity id
        'necromancer',
        // The parent name of our class.
        'MAGE');

NECROMANCER_CLASS.addRaces(['HUMAN','ORC','BLOODELF']);

// Changes the english display name to "Necromancer"
NECROMANCER_CLASS.Name.enGB.set('Necromancer');
```

This creates a new class with the name "Necromancer" based off the Mage class. Run the `build data` command and enter the character creation screen. You should see your new class added.

{:refdef: style="text-align: center;"}
![](../necromancer-charcreate.png)
{:refdef}

### A note about WoW crashing when creating/deleting classes

In World of Warcraft, numeric class IDs must be strictly increasing with no gaps in them (going from 10, 11, 12 etc.), or the client will crash when you start up the game. TSWoW generates numeric IDs automatically when you create classes, and stores the result in your `config/ids.txt` file. This will cause issues if you create a class with one mod/identifier pair and then either change the mod/identifer, or remove the class and create another one with a different identifier pair.

To solve this problem in development, you can simply delete your `config/ids.txt` any time you remove an old class in your code before you rebuild. In production, however, you must decide yourself how to handle the effect of removing a class entirely from the game, since many players will likely have characters of that class. You may therefore wish to manually edit the `ids.txt` file.

## UI Settings

Let's change the class UI color and add a proper description. Add the following to your `Necromancer.ts` file.

```ts
// Change display color
NECROMANCER_CLASS.UI.Color.set(0xcc0077)

// Add character creation description
NECROMANCER_CLASS.UI.Info.add('- Role: Damage, Tank')
NECROMANCER_CLASS.UI.Info.add('- Light Armor (Cloth)')
NECROMANCER_CLASS.UI.Info.add('- Controls multiple undead servants')
NECROMANCER_CLASS.UI.Info.add('- Uses mana as a resource')
NECROMANCER_CLASS.UI.Description.set("Necromancers raise and control the undead.")
```

{:refdef: style="text-align: center;"}
![](../necromancer-description.png)
<br/><br/>
_Class descriptions added_
{:refdef}

{:refdef: style="text-align: center;"}
![](../necromancer-classcolor.png)
<br/><br/>
_Class color modified_
{:refdef}

## Stats

Modifying stats is also very simple to do in TSWoW. The below code modifies the Melee attack power, and Spell/Melee crit of our new class. Notice how Melee attack power uses a string to represent an equation, whereas Spell/Melee crit uses callback functions. This is because those stats work very differently under the hood in World of Warcraft, and TSWoW does its best to make modifying them as similar as possible.

```ts
// Attack power = 1337*intellect
NECROMANCER_CLASS.Stats.MeleeAttackPower.set('1337*int')
// Spell Crit = 0.1*level
NECROMANCER_CLASS.Stats.SpellCrit.set((x,level)=>1337*level)
// Melee crit = 0.1*level
NECROMANCER_CLASS.Stats.MeleeCrit.set((x,level)=>1337*level)
```

## SkillLines
Classes usually have some spell types associated with them, such as Fire for mages and Assassination for rogues. A SkillLine is **not** the same thing as a talent tree, and are instead used to classify and categorize spells. SkillLines are a fairly complex topic, but just using them for class skills luckily doesn't require much more than just creating them. We will create two for our Necromancer so we can use them in the next tutorial about spells.

Add the following to the bottom of your `Necromancer.ts` to create two SkillLines for the Necromancer class:

```ts
export const NECROMANCY_SKILL = std.SkillLines
    .createClass('tswow-introduction','necromancy-skill',NECROMANCER_CLASS.ID)
NECROMANCY_SKILL.Name.enGB.set(`Necromancy`)

export const DEATH_SKILL = std.SkillLines
    .createClass('tswow-introduction','death-skill',NECROMANCER_CLASS.ID)
DEATH_SKILL.Name.enGB.set(`Death`)
```

We won't use these until the next tutorial, so you can just leave them like this for now.

## Summary

In this tutorial, we have:

- Created a basic custom class

- Modified the character selection screen

- Modified the stats of our class

- Created SkillLines that will be used to define what spells belongs to our class.

Our final code for `Necromancer.ts` is as follows:
```ts
import { std } from 'tswow-stdlib';

export const NECROMANCER_CLASS = 
    std.Classes.create(
        // Mod id
        'myname-mymod',
        // Entity id
        'necromancer',
        // The parent name of our class.
        'MAGE');

NECROMANCER_CLASS.addRaces(['HUMAN','ORC','BLOODELF']);

// Changes the english display name to "Necromancer"
NECROMANCER_CLASS.Name.enGB.set('Necromancer');

// Change display color
NECROMANCER_CLASS.UI.color.set(0xcc0077)

// Add character creation description
NECROMANCER_CLASS.UI.Info.add('- Role: Damage, Tank')
NECROMANCER_CLASS.UI.Info.add('- Light Armor (Cloth)')
NECROMANCER_CLASS.UI.Info.add('- Controls multiple undead servants')
NECROMANCER_CLASS.UI.Info.add('- Uses mana as a resource')
NECROMANCER_CLASS.UI.Description.set("Necromancers raise and control the undead.")

// Attack power = 1337*intellect
NECROMANCER_CLASS.Stats.MeleeAttackPower.set('1337*int')
// Spell Crit = 0.1*level
NECROMANCER_CLASS.Stats.SpellCrit.set((x,level)=>1337*level)
// Melee crit = 0.1*level
NECROMANCER_CLASS.Stats.MeleeCrit.set((x,level)=>1337*level)

export const NECROMANCY_SKILL = std.SkillLines
    .createClass('tswow-introduction','necromancy-skill',NECROMANCER_CLASS.ID)
NECROMANCY_SKILL.Name.enGB.set(`Necromancy`)

export const DEATH_SKILL = std.SkillLines
    .createClass('tswow-introduction','death-skill',NECROMANCER_CLASS.ID)
DEATH_SKILL.Name.enGB.set(`Death`)
```
