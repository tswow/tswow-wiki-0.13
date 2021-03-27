---
title: ORM Killstreak Example
---

```ts
const TABLE_NAME_KILLSTREAK = "playerkillstreak";

@CharactersTable
class PlayerKillstreak extends DBTable {
	constructor(playerGUID: uint32) {
		super();
		this.playerGUID = playerGUID;
	}
	@PrimaryKey
	    playerGUID: uint32 = 0;
	@Field
	    killCount: int32 = 0;
}

export function Killstreaks(events: TSEventHandlers) {
	events.Player.OnPVPKill((killer,killed)=>{
		let killCount = killer.GetData().GetObject<PlayerKillstreak>(ModID(),TABLE_NAME_KILLSTREAK,()=>
		{
			const guid = killer.GetGUIDLow()
			const rows = LoadRows(PlayerKillstreak,`playerGUID = ${guid}`)
			return rows.length > 0 ? rows.get(0) : new PlayerKillstreak(guid);
		}
	    ).killCount++		
		killed.GetData().GetObject<PlayerKillstreak>(ModID(),TABLE_NAME_KILLSTREAK,()=>new PlayerKillstreak(killed.GetGUIDLow())).killCount = 0
			SendWorldMessage("|cffff0000[KillTracker] " + killer.GetName() + "|r Has Murdered |cffff0000"+killed.GetName() + "|r In Cold Blood. Current killstreak of "+(killCount+1))
			killer.GetData().GetObject<PlayerKillstreak>(ModID(),TABLE_NAME_KILLSTREAK).save();
			killed.GetData().GetObject<PlayerKillstreak>(ModID(),TABLE_NAME_KILLSTREAK).save();
	});
}
```
