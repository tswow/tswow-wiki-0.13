---
title: Live Script Tags
---

TSWoW allows us to attach data tags, timers and collision checkers to `WorldObjects` and `Maps`. This document will explain the purpose of each and how to use them.

## ModID()

The following sections all use function calls where the first argument is `ModID()`. You should **not** change this, if this code shows the first argument as a call to ModID, it should **always** be a call to ModID. Not following this will crash your worldserver if you reload scripts. All of the following constructs are destroyed if the entity that owns it is unloaded from memory, as well as if you reload any of your scripts.

## Tasks

**Note: Timers changed between v0.9 and v0.9.1. The old version doesn't have the first "timer" argument in the callbacks.**

Timers allow you to delay or loop an action connected to a `Map` or a `WorldObject`. Timers are accessed from the `GetTasks()` function for both WorldObjects and Maps.

## Delayed Action

This code demonstrates how to simply delay an action once.

```ts
events.Player.OnSay((player,type,lang,msg)=>{
    // Delays an action labeled "test_task" by 1000ms once (1 time).
    player.GetTasks().AddTimer(ModID(),"test_task",1000,1,(timer,entity,del,can)=>{
        entity.ToPlayer().SendBroadcastMessage("Delayed message");
    });
});
```

## Looping Action

This code demonstrates how to loop an action indefinitely.

```ts
export function Main(events: TSEventHandlers) {
    events.Player.OnSay((player,type,lang,msg)=>{
        // Loops an action labeled "test_task" by 1000ms infinitely (0) times.
        player.GetTasks().AddTimer("test_task",1000,0,(timer,entity,del,can)=>{
            entity.ToPlayer().SendBroadcastMessage("Looped message");
        });
    });
}
```

# Data Tags

TSWoW allows us to store custom data classes directly on WorldObjects and Maps, removing the need for a separate lookup table. 
This way, we can efficiently store data for every world object in the game with constant lookup times with respect to the total amount of objects in the game.

```ts
class ExtendedPlayerData {
  happiness: uint32 = 0;
  anxiety: uint32 = 0;
}

export function Main(events: TSEventHandlers) {
    events.Player.OnSay((player,type,lang,msg)=>{
      // Gets a data tag from a player, or creates a new one and attaches it if it doesn't already exist.
      const data = player.GetData().GetObject("custom_data",new ExtendedPlayerData());
      player.SendBroadcastMessage("Your happiness is "+data.happiness++);
    });
}
```

## Persistent Data

We can create persistent data by combining data tags with ORM character tables:

```ts
const STATS_FIELD = "extended_stats";

@CharactersTable
class PlayerStatsExtended extends DBTable {
    constructor(player: uint32) {
        super();
        this.player = player;
    }
    
    @PrimaryKey
    player: uint32 = 0;

    @Field
    messageCount: int32 = 0;
}

export function Main(events: TSEventHandlers) {
    events.Player.OnLogin((player,first)=>{
        const guid = player.GetGUIDLow()
        const rows = LoadRows(PlayerStatsExtended,`player = ${guid}`)
        const stats = rows.length > 0 ? rows.get(0) : new PlayerStatsExtended(guid);
        player.GetData().SetObject(STATS_FIELD,stats);
    });

    events.Player.OnSay((p,t,l,msg)=>{
        const messageCount = p.GetData().GetObject(STATS_FIELD,new PlayerStatsExtended(player.getGUIDLow())).messageCount++
        p.SendBroadcastMessage("Your message count is "+messageCount);
    });

    events.Player.OnSave((player)=>{
        player.GetData().GetObject(STATS_FIELD,new PlayerStatsExtended(player.getGUIDLow())).save();
    });
}
```


# Collisions

**Note: Collisions change between v0.9 and v0.9.1. The old version had an extra "distance" argument (fourth) in the collision callback.**

We can also attach collision detections that will run at a specified interval. We can optionally set a maximum amount of collisions that can happen with any other object.

## Single Collision
```ts
export function Main(events: TSEventHandlers) {
    events.Player.OnSay((player,type,lang,msg)=>{
        // Collides every 10 yards, checked every 1000ms, with a maximum of 1 collisions per target.
        player.GetCollisions().Add(ModID(),"my_collisions",10,1000,1,(collision,self,collided,cancel)=>{
            self.ToPlayer().SendBroadcastMessage("Colliding with "+collided.GetName());
        });
    });
}
```

## Infinite Collisions
```ts
export function Main(events: TSEventHandlers) {
    events.Player.OnSay((player,type,lang,msg)=>{
        // Collides every 10 yards, checked every 1000ms, with no maximum collision count (0).
        player.GetCollisions().Add(ModID(),"my_collisions",10,1000,0,(collision,self,collided,cancel)=>{
            self.ToPlayer().SendBroadcastMessage("Colliding with "+collided.GetName());
        });
    });
}
```
