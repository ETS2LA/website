---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2024-8-31
icon: terminal
order: 99
tags: 
  - tutorial
---

# Plugin Development

- - - 

Welcome! I am happy to know that you are interested in developing plugins for ETS2LA. This page will guide you through the process of creating your very own plugin.

!!! Warning
Keep in mind that ETS2LA V2.0 is not yet in a perfectly stable change. If you join the discord I can notify you of any breaking changes to the plugin APIs.
!!!

## Introduction
### What is a plugin?
As far as ETS2LA is concerned plugins are small programs that can interface with ETS2LA or the game. A large change from version 1 is that in 2.0 all plugins run in their own **processes**. This is not just threading, but entire seperate processes. The backend will handle all communications in and out of the plugin, so you can write the plugins just like you would write any python program.
### The basic structure of a plugin
```
ETS2LA
│   plugins
│   └─── my_plugin
│       │   main.py
│       │   plugin.json
│       │   settings.json
|       |   ...
```
+++ main.py
This is the main file of your plugin. The ETS2LA backend will run this file when the plugin is loaded.
As far as ETS2LA specific code goes this is an example:
```python
from ETS2LA.plugin.runner import PluginRunner

# This is your plugin's access to the ETS2LA backend
# we'll explore this more later
runner: PluginRunner = None

# This function will get called when the plugin is loaded
def Initialize():
    ...

# This function will be called every time the plugin is updated
def plugin():
    ...

    # Your plugin can return data for other plugins to use directly, it can also return tags.
    # We are slowly moving towards using tags instead of direct data, so you should use tags if possible.
    return None, {
        "tag": "value"
        ...
    }

```
+++ plugin.json
This file will decide how the program treats your plugin. It is also where you define the settings user interface. Below is a list of all the different keys that this file understands:

==+ [!badge variant="success" text="name" size="m"] [!badge variant="ghost" text="translation key" corners="square" size="s"][!badge variant="dark" text="string" corners="square" size="s"]
This will be the **name** of your plugin shown in the UI, it is recommended to use the translation key as show in the translation section later.
==+ [!badge variant="success" text="authors" size="m"] [!badge variant="ghost" text="author_object" corners="square" size="s"][!badge variant="dark" text="array" corners="square" size="s"]
This is a list of author objects, this is how a typical author object looks like:
```json
{
    "name": "Tumppi066",
    "url": "https://github.com/Tumppi066",
    "avatar": "https://avatars.githubusercontent.com/u/83072683?v=4"
}
```
==+ [!badge variant="success" text="description" size="m"] [!badge variant="ghost" text="translation key" corners="square" size="s"][!badge variant="dark" text="string" corners="square" size="s"]
This is the description shown in the UI, like with the name it is recommended to create a translation key.
==+ [!badge variant="success" text="version" size="m"] [!badge variant="ghost" text="version" corners="square" size="s"][!badge variant="dark" text="string" corners="square" size="s"]
It is recommended to use semantic versioning for this. (MAJOR.MINOR.PATCH)
==- [!badge variant="warning" text="dependencies" size="m"] [!badge variant="ghost" text="string" corners="square" size="s"][!badge variant="dark" text="array" corners="square" size="s"]
A list of the names of the plugins that this plugin depends on.
!!! Warning
This has not yet been implemented!
!!!
==- [!badge variant="warning" text="modules" size="m"] [!badge variant="ghost" text="module" corners="square" size="s"][!badge variant="dark" text="array" corners="square" size="s"]
Modules will be explained a bit further down, as of writing the current list of modules is:
- MapUtils
- Raycasting
- ScreenCapture
- SDKController
- ShowImage
- Steering
- TruckSimAPI
==- [!badge variant="warning" text="compatible" size="m"] [!badge variant="ghost" text="os name" corners="square" size="s"][!badge variant="dark" text="array" corners="square" size="s"]
The plugin won't be shown in the UI if the user is using an incompatible OS.
Accepted values are:
- Windows
- Linux
- MacOS
==- [!badge variant="warning" text="settings" size="m"] [!badge variant="ghost" text="settings_object" corners="square" size="s"][!badge variant="dark" text="array" corners="square" size="s"]
This is a large topic and will be explained further down.
==-

!!! Note about intellisense
We provide a json schema for autocomplete, you can import it by adding this to the top of the json file
```json
{
    "$schema": "../schema.json"
}
```
!!!
+++ settings.json
This is where the ETS2LA settings interface will dump your settings. Settings will be explained later.
+++
### Special considerations
As all plugins run in their own processes, you need to remember that when importing things from the ETS2LA libraries, the data in those libraries will not be the same for all plugins. 

In addition to this you should remember that when returning any information from a plugin, whether it be using the tags or the return data values, you should not return large amounts of data. The larger the data, the more time it will take for the main process to extract it from the plugin. This will then slow down the entire program. Modules were made to combat this issue and those will be explained later.

- - -

## Settings
### Using settings inside of the plugin
The settings interface has been made to be as simple to use as possible, here's basically all you need to know:
```python
import ETS2LA.backend.settings as settings

# You can get values like this
VALUE1 = settings.Get("plugin_name", "value1", "default_value")
VALUE2 = settings.Get("plugin_name", "value2", "default_value")

# And you can also make a function to listen for changes in the settings
# this is highly recommended as without such a function changing settings
# from the user interface will not update the plugin
def UpdateSettings(): # NOTE: You can optionally accept the settings json as an argument
    global VALUE1, VALUE2
    VALUE1 = settings.Get("plugin_name", "value1", "default_value")
    VALUE2 = settings.Get("plugin_name", "value2", "default_value")

settings.Listen("plugin_name", UpdateSettings)

# You can also set values like this
settings.Set("plugin_name", "value1", "new_value")
# This will then call the UpdateSettings function as the file has been updated

# Lastly you can get nested values like this
VALUE3 = settings.Get("plugin_name", ["nested", "value3"], "default_value")
# Same works for setting values
settings.Set("plugin_name", ["nested", "value3"], "new_value")
```
### Creating the settings interface
The settings interface is made to be as simple as possible, I've built a system that will automatically generate the javascript interface for you, depending on what you write in the plugin.json file.

Here is the code for a very simple settings page.
![](../assets/acc_settings.png)
```json
NOTE: This example uses the translation system, thus you only define the keys in the settings file!

"settings": [
    {
        "specials": [
            {
                "special": "Title",
                "special_data": "acc.settings.1.title"
            },
            {
                "special": "Description",
                "special_data": "acc.settings.1.description"
            },
            {
                "special": "Separator"
            }
        ]
    },
    {
        "name": "acc.settings.2.name",
        "description": "acc.settings.2.description",
        "key": "distance",
        "type": {
            "type": "number",
            "min": 10,
            "max": 100,
            "step": 1
        }
    }
]
```
You can see the schema for the different options of the settings file.
I also included a link to the Map plugin plugin.json file, it is a much more complex example.
[!ref](https://raw.githubusercontent.com/ETS2LA/Euro-Truck-Simulator-2-Lane-Assist/rewrite/ETS2LA/plugins/schema.json)[!ref](https://raw.githubusercontent.com/ETS2LA/Euro-Truck-Simulator-2-Lane-Assist/rewrite/ETS2LA/plugins/Map/plugin.json)
!!! Note
I recommend a json browser extension to make it easier to read the settings file.
https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa
!!!

- - -

## Modules
### Why modules?
Modules are our answer to the problem of sending large amounts of data between multiple processes. Let's take for example capturing the screen. In 1.0 you would have one screencapture plugin that would send it's data to all following plugins. This doesn't really work in 2.0 because sending that image data over a pipe or queue would be very slow.

Instead, we made modules. Now when declaring your `plugin.json` file, you can just add `modules: ["ScreenCapture"]` and the app will automatically load the `ScreenCapture` module for you. This means that each plugin has it's own instance of the module in it's own process. This removes the overhead of sending large amounts of data between processes.

Another unexpected benefit is that each plugin now has the most up to date data from the module. Before since the app ran sequancially, a plugin running later in the loop will mean it's screen capture data is multiple, even 10s, of milliseconds old. 

### How to use them?
Using modules is extremely simple, first you declare the plugin.json file like this:
```json
{
    "modules": ["ScreenCapture"]
}
```
And then in the plugin you can use the modules as follows:
```python
# NOTE: You cannot import modules directly, this is just to use intellisense
import ETS2LA.modules.ScreenCapture.main as Capture
from ETS2LA.plugin.runner import PluginRunner
from typing import cast

runner: PluginRunner = None

def Initialize():
    global ScreenCapture
    ScreenCapture = runner.modules.ScreenCapture
    ScreenCapture = cast(Capture, ScreenCapture) # This is optional, but will provide intellisense

def plugin():
    image, fullImage = ScreenCapture.run()
    ...
```
You can find a list of all modules and their variables in the following page:
[!ref](/Developers/modules.md)

- - -