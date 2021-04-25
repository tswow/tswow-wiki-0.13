---
title: Custom Talents
---

This tutorial will teach you all you need to know about how to create talent trees and talents for your custom class. While talents are a fairly simple concept, this tutorial assumes you have already worked through the [Custom Spells](5_CustomSpells.md) exercises.

## Talent Trees

TSWoW provides an API to create and load talent trees for any class. Create a new file called `Talents.ts` and add the following code: 

```ts
import { std } from "tswow-stdlib";
import { NECROMANCER_CLASS } from "./Necromancer";

// Creates a new talent tree at index 0 (the first talent tree)
export const NECROMANCY = std.TalentTrees.create('tswow-introduction','tswow',0,[NECROMANCER_CLASS.ID])
NECROMANCY.Name.enGB.set(`Necromancy`);
```

If we rebuild our scripts with the `build data` command and level up a necromancer to level 10 (`.levelup 9`), we can see that we have an empty talent tree called "Necromancy".

{:refdef: style="text-align: center;"}
![](../necromancy-talents.png)
{:refdef}

## Talents
As you might remember from the last tutorial, we were able to find a spell ID by looking directly into our talent tab. The simple reason for that is that there is no difference between a talent and a spell. Talents are just spells that have been added to a talent tree. If a talent slot has five ranks in it, that just means there were five separate spells added to that slot. The spells added to a slot does **not** have to be ranks of the same spell, as we will soon see.

The one difference between learning spells normally and through a talent tree is that learning a higher rank of a talent always removes the lower ranked spells.

### Adding arbitrary spells as a talent

To illustrate the above section, we will create a very silly example talent consisting of the spells `Fireball` (ID 133), `Shadow bolt` (ID 686), `Auto Attack` (ID 6603), and finally `Sinister Strike` (ID 1752). 

Add the following line to your `Necromancer.ts` file: 

```ts
NECROMANCY.addTalent('tswow-introduction','silly-talent',0,0,[133,686,6603,1752])
```

Rebuild the code using `build data`, level up a necromancer to 15 and look at your talent tree. You should see fire bolt as the talent icon.

{:refdef: style="text-align: center;"}
![](../fireball-talent.png)
{:refdef}

If we click it once, it will state that we have now learnt Fireball and that the icon stays the same. If we click it again to learn the second rank something happens, however. 

{:refdef: style="text-align: center;"}
![](../shadowbolt-talent.png)
{:refdef}

The icon has changed to shadow bolt, and if we open our spell book we can see that we have unlearnt fireball and instead learnt shadow bolt. If we click it again it will likewise change to auto attack, and we have unlearnt shadow bolt.

Clicking the talent one last time changes the icon to Sinister strike, and if we open our spell book we can see that we have **unlearnt auto-attack**, despite that we already knew it from before. 

{:refdef: style="text-align: center;"}
![](../no-autoattack.png)
{:refdef}

## Creating a real custom Talent

We have shown that talents are just normal spells and we could really stick just about anything in our talent trees, but let's create something that talents are more often used for: modifying the behavior of other spells. For this, will create a talent that reduces the cast time of the abomination spell that we created in the previous section.

### Starting out

Our strategy will be the same as when we made other custom spells: find a spell that resembles what we're trying to create. Mages has a talent that reduces the cast-time of their Fireball, so perhaps we can somehow repurpose that to affect Summon Abomination instead?

{:refdef: style="text-align: center;"}
![](../imp-fireball.png)
{:refdef}

However, we must also figure out how to actually change the spell to affect our summoning spell instead of fireball. We know that this spell affects multiple other spells since there are multiple fireballs, but that it doesn't just affect every single spell in the game. To keep this section focused on talents, we will simply say that the spell effect that does the casttime reduction happens to use what is called a ClassMask. This classmask must match with the classmask of the spell we are trying to modify, and TSWoW has a fairly simple way of achieving this.

Add the following code to your `Talents.ts` file, importing SUMMON_ABOMINATION by hovering it and pressing `ctrl+.`:

```ts
// Load the Improved Fireball spell
const IMPROVED_FIREBALL = std.Spells.load(11069)

export const IMP_ABOMINATION = 
    std.Spells.create('tswow-introduction','imp-abomination-spell',11069)
IMP_ABOMINATION.Name.enGB.set(`Improved Summon Abomination`);

// Notice how we match a specific effect in the improved fireball spell
SUMMON_ABOMINATION.ClassMask.match(IMPROVED_FIREBALL.Effects.get(0))

// This spell happens to store the casttime reduction in the effects "BasePoints" field
// So we change this to -9000 for a 9 second cast-time reduction.
IMP_ABOMINATION.Effects.get(0).BasePoints.set(-9000)

NECROMANCY.addTalent('tswow-introduction','imp-abomination-talent',0,1,[IMP_ABOMINATION.ID])
```
Learning this talent and trying to cast summon abomination now should convince you that the talent is indeed working as intended. ClassMasks are slightly more complex than we have shown here, but we think learning just exactly how they work is a little too out of scope for this tutorial. You will however most certainly encounter them again if you do anything involving talents, and generally it is sufficient to use this method for them to work. 

## Talent Requirements

Talents can depend on other talents. Creating such a requirement is very simple in TSWoW:

```ts
IMP_ABOMINATION_TALENT.Requirements.add(SILLY_TALENT.ID, 3);
```

This makes Improved Abomination require at least 3 points in the silly talent to work.

## Conclusion

In this tutorial, you have learnt how to:

- Create a talent tree

- Create talents from existing spells

- Create a custom talent spell that modifies another spell

- Make one talent required for another

Our final code in `Talents.ts` becomes:

```ts
import { std } from "tswow-stdlib";
import { NECROMANCER_CLASS } from "./Necromancer";
import { SUMMON_ABOMINATION } from "./SummonAbomination";

// Creates a new talent tree at index 0 (the first talent tree)
export const NECROMANCY = std.TalentTrees.create('tswow-introduction','tswow',0,[NECROMANCER_CLASS.ID])
NECROMANCY.Name.enGB.set(`Necromancy`);

// Load the Improved Fireball spell
const IMPROVED_FIREBALL = std.Spells.load(11069)

export const IMP_ABOMINATION = 
    std.Spells.create('tswow-introduction','imp-abomination-spell',11069)
IMP_ABOMINATION.Name.enGB.set(`Improved Summon Abomination`);

// Notice how we match a specific effect in the improved fireball spell
SUMMON_ABOMINATION.ClassMask.match(IMPROVED_FIREBALL.Effects.get(0))

// This spell happens to store the casttime reduction in the effects "BasePoints" field
// So we change this to -9000 for a 9 second cast-time reduction.
IMP_ABOMINATION.Effects.get(0).BasePoints.set(-9000)

NECROMANCY.addTalent('tswow-introduction','imp-abomination-talent',0,1,[IMP_ABOMINATION.ID])
```
