# Quests

In this section we will see how to create quests using TSWoW. We will first create a "kill", and then a scripted escort quest that requires the first one to be completed.

## Our first quest: Kill Quest

Kill quests are perhaps the simplest quests in the game: Slay a specific type of creature x amount of times and you're done. They're also the easiest quest to create, all we need is a creature id for the questgiver and the id of the creature we should slay. 

For the questgiver, I've chosen this NPC standing in the Northshire graveyard besides the Warlock trainer:

![](questgiver.png)

For the creatures, we can just use the zombies we created in the last tutorial. To create our quest, we can use the following code in a new file `Quests.ts`:

```ts
import { std } from "tswow-stdlib";
import { ZOMBIE } from "./EnemyCreature";

// Create the quest
const killQuest = std.Quests.create('my-module','kill-zombies-quest')

// Set the quest log title
killQuest.Text.Title.set({enGB:'Kill the zombies'});

// Set the longer quest description 
killQuest.Text.Description.set({enGB:'I sure have absolutely no idea where those zombies came from, but they are beginning to become a little more than an annoyance at this point. Please clear them out for us, will you?'});

// Set the short objective description (shown above the concrete objectives)
killQuest.Text.Objective.set({enGB:'Kill ten zombies, then report back to Dane Winslow.'});

// Makes Dane Winslow both starter and ender of the quest
killQuest.Questgiver.addBoth(6373)

// Adds 10 zombies as the single objective of this quest
// If a creature is used for this, it's presumed you should kill them, 
// whereas for gameobjects it's presumed you should just activate them.
killQuest.Objectives.Entity.add(ZOMBIE.ID,10);
```

If we create a new character and walk up to our questgiver, he should offer us our quest and we should be able to complete it. Unfortunately for us, it doesn't offer us any rewards.

## Escort Quest

Now, we will use our knowledge about smart scripts to create a simple escort quest: We will walk Dane Winslow to the sewers. 

Creating the quest itself is very similar to the last: 

```ts
const escortQuest = std.Quests
    .create('my-mod','where-do-they-get-in-quest');
// Same questgiver as before
escortQuest.Questgiver.addBoth(6373)
escortQuest.Text.Title.set({enGB:'Where do they get in'});
// This is the main objective paragraph
escortQuest.Text.Objective.set({enGB:'Help Dane Winslow find the source of the zombies.'});
// Enable a scripted objective, which requires a custom description.
escortQuest.Objectives.Scripted.set({enGB:'Escort Dane Winslow to the sewer'});
// Make the quest share the start request to the entire party
escortQuest.Flags.PartyAccept.mark();
```

If we check this, we can see that the objectives turn up correctly but nothing happens when we start the quest. Of course, we must actually script the npc to do something when we start the quest.

## Script Path

For an escort quest, the creature we walk has a list of waypoints that they have to reach in succession. To get waypoints, we will use the same strategy as when we created spawn points for our zombies: walk our own characters along the path and use the `.at` command with the positions.txt file.

Now, we want to create a _script path_. These are very similar to the patrol paths discussed in the previous section, but are instead used by scripts.

To create a script path, we can use code like the following:

```ts
const ESCORT_PATH = std.ScriptPaths.create()

ESCORT_PATH.add([
    // A few points between Dane Winslow and the Northshire wall
    Pos(0,-8947.773438,-182.655746,79.846169,2.792917),
    Pos(0,-8973.723633,-186.852219,75.610870,3.212320),
    Pos(0,-9044.142578,-203.225800,71.434937,3.473857),
    Pos(0,-9103.708984,-180.140427,71.236916,3.010472),
]);
```

## Escort Script

Now that we have the quest and waypoints in place, all we need to do is create the creature script itself. 

```ts
// Start walking when the player accepts the quest
const startWalk = dane_winslow.Scripts.onAcceptedQuest(escortQuest.ID)
startWalk.Action.setQuestWalk(
    // Actor will run
    true,
    // Actor will follow ESCORT_PATH from start to finish
    ESCORT_PATH.ID,
    // Actor will not cycle through the path
    false,
    // Actor will start this quest for all people taking it
    escortQuest.ID,
    // Actor will despawn after this many (??)
    1,
    // Actor will react aggressively to mobs on the path
    'AGGRESSIVE');

// Fail the quest if we die
const onDeath = dane_winslow.Scripts.onDeath()
onDeath.Action.setFailQuestWalk(escortQuest.ID)

// Finish the quest when we reach the destination (4th point in the path)
const endWalk = dane_winslow.Scripts.onWaypointReached(4,ESCORT_PATH.ID)
endWalk.Action.setFinishQuestWalk(escortQuest.ID);

// Say a message after we complete the quest
const finalSay = endWalk.then()
finalSay.Action.setTalk({enGB:'Well... you come up with what happens from here!'},10,0)
```

## Summary

In this section, we have learnt:

- How to create a basic kill quest
- How to create a scripted escort quest

Our final code in `Quest.ts` becomes:

```ts
import { std } from "tswow-stdlib";
import { ZOMBIE } from "./EnemyCreature";

/** 
 * Kill Quest 
 */

// Create the quest
const killQuest = std.Quests.create('my-module','kill-zombies-quest')

// Set the quest log title
killQuest.Text.Title.set({enGB:'Kill the zombies'});

// Set the longer quest description 
killQuest.Text.Description.set({enGB:'I sure have absolutely no idea where those zombies came from, but they are beginning to become a little more than an annoyance at this point. Please clear them out for us, will you?'});

// Set the short objective description (shown above the concrete objectives)
killQuest.Text.Objective.set({enGB:'Kill ten zombies, then report back to Dane Winslow.'});

// Makes Dane Winslow both starter and ender of the quest
killQuest.Questgiver.addBoth(6373)

// Adds 10 zombies as the single objective of this quest
// If a creature is used for this, it's presumed you should kill them, 
// whereas for gameobjects it's presumed you should just activate them.
killQuest.Objectives.Entity.add(ZOMBIE.ID,10);

/**
 * Escort Quest
 */

const escortQuest = std.Quests
    .create('my-mod','where-do-they-get-in-quest');
// Same questgiver as before
escortQuest.Questgiver.addBoth(6373)
escortQuest.Text.Title.set({enGB:'Where do they get in'});
// This is the main objective paragraph
escortQuest.Text.Objective.set({enGB:'Help Dane Winslow find the source of the zombies.'});
// Enable a scripted objective, which requires a custom description.
escortQuest.Objectives.Scripted.set({enGB:'Escort Dane Winslow to the sewer'});
// Make the quest share the start request to the entire party
escortQuest.Flags.PartyAccept.mark();

const ESCORT_PATH = std.ScriptPaths.create()

ESCORT_PATH.add([
    // A few points between Dane Winslow and the Northshire wall
    Pos(0,-8947.773438,-182.655746,79.846169,2.792917),
    Pos(0,-8973.723633,-186.852219,75.610870,3.212320),
    Pos(0,-9044.142578,-203.225800,71.434937,3.473857),
    Pos(0,-9103.708984,-180.140427,71.236916,3.010472),
]);

// Start walking when the player accepts the quest
const startWalk = dane_winslow.Scripts.onAcceptedQuest(escortQuest.ID)
startWalk.Action.setQuestWalk(
    // Actor will run
    true,
    // Actor will follow ESCORT_PATH from start to finish
    ESCORT_PATH.ID,
    // Actor will not cycle through the path
    false,
    // Actor will start this quest for all people taking it
    escortQuest.ID,
    // Actor will despawn after this many (??)
    1,
    // Actor will react aggressively to mobs on the path
    'AGGRESSIVE');

// Fail the quest if we die
const onDeath = dane_winslow.Scripts.onDeath()
onDeath.Action.setFailQuestWalk(escortQuest.ID)

// Finish the quest when we reach the destination (4th point in the path)
const endWalk = dane_winslow.Scripts.onWaypointReached(4,ESCORT_PATH.ID)
endWalk.Action.setFinishQuestWalk(escortQuest.ID);

// Say a message after we complete the quest
const finalSay = endWalk.then()
finalSay.Action.setTalk({enGB:'Well... you come up with what happens from here!'},10,0)

```

In the [next tutorial](12_Items.md), we will learn how to create items and loot tables.