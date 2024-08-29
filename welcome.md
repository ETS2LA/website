---
icon: home
label: Welcome
image: assets/markdownLogo.png
order: 100
---
![](assets/markdownLogo.png)

# Welcome to ETS2LA
**ETS2LA** is a project that aims to finally bring self-driving technology to **SCS Software's Truck Simulators**. This documentation is a work in progress and will be updated as the project progresses. If you have any questions, please ask in the Discord.

{.callout}
> Okay so I don't mean to spam this channel with my absolute excitement for this program, because I have already told you guys how much I love it, but I think it bears repeating one more time that I am in a wheelchair and do not have the manual dexterity to play this game on my own and it is ONLY because of this program that I am able to play the game! I absolutely love it and I really want the developers to know that I appreciate all their hard work into making this program. There is a sense of satisfaction that comes from being able to drive in a simulator when I can't even do it in the real world because of my disability. 🙂
> 
> **Unnamed User** - ETS2LA Discord

* * *

### Features
#### :icon-git-branch: Full access to simulator data
Like many other applications we use a telemetry server in the ETS2 directory to get live data from the game. **However unlike others** we also have access to the games' road and prefab network to build a true full self-driving experience without the need for compute expensive vision models. **This also means that ETS2LA will work regardless of the camera or game version.*** You can now get those perfect cinematic shots without the need to hop onto multiplayer!

#### :icon-globe: Multilingual
We provide an easy to use translation framework for anyone to translate the app into their own language. The app will reload said language file on the fly, so you can see your the changes instantly.

#### :icon-location: Custom made navigation system
ETS2LA has a custom made A* based navigation system to find the shortest path to your destination**. This system is used because the game's own navigation system path cannot be accessed from the telemetry provided by the game.

#### :icon-log: State of the art custom AI models
We use state of the art AI models that are trained on a large dataset of custom annotated images created and labeled by our community! This allows us to have a much more accurate and reliable experience than what you would get out of the box.

#### :icon-terminal: A rich developer experience
We've built an easy to use backend that will let anyone create beautiful and functional plugins for ETS2LA. You can define an entire settings page with just a few lines of json. We also have a powerful event system that will let you listen to any events or keybinds from the game or within the app. 

#### :icon-project: A beautiful and modern user interface
Built on top of NextJS and shadcn, we've made an easy to use and beautiful interface that will let you easily find what you need. We also include a visualization of the current state around the truck built with godot. Said visualization is highly inspired by a certain EV company...

* * * 
\* The base self driving will work on any camera or game version, including VR use. But we still use vision models for vehicle detection, the app will not detect other vehicles and objects outside of the interior camera view.
\*\* The navigation system currently finds the **shortest path**. This is not guaranteed to be the **fastest path**.
* * *
[!ref Screenshots and Videos](/media.md)