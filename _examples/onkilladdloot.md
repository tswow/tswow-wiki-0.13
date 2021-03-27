---
title: Adding Loot to Kills
---

```ts

export function manaSystem(events: TSEventHandlers) {
    events.Player.OnCreatureKill((killer,killed)=>{
        let rand = randNum(100000);
        let Synthesized = 1
        let Purified = 1
        let Pristine = 1
        let Unstable = 1
        let Wild = 1
        if(rand <= 1){
            killed.GetLoot().AddItem(Wild,1,1)
        }else if(rand < 500){
            killed.GetLoot().AddItem(Unstable,1,1)
        }else if(rand < 1000){
            killed.GetLoot().AddItem(Pristine,1,1)
        }else if(rand < 10000){
            killed.GetLoot().AddItem(Purified,1,2)
        }else if(rand == 50000){
            killed.GetLoot().AddItem(Synthesized,1,3)
        }
    })
}
function randNum(max: uint32):uint32 {
    return Math.floor(Math.random() * max);
  }
```
