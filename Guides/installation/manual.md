---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2025-09-02
icon: move-to-bottom
title: Manually
order: 0
tags: 
  - tutorial
---

This guide will walk you through installing ETS2LA **manually**.

#### Download the requirements
==- [!badge variant="ghost" text="1"] ‎ [!badge variant="ghost" text="Required"] ‎ [!badge variant="dark" text="uv"]
You can download `uv` from [here](https://docs.astral.sh/uv/getting-started/installation/) *(astral.sh)*.
==- [!badge variant="ghost" text="2"] ‎ [!badge variant="ghost" text="Required"] ‎ [!badge variant="dark" text="Git"]
Most people will already have `git` installed, if you don't then get it from [here](https://git-scm.com/) (*git-scm.com*).
===

#### Installing ETS2LA
1. Create a folder for ETS2LA. Please place this in a folder that is *not* synced to a cloud service such as OneDrive or Google Drive.
2. Run the following command in a console: `git clone https://github.com/ETS2LA/Euro-Truck-Simulator-2-Lane-Assist.git .`. This will download the ETS2LA codebase to **the folder it's run in**.
3. Run the following to install the dependencies: `uv sync`
4. Run the following to **start** ETS2LA: `uv run main.py`

#### What to do once ETS2LA is open?
Once the onboarding is done you can just go to the plugin manager and enable the plugins. Then open the game and it should *just* work.