# Frequently Asked Questions

> [!NOTE]
> While we try to keep these pages updated, if you find outdated information, 
> please let us know in the `#support` channel on [Discord](https://ets2la.com/discord).
> Please also inform us about any issues not listed here, so we can add them to the FAQ.

## The overlay is fully opaque or flickers

This is almost always a driver configuration issue or related to Windows. Try the following: 
- **NVIDIA** - set `OpenGL GDI Compatibility` to `Prefer Compatible` in the
  NVIDIA App, and disable `Automatically manage colors for apps` in Windows
  display settings.
- **AMD** - disable `HDR` and `Automatically manage colors for apps` in Windows
  display settings.

If these don't work, try reinstalling your graphics drivers. If that *still* doesn't work
then you can completely disable the overlay in the `Display` settings.

## Why doesn't it drive?

1. Make sure you have enabled the `Lane Assist` and `Adaptive Cruise Control` plugins, and that
you have enabled the driving assists. (see [getting started](#/help#3-use-your-keybinds) for details).
2. Make sure you are currently driving on a road. ETS2LA cannot start driving inside company areas,
ferries or intersections. We will only begin driving once you are on a road.
3. Make sure that the SDK is loaded and compatible. **Close the game** and
reinstall the SDK from the settings. Restart the game and ETS2LA *might* work after.
4. See the next section.

## Does ETS2LA support mods?

Yes, but with a few caveats:
- ETS2LA will load *all* mods from the `Documents/Euro Truck Simulator 2/mod` folder. This includes mods you don't currently have enabled in the game. **Ensure that this folder only contains mods you are currently using**, you can move others to subfolders for example.
- Some mods may create new maps, while others might edit `europe.mbd` or other base files. If a mod doesn't work properly, go into the ETS2LA `Data Parsing` settings and toggle on `Force Base Map Name`, this will ensure mods that load the base map don't break ETS2LA.
- Map mods are often not updated completely for each new game version. **ETS2LA can only parse the latest version of the map data**, so if a mod is for example 20% on an older version, that *might cause* ETS2LA to not work properly *in those areas*. This is not something we can fix sadly.
- Some map mod combinations (i.e. ProMods + RusMap) might use features or custom road types etc... that we don't support. In these cases there's also nothing we can do, as we focus on basegame compatibility.

> [!TIP]
> We don't guarantee 100% mod compatibility, however if you do have issues not related to those above, please report them in the `#support` channel on [Discord](https://ets2la.com/discord).

## Is ETS2LA allowed on multiplayer?

It depends on the mod.

- **SCS Convoys** - supported natively.
- **TruckersMP** - actively supported and allowed by the developers.
- **TrucklineMP** - allowed, but not actively tested until full release.
- **HaulMP** - disallowed by the developers. HaulMP includes a leaderboard system, 
and thus any sort of self driving is considered cheating. We're working with the developers
to allow other features of ETS2LA to continue working.

> [!CAUTION]
> Most leaderboards and VTC tools ban any sort of self driving. Always check
> with your VTC before enabling ETS2LA. **Trucky** is one of the few that do allow us.

## How do I install a plugin manually?

Acquire the plugin `.dll` file from the developer. Then go into the `Manager` tab, 
click the folder icon next to the plugin list, and copy the file there. Restart ETS2LA
and the plugin should appear in the list.

If the plugin requires libraries, those can be found one folder up in the `Plugins` folder.
```
current
├─ ETS2LA.exe
├─ Plugins
│   └─ MyPlugin.dll
└─ Libraries
    └─ MyPluginDependency.dll
```

## Issue not listed here?

Join the [Discord](https://ets2la.com/discord) and ask in the support channel.
If your question comes up often we'll add it here.
