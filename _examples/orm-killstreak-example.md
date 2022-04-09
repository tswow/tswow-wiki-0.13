---
title: ORM Killstreak Example
---

```ts
const TABLE_NAME_KILLSTREAK = "playerkillstreak";

@CharactersTable
class PlayerKillstreak extends DBEntry {
    constructor(playerGUID: uint32) {
        super();
        this.playerGUID = playerGUID;
    }
    @DBPrimaryKey
    playerGUID: uint32 = 0;
    @DBField
    killCount: int32 = 0;
}

export function Killstreaks(events: TSEvents) {
    events.Player.OnPVPKill((killer, killed) => {
        let killCount = killer.GetObject<PlayerKillstreak>(TABLE_NAME_KILLSTREAK, new PlayerKillstreak(killer.GetGUIDLow())).killCount++
        killed.GetObject<PlayerKillstreak>(TABLE_NAME_KILLSTREAK, new PlayerKillstreak(killed.GetGUIDLow())).killCount = 0
        SendWorldMessage("|cffff0000[KillTracker] " + killer.GetName() + "|r Has Murdered |cffff0000" + killed.GetName() + "|r In Cold Blood. Current killstreak of " + (killCount + 1))
        killer.GetObject<PlayerKillstreak>(TABLE_NAME_KILLSTREAK, new PlayerKillstreak(killer.GetGUIDLow())).Save();
        killed.GetObject<PlayerKillstreak>(TABLE_NAME_KILLSTREAK, new PlayerKillstreak(killed.GetGUIDLow())).Save();
    });
}
```
