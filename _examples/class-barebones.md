---
title: Barebones Class
---
The following is a brief code example for creating a custom class, give it some spells, a talent and a trainer.

```ts
import { std } from "tswow-stdlib";
import { Pos } from "tswow-stdlib/Misc/Position";

const MODNAME = 'tswow-necromancer';

/******************************************************************
 * NECROMANCER CLASS
 ******************************************************************/
const NECROMANCER = std.Classes.create(MODNAME,'necromancer','MAGE')
NECROMANCER.Name.enGB.set('Necromancer');
NECROMANCER.addRaces(['HUMAN','ORC','UNDEAD','TROLL'])
NECROMANCER.UI.Color.set(0x770077);

NECROMANCER.UI.Info.add('- Role: Damage, Tank')
NECROMANCER.UI.Info.add('- Light Armor (Cloth)')
NECROMANCER.UI.Info.add('- Controls undead servants')
NECROMANCER.UI.Info.add('- Uses mana as a resource')
NECROMANCER.UI.Description
    .set("Necromancers raise and control the undead, and brings plague and destruction on their enemies. Necromancy is strictly forbidden in both Horde and Alliance societies, and those who practice it can only do so in absolute secrecy.")

/******************************************************************
 * NECROMANCY SKILL
 ******************************************************************/
const NECROMANCY = std.SkillLines.createClass(MODNAME,'necromancy',NECROMANCER.ID)

/******************************************************************
 * DEATH COIL SPELL
 ******************************************************************/
const DEATH_COIL = std.Spells.create(MODNAME,'death-coil',686)
DEATH_COIL.Name.enGB.set('Death Coil');
const DEATH_COIL_ABILITY = DEATH_COIL.SkillLines.add(NECROMANCY.ID)
DEATH_COIL_ABILITY.setAutolearn();

// Copy visual data from the real death coil
const DEATH_COIL_DK = std.Spells.load(47541)
DEATH_COIL.Visual.MissileModel.setID(DEATH_COIL_DK.Visual.MissileModel.ID);
DEATH_COIL.Visual.ImpactKit.cloneFrom(DEATH_COIL_DK.Visual.ImpactKit);
DEATH_COIL.Icon.set(DEATH_COIL_DK.Icon.get());
NECROMANCY.Icon.set(DEATH_COIL_DK.Icon.get());

/******************************************************************
 * SUMMON SPELL
 ******************************************************************/
export const SUMMON_ABOMINATION = std.Spells
    // base the spell on "Summon Imp"
    .create('tswow-necromancer','summon-abomination', 688)
SUMMON_ABOMINATION.Name.enGB.set('Summon Abomination');
SUMMON_ABOMINATION.Description.enGB.set('Summon an Abomination under the command of the Necromancer');
// Changes the summoned creature
SUMMON_ABOMINATION.Effects.get(0).MiscValueA.set(8543);
SUMMON_ABOMINATION.SkillLines.add(NECROMANCY.ID)
SUMMON_ABOMINATION.Icon.set('Interface\\Icons\\Achievement_Boss_patchwerk.blp')

/******************************************************************
 * TRAINER
 ******************************************************************/
export const NECRO_TRAINER = 
    std.CreatureTemplates.create('tswow-necromancer','necromancer-trainer',198)
NECRO_TRAINER.Name.enGB.set('Wilson Carter');
NECRO_TRAINER.Subname.enGB.set('Necromancy Trainer')
NECRO_TRAINER.Trainer.Greeting.enGB.set(`Necromancy is like baseball, I know nothing of either.`)
NECRO_TRAINER.Trainer.Class.set(NECROMANCER.ID);
NECRO_TRAINER.Trainer.addSpell(SUMMON_ABOMINATION.ID,0,1);
// Spawns this creature just outside Northshire Abbey
NECRO_TRAINER.spawn('tswow-necromancer','trainer-instance',Pos(0,-8898.656250,-130.632767,81.285889,1.766019))

/******************************************************************
 * TALENTS
 ******************************************************************/
export const NECROMANCY_TREE = std.TalentTrees.create('tswow-necromancer','tswow',0,[NECROMANCER.ID])
NECROMANCY.Name.enGB.set(`Necromancy`);

const IMPROVED_FIREBALL = std.Spells.load(11069)

export const IMP_ABOMINATION = 
    std.Spells.create('tswow-necromancer','imp-abomination-spell',11071)
IMP_ABOMINATION.Name.enGB.set(`Improved Summon Abomination`);
IMP_ABOMINATION.Description.enGB.set(`Decreases the casting time by your Summon Abomination spell by 9 seconds.`);

// Notice how we match a specific effect in the improved fireball spell
SUMMON_ABOMINATION.ClassMask.match(IMPROVED_FIREBALL.Effects.get(0))

// Change the casttime reduction to 9 seconds (9000ms)
IMP_ABOMINATION.Effects.get(0).BasePoints.set(-9000)
IMP_ABOMINATION.Icon.set('Interface\\Icons\\Achievement_Boss_patchwerk.blp')

export const IMP_ABOMINATION_TALENT = NECROMANCY_TREE.addTalent('tswow-necromancer','imp-abomination-talent',0,1,[IMP_ABOMINATION.ID])
```
