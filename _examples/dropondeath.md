---
title: Drop All Loot On Death
---
```ts
class itemDef {
    itemEntry: uint32 = 0
    itemCount: uint32 = 0
}

class PlayerItemHolder {
    guid: uint32 = 0
    gold: uint32 = 0
    items: TSArray<itemDef> = [];
}

let arrOfPlayerLoot: TSArray<PlayerItemHolder> = [];
export function onDeath(events: TSEvents) {
    events.Player.OnPlayerKilledByCreature((killer, player) => {
        const chestID = 179697
        const despawnTime = 30//seconds

        let item = player.GetItemByPos(0, 0)
        const chest = player.SummonGameObject(chestID, player.GetX(), player.GetY(), player.GetZ(), player.GetO(), despawnTime)
        let container = new PlayerItemHolder()
        container.gold = player.GetMoney()
        container.guid = chest.GetGUIDLow()
        player.ModifyMoney(-9999999999)
        let itemsHolder: TSArray<itemDef> = []
        for (let x = 19; x <= 22; x++) {//equipped bags inside slots
            for (let i = 0; i <= 35; ++i) {
                item = player.GetItemByPos(x, i)
                if (!item.IsNull()) {
                    let itemP = new itemDef()
                    itemP.itemCount = item.GetCount()
                    itemP.itemEntry = item.GetEntry()
                    itemsHolder.push(itemP)
                    player.RemoveItem(item, item.GetCount())
                }
            }
        }
        for (let x = 67; x <= 74; x++) {//equipped bags inside bank slots
            for (let i = 0; i <= 35; ++i) {
                item = player.GetItemByPos(x, i)
                if (!item.IsNull()) {
                    let itemP = new itemDef()
                    itemP.itemCount = item.GetCount()
                    itemP.itemEntry = item.GetEntry()
                    itemsHolder.push(itemP)
                    player.RemoveItem(item, item.GetCount())
                }
            }
        }
        for (let i = 0; i <= 118; i++) {//equip/equip bags/backpack/bank main/bank bags/keyring
            item = player.GetItemByPos(255, i)
            if (!item.IsNull()) {
                let itemP = new itemDef()
                itemP.itemCount = item.GetCount()
                itemP.itemEntry = item.GetEntry()
                itemsHolder.push(itemP)
                player.RemoveItem(item, item.GetCount())
            }
        }
        container.items = itemsHolder
        arrOfPlayerLoot.push(container)
    })
    events.GameObjects.OnGenerateLoot((obj, player) => {
        if (obj.GetEntry() == 179697) {
            obj.GetLoot().Clear()
            for (let i = 0; i < arrOfPlayerLoot.length; i++) {
                if (obj.GetGUIDLow() == arrOfPlayerLoot.get(i).guid) {
                    obj.GetLoot().SetMoney(arrOfPlayerLoot.get(i).gold)
                    for (let v = 0; v < arrOfPlayerLoot.get(i).items.length; v++) {
                        let item = arrOfPlayerLoot.get(i).items.get(v)
                        obj.GetLoot().AddItem(item.itemEntry, item.itemCount, item.itemCount)
                    }
                    break;
                }
            }
        }
    })
}
```
