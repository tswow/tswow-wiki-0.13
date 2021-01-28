# Live Script Timers

**Note: Live script timers changed between v0.9 and v0.9.1. The old version doesn't have the first "timer" argument in the callbacks.**

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
events.Player.OnSay((player,type,lang,msg)=>{
    // Loops an action labeled "test_task" by 1000ms infinitely (0) times.
    player.GetTasks().AddTimer(ModID(),"test_task",1000,0,(timer,entity,del,can)=>{
        entity.ToPlayer().SendBroadcastMessage("Looped message");
    });
});
```
