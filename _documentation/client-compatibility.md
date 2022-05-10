---
title: Client Compatibility
---

The purpose of this page is to document compatibility issues with the World of Warcraft 3.3.5a client (build 12340). This can include both modded and non-modded versions of the game.

If you wish to report issues or other platforms/graphic cards these occurs on, you can either make a pull request directly or message `IHM#2145` on discord.

## Cannot set game to windowed mode

When changing the game to use windowed or borderless windowed mode, the screen goes black.

- **Affected OS**: `Windows 10`
- **Solution**:
  - Shut down wow completely
  - Create the file `WTF/Config.wtf` if it does not already exist
  - Add `SET gxWindow "1"` to `WTF/Config.wtf`
  - Start wow again. You can now set it to borderless windowed mode as well.
- **Note**: This happens to pretty much everyone at this point.

## Framerate drops and stuttering

Occasional stuttering and framerate drops when hardware cursor is enabled.

- **Affected OS**: `Windows 10`
- **Affected Graphic Cards**: `GTX 1060`, `GTX 2060`
- **Workaround**:
  - Under video settings, disable `Hardware cursor`

## M1 Macs

WotLK is no longer supported natively on m1 macs. Some users on the [wowservers subreddit](https://www.reddit.com/r/wowservers/search/?q=m1&restrict_sr=1&sr_nsfw=) have reported success with the windows client and `Codeweavers Crossover` or `Wineskin`.

_If you own an M1 mac an have wotlk working, please reach out so we can write a proper guide!_
