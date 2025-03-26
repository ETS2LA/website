---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2025-3-26
icon: question
order: 99
title: FAQ
tags: 
  - tutorial
---

This page contains answers to some frequently asked questions and answers on how to fix them.

- - - 

### My wipers are stuck?
This is a known issue with applications using the ETS2 / ATS input SDK. There's nothing we can do as this is a bug on SCS's end. There is a workaround in the main menu though. If you scroll all the way down, there will be a button to `Fix wipers`. Click that and alt tab to the game and the wipers will be automatically set to the lowest option.

- - -

### The visualization is lagging a lot?
That's just your PC. You can try to lower the graphics settings in the game as well as capping the in game FPS to give ETS2LA more resources to work with.

- - -

### The game crashes when started with ETS2LA?
Make sure that you have **at least** 16gb of RAM. ETS2LA is very memory hungry so you can also try closing other applications to free up more memory.

- - -

### Visualization shows speed stuck at 54 km/h?
Enable the `Visualization Sockets` plugin.

- - -

### Visualization shows speed stuck at 4 km/h?
Install the SDKs in the settings and restart the game.

- - -

### The visualization pages are just white?
Either use the `Goodnightan` mirrors or turn on a VPN so you can access GitHub. There is nothing we can do as we don't have the resources to host the visualization pages outside of GitHub.

- - -

### Frontend loads indefinitely?
Download NodeJS from [here](https://nodejs.org/en/download/) *(nodejs.org)* and install it. Next run the following code inside `activate.bat`
```
cd app
cd Interface
git pull
npm i
npm run build
```

- - -

### `ModuleNotFoundError No module named {...}`
Open the `activate.bat` file and run the following:
```
cd app
pip install -r requirements.txt
```
Still having issues? Try this instead:
```
cd app
python -m pip install -r requirements.txt
```

- - -

### `Failed to update / check for updates for the submodule {...}`
This is normal in places with a limited network environment. You can usually safely ignore this warning. If you do want to check for updates then you can remove the submodule in `app/` and the app will redownload it. For example if the error is for the `Translations` submodule the you would delete the `app/Translations` folder and restart the app.

- - -

### Git installation fails or `Git is not installed. The app will not work`?
Download `git-for-windows` from wherever you can find it. 
For people in western countries this would be [here](https://github.com/git-for-windows/git/releases/latest) *(github.com)*. Install it and restart the launcher.

- - -

### `Invoke-WebRequest` has an error?
This has a few causes. The one sure fix is to run the `start.bat` file instead of `start_tsinghua.bat`. Just remember that if you are in China you will need a VPN in this case. There are also instructions on the Chinese part of the [discord](https://ets2la.com/discord) *(ets2la.com)* for how to help with this issue.

- - -

### `UnicodeDecodeError`
Make sure that the app is installed in a folder where the path only has western characters. You can for example install the app in `C:\ETS2LA` or `D:\ETS2LA` but not in `C:\Users\你好\Documents\ETS2LA`.

- - -

### `Cannot import 'setuptools.build_meta'`
Run the following code in the `activate.bat` file:
```
cd app
pip install --upgrade setuptools
```