---
title: Levelup Messages + Item/Gold Rewards
---

```ts
export function onLevel(events: TSEvents) {
    events.Player.OnLevelChanged((player, oldLevel) => {
        player.SendAreaTriggerMessage("Congrats on leveling up to " + player.GetLevel() + "!")
        let level: int = player.GetLevel()
        if (level % 5 == 0) {
            player.ModifyMoney(100)
            player.AddItem(20880, level / 5)
        }
        if (level == 80) {
            player.SendBroadcastMessage("|cffffffff[LevelTracker]|r " + player.GetName() + " Has Reached Max Level! Congrats " + player.GetName() + " on reaching " + player.GetLevel() + "!")
        }
    });
}
```
