---
title: Transports
---

_Transports are available from version 0.13_

_This page is a work in progress_

Starting with version 0.13, TSWoW supports creating custom transports that can carry players and creatures (boats, zeppelins).
Transports, however, come with a lot of caveats and bugs that users should be aware of as they don't really follow the exact path specified for them,
but interpolates between in an attempt to make them appear more smooth.
However, often with custom transports the effect turns out the exact opposite and causes weird glitches, janky turns and teleporting between endpoints.

Getting transports to work well, especially if trying to do tight turns and/or keep them in a continuous line on a single map, requires a lot of trial and error.

## Barebones Example
The following code will create a working transport going between GM Island and flying above westfall.

```ts
import { std } from "wow/wotlk"
std.Transports.create("<modid>","<transport-id>",[
    {map:1,x:16189.607422,y:16197.315430,z:0.000922,o:3.939514},
    {map:1,x:16167.085938,y:16174.223633,z:0.000922,o:3.939514},
    {map:1,x:16138.680664,y:16145.097656,z:0.000922,o:3.939514,delay:10},
    {map:1,x:16114.849609,y:16120.662109,z:0.000922,o:3.939514},
    {map:1,x:16095.241211,y:16100.556641,z:0.000922,o:3.939514},
    {map:1,x:16073.052734,y:16077.804688,z:0.000922,o:3.939514},
    {map:0,x:-10235.200195,y:1222.469971,z:93.185204,o:3.813462}, // <-- transport will automatically teleport here!
    {map:0,x:-10261.190430,y:1201.799683,z:93.185204,o:3.813462},
    {map:0,x:-10288.276367,y:1180.257935,z:93.185204,o:3.813462},
    {map:0,x:-10314.266602,y:1159.587646,z:93.185204,o:3.813462},
    {map:0,x:-10340.958008,y:1138.359619,z:93.185204,o:3.813462},
    {map:0,x:-10364.011719,y:1120.024658,z:93.185204,o:3.813462},
    {map:0,x:-10388.161133,y:1100.818359,z:93.185204,o:3.813462},
    {map:0,x:-10413.055664,y:1081.019409,z:93.185204,o:3.813462},
    {map:0,x:-10439.024414,y:1060.366455,z:93.185204,o:3.813462},
])])
```

## General Notes
- Always make sure to mark at least one node as having a `delay`. If not, transports will stop randomly before teleporting between maps and/or at the end of their loops.
- Starting and ending on different maps will often flawlessly avoid the most annoying issue with transports (continuous loops, see section below).
- Always have at least 3~4 nodes per map (they can be very close to each others), having fewer leads to instability and possibly crashes.
- Transports do not follow the exact path you specify for them, but attempt to interpolate them. Try to keep nodes somewhat evenly spaced and don't make too sharp turns.
This takes a lot of trial and error until you start understanding it.
- Having nodes too close to each others usually cause jankyness

## Transports in a single continuous loop

If trying to create a transport in a single map going in a loop,
you will likely soon notice how difficult it is to get the start and endpoints to go smoothly between each others,
and the transport usually ends up teleporting between the locations.

It **is** possible to get this working smoothly, and becomes easier if your loops contains a long, single straight line at some point. The shorter this line,
the more difficult it will become to get a smooth transition.

What I usually do is:

- Printscreen the map (`pressing m`) I'm making a path for and start `drawing` the path I want the transport to go and draw out small dots where the waypoints should be.
- Plot out a straight line along the path containing at least 4-6 waypoints.
- Start plotting my waypoints ingame (using the `.at` command) at the **center** of this line and trace out the path I want the transport to go
- When I complete the entire path, make sure the last 2-4 waypoints are all on the line leading up to the first
- When done, copy the **first** waypoint to the end. This _may_ cause the calculated start/endpoints on the transport path to line up perfectly,
and there should be no visible teleportation between them.

**TODO**: Working example of this
