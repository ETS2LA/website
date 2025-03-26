---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2025-3-21
icon: cloud
title: With the Installer
tags: 
  - tutorial
---

This guide will walk you through installing ETS2LA via the **automatic installer**.

#### Download the requirements
==- [!badge variant="ghost" text="1"] ‎ [!badge variant="ghost" text="Optional"] ‎ [!badge variant="dark" text="NodeJS"]
You can download NodeJS from [here](https://nodejs.org/) *(nodejs.org)*.
!!! Tip
NodeJS is only required if you want to run the frontend locally. If you are fine with accessing it through the internet, then you can skip this step.
!!!
==- [!badge variant="ghost" text="2"] ‎ [!badge variant="ghost" text="Required"] ‎ [!badge variant="dark" text="C++ Redistributable"]
Most people will already have ran `vc_redist` once, but in the case that you've never downloaded it before, you can get it from [here](https://aka.ms/vs/17/release/vc_redist.x64.exe) *(aka.ms)*.
=== [!badge variant="ghost" text="3"] ‎ [!badge variant="ghost" text="Required"] ‎ [!badge variant="dark" text="Installer"]
You can now download the installer from [here](https://github.com/ETS2LA/installer/archive/refs/heads/2.0.zip) *(github.com)*.
===

#### Installing the app
==- [!badge variant="ghost" text="1"] ‎ [!badge variant="ghost" text="Required"] ‎ [!badge variant="dark" text="Unzip the installer file"]
Even windows itself can unzip the file, but we recommend using [7zip](https://www.7-zip.org/) *(7-zip.org)* as it is much faster.
!!! Warning
Please unzip the files to where you want the app to be installed. 
**You cannot move the installer files after running the `start.bat` file for the first time!**
!!!
==- [!badge variant="ghost" text="2"] ‎ [!badge variant="ghost" text="Required"] ‎ [!badge variant="dark" text="Run the start.bat file"]
Running the file is as simple as double clicking it. If for some reason it crashes and you can't see the error, you can run `activate.bat` instead. Then you can type in `start.bat`, this will keep the console open so you can see the error.
!!!
If you are in China or in another place with a limited network environment, you can run the `start_tsinghua.bat` file to download the files from a Chinese mirror.
!!!
==- [!badge variant="ghost" text="3"] ‎ [!badge variant="ghost" text="Required"] ‎ [!badge variant="dark" text="Follow the launcher instructions"]
Once the `start.bat` file has downloaded all the necessary requirements, it will open up the launcher. This launcher will walk you through installing the rest of ETS2LA. In the future if you want to run ETS2LA again, just click open the `start.bat` file and it will open the launcher again.
!!!
If you are in China or in another place with a limited network environment, you need to use the `GitLab` or `SourceForge` mirrors and preferably enable the option to use Chinese mirrors.
!!!
===

#### What to do once ETS2LA is open?
Just head to the settings page and install the SDK, then you can enable all `Base` tag plugins (except *Data Collection* unless you want to help train AIs). If you had ETS2 open already you will need to restart it after the SDK install.

After that it should just work! You can open the visualization tab and once you are loaded into the game it should show the roads and vehicles around. You can press `N` once on a road to start the automatic driving.

!!! Warning
We don't yet officially support map mods. That support will be arriving later as a dropdown selector in the Map settings. For now you should only use the base game and DLCs.
!!!