---
title: Spells and Creature scripts
---

Some live scripts can be hooked to only fire on events that happens to a specific Spell or Creature. This section will briefly demonstrate how to create such events.

## Spell Script

Let's create a hook for the mage Fireball spell, id=133.

```ts
export function Main(events: TSEventHandlers) {
    events.SpellID.OnCast(133, (spell)=>{
        console.log("Fireball is being cast!");
    });
}
```

If we build this script, we should see a message in the console every time that Fireball is being cast. 

We can also access the caster of the spell and do something to them:

```ts
export function Main(events: TSEventHandlers) {
    events.SpellID.OnCast(133, (spell)=>{
        const caster = spell.GetCaster();
        if(!caster.IsNull() && caster.IsUnit()) {
            // Kill the caster
            caster.ToUnit().Kill(caster.ToUnit(),true);
        }
    });
}
```

Maybe we want to do something to the target of a spell instead. For that, we have to use another hook, since a spell will not have received a target in the moment it has been cast.

```ts
export function Main(events: TSEventHandlers) {
    events.SpellID.OnHit(133, (spell)=>{
        const trgt = spell.GetTarget();
        if(trgt.IsUnit() && !trgt.IsNull()) {
            trgt.ToUnit().SetScale(2);
        }
    });
}
```

We can see that despite that we're hooking a different event, we receive the exact same argument.

## Creature Script

Creature scripts work similarly to Spell scripts, we register them for specific creatures.

```ts
export function Main(events: TSEventHandlers) {
    // Elder mottled boars outside of orgrimmar
    events.CreatureID.OnJustEnteredCombat(3100,(creature,target)=>{
        creature.SendUnitSay("Help! I'm being attacked!",0);
        if(!target.IsNull()) {
            creature.Kill(target,true);
        }
    });
}
```

For creature scripts, the registered creature itself is **always** the first argument.

## Custom IDs
If we want to use our own custom IDs in live scripts, we cannot import files from the data scripts. Instead, we use the auto-generated `IDs.ts` file. For IDs to show up correctly in `IDs.ts`, you need to use the correct modid for all entities you register. For example, the mod `my-mod` must register spells (for example) by `std.Spells.create('my-mod','some-id',...)`. The important part is `'my-mod'`.

TODO: Write example here.

## Global Events

Both creature and spell events can also be applied globally to all creatures or spells. Instead of using CreatureID/SpellID, we use Creatures/Spells:

```ts
export function Main(events: TSEventHandlers) {
    events.Creatures.OnJustEnteredCombat((creature,target)=>{
        console.log("A creature just entered combat!");
    });
    
    events.Spells.OnHit((spell)=>{
        console.log("A spell just hit!");
    });
}
```

There are still a few things left to learn about Live scripting, but for now you can use the [documentation](../Documentation/TSWoW/LiveScripts.md), our [test module](https://github.com/tswow/tswow-testmodule) or ask away on the [discord](https://discord.gg/M89n6TZh9x).
