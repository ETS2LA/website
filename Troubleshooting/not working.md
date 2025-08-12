---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2025-8-12
icon: bug
order: 99
title: Doesn't work!
---
!!! Notice
Please check these pages for other common issues, what you are looking for might not be on this page.
[Crashing](https://ets2la.com/troubleshooting/crashing) *(ets2la.com)*
[Installer Fails](https://ets2la.com/troubleshooting/installer-fails) *(ets2la.com)*
[Remote Connection](https://ets2la.com/troubleshooting/remote-connection) *(ets2la.com)* 
!!!

---

#### The visualization doesn't connect and just shows the connection page.
Make sure the `Visualization Sockets` plugin is enabled. If you are using basic mode, then the enabled plugins will be listed to the left of the plugin manager page. If you are trying to connect via a remote device, then check the `Remote Connection` troubleshooting page.

---

#### ETS2LA is not steering.
1. Make sure the `Map` plugin is enabled. \
   If you find that the Map plugin is not enabled / not visible at all, then try to enable the `Slow Loading` option in `Settings > Global > Variables`. You should also increase your [page file](https://www.google.com/search?q=how+to+increase+page+file+size+windows) size to at least 8gb to 16gb.
2. Make sure you've selected the correct data for your mods / game.
   For example, if you're playing on ProMods, then you need to select the ProMods data in `Settings > Map > Data`.
3. Make sure you've selected a route in the in game map. \
   ETS2LA does not work without a navigation route. You can select a route by clicking on the map in the game.
4. Make sure the visualization page shows a gray line. \
   This gray line indicates that Map has currently found a route to follow. If you don't see the gray line, please follow the instructions in the warnings in the console. Usually this includes driving forward for 10-20 seconds, after which the gray line should appear.
5. Make sure you actually enabled the steering. \
   By default the keybind for enabling the steering is the `N` key on your keyboard. You can change this in the settings. When Map is supposed to be steering the line will turn blue, and ETS2LA will take over steering control completely.

Is the line blue but it's still not steering? Did you not figure out your issue here? Please contact us on [Discord](https://ets2la.com/discord) *(ets2la.com)*.

---

#### ETS2LA is not controlling the speed.

1. Make sure the `Adaptive Cruise Control` plugin is enabled. \
   If you find that the Map plugin is not enabled / not visible at all, then try to enable the `Slow Loading` option in `Settings > Global > Variables`. You should also increase your [page file](https://www.google.com/search?q=how+to+increase+page+file+size+windows) size to at least 8gb to 16gb.
2. Make sure you actually enabled the speed control. \
    By default the keybind for enabling the speed control is the `N` key on your keyboard. You can change this in the settings. When Adaptive Cruise Control is supposed to be controlling the speed, the speed in the top right will turn blue, and ETS2LA will take over speed control completely.
3. Try to enable / disable the fallback control mode. \
   ETS2LA has two modes for controlling the speed. The fallback mode can be used when the primary mode fails. This can be enabled in `Settings > Global > Variables`.

Is the speed blue but it's still not controlling the speed? Did you not figure out your issue here? Please contact us on [Discord](https://ets2la.com/discord) *(ets2la.com)*.

---