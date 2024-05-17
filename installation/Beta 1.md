---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2024-3-3
icon: checklist
tags: 
  - tutorial
---

!!! Warning
This is a BETA version, not everything is in, and nothing is complete. We are still working on this, and we want your feedback on how to make it better. Please do tell us anything on your mind in the discord thread!
!!!
### Introduction to V2.0
This is a complete rewrite of the entire app framework. Basically anything and everything has changed. This is a list of the main changes so far.
- Each plugin is now running in it's own process.
- The frontend is now a website running NextJS and react.
- Some stuff that was previously a "plugin" is now a "module".
  - For example the screencapture is now a module. This means it will run as the plugin needs, lowering the time from capture to the plugin getting the image.

### Step 1: Download the requirements.
!!! Note
Please do note that installing V2.0 is not yet as simple as V1.0. 
If you are scared of the terminal, then you might want to wait for later releases.
!!!
==- 1. Node.js
You can download Node.js from [here](https://nodejs.org/en/download/prebuilt-binaries/). Node is used to run the frontend and install NextJS later on.
==- 2. Git
You can download Git from [here](https://git-scm.com/downloads). Git is used to clone and update the app.
==- 3. Python
You can download Python from [here](https://www.python.org/downloads/). Python is the main backend language.
==-

### Step 2: Clone the repository.
==- 1. Create a new folder for the app.
This can for example be `C:\LaneAssist`
==- 2. Open a terminal in the folder.
- On **windows** you can just shift + right click and select `Open in Terminal`.
- Another way is to type "cmd" in the address bar and press enter.
- Third way that works on all systems is to open the terminal and type `cd ` and the path of the folder, ex. `cd C:\LaneAssist`.
==- 3. Run the following commands to clone the repository.
```bash
git clone https://github.com/ETS2LA/Euro-Truck-Simulator-2-Lane-Assist.git .
git checkout rewrite
```
==-
### Step 3: Install the dependencies.
==- 1. NextJS and recharts
Assuming you have Node installed and you have a console open in the **root folder**, run the following commands.
```bash
cd frontend
npm install
```
==- 2. Python dependencies
!!! Note
If you are coming from the last instruction, then you can just run `cd ..` to go back to the root folder.
!!!
Assuming you have Python installed and you have a console open in the **root folder**, run the following commands.
```bash
pip install -r requirements.txt
```
==-
### Step 4: Start the app.
==- 1. Manually
Assuming you are in the **root folder** run the following command.
```bash
python main.py
```
This will start the backend and fronted and pop out a new window.
==- 2. By creating a start file
1. Create a new file in the **root folder** and name it `start.bat`.
2. Open the file with a text editor and paste the following code.
```bash
@echo off
python main.py
```
3. Save the file and double click it to start the app.
==-
### Step 5: Additional tips.
==- 1. Updating the app
Just click the update available button on the top right of the UI once it lights up.
==- 2. Opening the UI from your phone.
!!! Note
It is recommended to use a tablet instead of a phone. Not all pages are optimized for small screens.

This guide also works for opening the UI on another computer (for example a laptop), so that you can have the UI open on a second device while playing on the main one. (since ETS2 disables control if tabbed out)
!!!
1. Make sure your phone is connected to the same network as your PC.
2. Get your PC's local IP address. This can be found in the console log, for example: 
`[17:46:01] [INF] webserver.py    Webserver started on http://192.168.1.135:37520 (& localhost:37520)` 
-> **192.168.1.135** is the IP address.
1. Navigate your phone browser to `http://<your-ip>:3000` (ex. `http://192.168.1.135:3000`).
2. Type the IP once more into the input field and press connect.
==-