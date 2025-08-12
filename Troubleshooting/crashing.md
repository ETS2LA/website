---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2025-8-12
icon: x-circle-fill
order: 98
title: ETS2LA / Game Crashes
---

This page will list fixes to the most common crashes you might experience while using ETS2LA. Please note that game crashes due to ETS2LA are extremely rare, most likely if you encounter a game crash it is because of limited resources on your computer.

!!! Notice
To accurately determine the cause of the crash, please check the console for errors. 
This page will list those errors, and provide fixes for them.
!!!

---

#### `ModuleNotFoundError No module named {...}`
This error means that ETS2LA is missing a Python submodule that's required to boot. This usually happens after a failed install or update. To fix the error, just run the following code after opening the `activate.bat` file in the ETS2LA installation directory.
```
cd app
pip install -r requirements.txt
```

---

#### The game crashes, I think it's ETS2LA doing it!
Even though ETS2LA crashing your game is extremely unlikely, we can still run through some troubleshooting steps to see if we can figure out the problem.
1. Go to `Settings -> SDK` and reinstall the SDK for your game. \
   Does it work now? Great! Remember to always update the SDK when ETS2LA tells you, and when you update your game.
2. Go to `Settings -> SDK` and **uninstall** the SDK for your game. \
   Does it work now? If yes, then the problem is with the SDK. Please make sure you are using a supported version of the game. Usually that's the latest version, and the latest version that supports TruckersMP.
3. Do step 2, and **close ETS2LA completely**. \
   Does it work? If yes, then you should increase your [page file](https://www.google.com/search?q=how+to+increase+page+file+size+windows) size. A value of `48gb - your memory` works fine for most people. Please note that even if you have 128gb of RAM, you will still need at least 8-16gb of page file for ETS2LA to work properly.

If these troubleshooting steps didn't help, or you are convinced ETS2LA is the problem, then please contact us on our [Discord server](https://ets2la.com/discord) *(ets2la.com)*. Make sure to include the error message you are getting, as well as the game log from `Documents\Euro Truck Simulator 2\game.log.txt` or `Documents\American Truck Simulator\game.log.txt`.

---

#### My crash is not listed here?
Please contact us on our [Discord server](https://ets2la.com/discord) *(ets2la.com)*. Make sure to include the error message you are getting, as well as the game log from `Documents\Euro Truck Simulator 2\game.log.txt` or `Documents\American Truck Simulator\game.log.txt`. We will try to help you as soon as possible.

---