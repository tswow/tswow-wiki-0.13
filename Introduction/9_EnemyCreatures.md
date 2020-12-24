# Enemy Creatures

[Back to Table of Contents](README.md)

This section will be a brief introduction to how to create enemy creatures. We will look at spawning, random movement, combat stats and factions.

## Creating an Enemy Creature

Creating an enemy creature is generally no different from any other entity: we find the creature most like the one we want to make, copy it and make only the changes we actually need.

Let's create a basic zombie entity and spawn a few of them. Create a new file called `EnemyCreature.ts` and enter the following code:

```ts
// Create a mob based on the zombies in Deathknell. 
const ZOMBIE = std.CreatureTemplates
    .create('mymod','zombie',1501)

// Random positions behind northshire abbey, between the sawmill and river.
const positions = [
    Pos(0,-8860.666016,-261.928772,80.420403,2.052581),
    Pos(0,-8872.766602,-269.979706,79.303566,3.072814),
    Pos(0,-8863.773438,-281.623444,78.845047,4.894153),
    Pos(0,-8849.226563,-282.741882,79.074303,1.732141),
    Pos(0,-8832.603516,-280.921326,78.904022,0.446443),
    Pos(0,-8842.893555,-293.981720,78.108154,4.027075),
    Pos(0,-8857.631836,-300.569183,77.552925,3.555051),
    Pos(0,-8888.351563,-308.467163,74.824699,2.529320),
    Pos(0,-8905.495117,-286.458191,77.376122,2.452351),
    Pos(0,-8924.399414,-270.791168,77.919647,0.761388),
    Pos(0,-8900.039063,-255.879608,79.980675,0.271300),
    Pos(0,-8872.840820,-244.551208,82.048447,4.263481),
]

// Iterate over each position, and spawn a zombie based on it.
for(let i=0;i<positions.length;++i) {
    const spawn = ZOMBIE.spawn('mymod',`zombie-spawn-${i}`,positions[i]);
}
```

Storing the positions in an array makes it easier to copypaste directly from the positions.txt file, and leads to slightly less code to write. To get these positions, I just ran around the area behind Northshire abbey and used the `.at` ingame command at random locations. If we log in, we should now see a bunch of zombies standing around.

![](zombies.png)

## Random Movement

Adding random movement to a mob is fairly simple, but we actually add this behavior to creature instances instead of templates. Add the following to the bottom of your for-loop to make your zombies wander around:

```ts
// Sets the creature to walk randomly
spawn.MovementType.setRandomMovement();
// Sets the wander distance to 10 yards
spawn.WanderDistance.set(10);
```

If we rebuild, we should see that all our zombies now walk around.

## Stats

Creature stats work differently from players, and are much simpler.

Creatures belongs to one of four classes, which decides how much health and mana they have (depending on their level):
- **Warrior**: Has only health, identical to rogue
- **Rogue**: Has only health, identical to warrior
- **Mage**: Has mana and health, less health than paladins but more mana
- **Paladin**: Has mana and health. More health than mages, but less mana.

The amount of damage a creature deals also depends on their level, but can be scaled as we will see below.

Let's change the levels of our zombies to be between 4 and 6, and change their class to Mage. Add the following to your code, preferrably before your declared positions array:

```ts
ZOMBIE.Level.set(4,6)
ZOMBIE.UnitClass.setMage()
// Set zombie damage to 0.5x
ZOMBIE.Stats.DamageMod.set(0.5);
// Set zombie health to 0.75x 
ZOMBIE.Stats.HealthMod.set(0.75)
// Set zombie mana to 0.25x
ZOMBIE.Stats.ManaMod.set(0.25)
```

If we enter the world, we should see that zombies now have mana and don't do very much melee damage at all.

![](zombie-mage.png)

## Making our mob Aggressive

Mob aggressiveness is primarily controlled by what faction they belong to. All creatures and players belong to one faction, and only one at a time. The faction a unit belongs to can change dynamically, but all creatures have a default faction they always start out with. Factions are a broad topic that warrants an entire tutorial on its own, but luckily for us we don't need to know much about them to use them for this simple purpose.

We will use the same old strategy we always use: we find a unit that already is aggressive and try to figure out what faction it belongs to.

I just went outside of Northshire, took the first hostile mob I could find and used the ingame `.id` command to print its ID: 

![](hostile-mob.png)

Now, we can load this creature into TSWoW and copy its faction to our zombie:

```ts
const DEFIAS_CUTPURSE = std.CreatureTemplates.load(94)

// The field for creature faction is "faction template".
// Future tutorials will further explain the meaning of this name.
ZOMBIE.FactionTemplate.set(DEFIAS_CUTPURSE.FactionTemplate.get())
```

Rebuild, and should now see that the zombies are indeed hostile to players. (_If you have GM mode on, you need to turn it off with `.gm off` to for creatures to be hostile at all_)

![](hostile.png)

## Summary

In this tutorial, we have learnt:

- How to create a simple hostile enemy mob
- How to easily spawn multiple mobs in an area using the `.at` ingame command and `positions.txt`
- How to enable random movement
- How to manipulate creature classes and stats
- How to change the faction and aggressiveness of creatures

Our completed code for `EnemyCreature.ts` becomes:

```ts
// Create a mob based on the zombies in Deathknell. 
const ZOMBIE = std.CreatureTemplates
    .create('mymod','zombie',1501)

// Random positions behind northshire abbey, between the sawmill and river.
const positions = [
    Pos(0,-8860.666016,-261.928772,80.420403,2.052581),
    Pos(0,-8872.766602,-269.979706,79.303566,3.072814),
    Pos(0,-8863.773438,-281.623444,78.845047,4.894153),
    Pos(0,-8849.226563,-282.741882,79.074303,1.732141),
    Pos(0,-8832.603516,-280.921326,78.904022,0.446443),
    Pos(0,-8842.893555,-293.981720,78.108154,4.027075),
    Pos(0,-8857.631836,-300.569183,77.552925,3.555051),
    Pos(0,-8888.351563,-308.467163,74.824699,2.529320),
    Pos(0,-8905.495117,-286.458191,77.376122,2.452351),
    Pos(0,-8924.399414,-270.791168,77.919647,0.761388),
    Pos(0,-8900.039063,-255.879608,79.980675,0.271300),
    Pos(0,-8872.840820,-244.551208,82.048447,4.263481),
]

// Iterate over each position, and spawn a zombie based on it.
for(let i=0;i<positions.length;++i) {
    const spawn = ZOMBIE.spawn('mymod',`zombie-spawn-${i}`,positions[i]);
}

// Sets the creature to walk randomly
spawn.MovementType.setRandomMovement();
// Sets the wander distance to 10 yards
spawn.WanderDistance.set(10);

// Sets the creature to walk randomly
spawn.MovementType.setRandomMovement();
// Sets the wander distance to 10 yards
spawn.WanderDistance.set(10);

ZOMBIE.Level.set(4,6)
ZOMBIE.UnitClass.setMage()
// Set zombie damage to 0.5x
ZOMBIE.Stats.DamageMod.set(0.5);
// Set zombie health to 0.75x 
ZOMBIE.Stats.HealthMod.set(0.75)
// Set zombie mana to 0.25x
ZOMBIE.Stats.ManaMod.set(0.25)

const DEFIAS_CUTPURSE = std.CreatureTemplates.load(94)

// The field for creature faction is "faction template".
// Future tutorials will further explain the meaning of this name.
ZOMBIE.FactionTemplate.set(DEFIAS_CUTPURSE.FactionTemplate.get())
```

In the next tutorial, we will learn how to script basic creature behaviors inside data scripts using [smart scripting](10_SmartScripts.md).