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

!!! Info
If you are any more questions then hit me up on discord, this page is for Backend V2, and it's still experimental so give me any feedback you have!
!!!

!!! Warning
This page is not up to date. It can provide some guidelines but you sould check code from the app. A good example are the `Sockets` plugins.
!!!

## Introduction
### What is a plugin?
As far as ETS2LA is concerned plugins are small programs that can interface with ETS2LA or the game. A large change from version 1 is that in 2.0 all plugins run in their own **processes**. This is not just threading, but entire seperate processes. The backend will handle all communications in and out of the plugin, so you can write the plugins just like you would write any python program.
### The basic structure of a plugin
```
ETS2LA
└─── Plugin
└─── UI

plugins <- This is where you put your plugins
└─── my_plugin
    │   main.py
    |   ...

frontend
└─── ...
```

Following is the structure of a plugin `main.py` file:
+++ Information on imports
It's important to talk about how to import things in a plugin file. This is one of the compromises we had to make to make the backend as simple as possible.
- You can import anything from ETS2LA libraries at the top of the file.
- You can import any base python libraries at the top of the file.
- You **shouldn't** import any other libraries at the top of the file.

Why? Because at startup the app will read all the Plugin objects to build a list of plugins and their settings menus. If you import something large from a 3rd party library that will drastically slower the startup time and introduce additional RAM overhead.

What should I do instead?
```python
# ETS2LA libraries
from ETS2LA.Plugin import *
from ETS2LA.UI import *

# Base python libraries
import time
import math

class Plugin(ETS2LAPlugin):
    def imports(self):
        # Import the libraries you need here as
        # this function will be called before any of the plugin code 
        # (check the next section for more info on that)
        global torch, np
        import numpy as np
        import torch

    def run(self):
        # Your plugin code here
        ...
```
+++ Plugin
As you saw in the last section this is the main class of the plugin. The class will handle all the plugin backend logic and communications. Following is a list of features and example code (you can also check the plugin class itself, as it is documented).

Features provided by the plugin class:
==- `self.settings`
This helps you access the settings file of the plugin, example below:
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    def run(self):
        self.settings.value_i_want_to_save = "value" # NOTE: Do not spam this! It will slow down HDDs and break SSDs!
        the_value_is = self.settings.value_i_want_to_save
```
Also note that you can still use the legacy settings system, it also provides a listen command (wherein the new system updates each second)
```python
from ETS2LA.Plugin import *
import ETS2LA.backend.settings as settings

class Plugin(ETS2LAPlugin):
    def run(self):
        settings.Set("plugin_name", "key", "value")
        the_value_is = settings.Get("plugin_name", "key", "default_value")

    def update_settings(settings: dict): # when the settings update
        the_value_is = settings["key"]

    settings.Listen("plugin_name", update_settings)
```
==- `self.plugins`
!!! Note
It is recommended to instead use the tag system, as it is much easier and safer.
!!!
This is how you can get the return value of any running plugins, example below:
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    def run(self):
        another_plugin_value = self.plugins.another_plugin_name
        if another_plugin_value is None:
            print("The plugin is not running or it hasn't returned data.")
```
==- `self.modules`
This is where you can access the running modules that you described in the `description` object (more on that later), example below:
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):

    description = PluginDescription(
        name="Plugin Name",
        description="Plugin Description",
        modules=["ScreenCapture"]
    )

    def run(self):
        image, fullImage = self.modules.ScreenCapture.run()
```
[!ref](/Developers/modules.md)
!!! Warning
The modules are loaded in the order they are declared in the `description` object. This means that if you have a module that depends on another module, you should declare the requirement module first.
!!!
==- `self.state`
This is the simplified interface to show a loading state in the frontend, example below:
```python
from ETS2LA.Plugin import *
import time

class Plugin(ETS2LAPlugin):
    def run(self):
        # Initialize the state
        self.state.text = "Loading..."
        self.state.progress = 0
        
        for i in range(100):
            # Update as a calculation progresses
            self.state.text = f"Loading... {i}%"
            self.state.progress = i/100
            time.sleep(0.05)
        
        self.state.reset()
```
==- `self.globals.tags`
This is the preferred way to return and get data from other plugins. This makes sure that many plugin can return similar data (for example if the user has two object detection plugins on at the same time). It is an integral part of the new plugin system.
```python plugins/Producer1/main.py
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    def run(self):
        self.globals.tags.value_list = {
            "list": ["value1", "value2"]
        }
```
```python plugins/Producer2/main.py
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    def run(self):
        self.globals.tags.value_list = {
            "list": ["value3", "value4"]
        }
```
```python plugins/Consumer/main.py
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    def run(self):
        tag_value = self.globals.tags.my_tag
        """
            tag_value = {
                "Producer1": {
                    "list": ["value1", "value2"]
                },
                "Producer2": {
                    "list": ["value3", "value4"]
                }
            }
        """
        merged_value = self.globals.tags.merge(tag_value)
        """
            merged_value = {
                "list": ["value1", "value2", "value3", "value4"]
            }
        """
```
!!! Warning
The tag system uses python multiprocessing queues to send data back and forth, for very large data amounts (like images) this will take up to 200ms to transfer. You should thus use a time tag to only update the data when it's changed.
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    last_data_update = 0
    tag_value = None
    def run(self):
        update_time = self.globals.tags.update_time
        if update_time != self.last_data_update:
            self.last_data_update = update_time
            self.tag_value = self.globals.tags.my_tag
```
!!!
==- `self.globals.settings`
Same as `self.settings` except for the global settings file. Please note that this is read only, as multiple processes can access it at the same time. Legacy settings use the plugin name `"global"` to access the global settings.
==-
Plugin class variables:
==- [!badge variant="ghost" text="- optional -" size="m"] `fps_cap`
This is a simple float to cap the fps of the plugin to a certain value. By default all plugins are capped to 30fps, and this can be changed by:
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    fps_cap = 60
    ...
```
==- [!badge variant="ghost" text="- required -" size="m"] `description`
This is the object that controls how the plugin is displayed and treated by the app. The `PluginDescription` object has the following parameters:
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    description = PluginDescription(
        name="Plugin Name",
        version="1.0.0",
        description="Plugin Description",
        dependencies=["Plugin1", "Plugin2"],
        modules=["ScreenCapture"],
        comaptible_os=["Windows", "Linux"],
        compatible_game=["ETS2", "ATS"],
        update_log={
            "1.0.0": "Initial release"
        }
    )
```
==- [!badge variant="ghost" text="- required -" size="m"] `author`
Similar to the `description` object, this is a string that contains the author of the plugin.
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    author = Author(
        name="Author Name",
        url="https://wiki.ets2la.com",
        icon="https://wiki.ets2la.com/assets/favicon.ico"
    )

```
==- [!badge variant="ghost" text="- optional -" size="m"] `settings_menu`
The settings menu object that you can find out more about in the next section.
==-

Plugin class functions and reserved variables:

==- [!badge variant="success" text="usable" size="m"] `self.run()`
This is the main function of the plugin, and will be called every frame. This is where you should put your main logic.
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    def run(self):
        print("Hello World!") # printed at 30fps
```
==- [!badge variant="success" text="usable" size="m"] `self.notify()`
This is a function that will send a push notification to the frontend with the message and type provided by the arguments.
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    def run(self):
        self.notify("This is a notification", type="info")
        # type: Literal["info", "warning", "error", "success"] = "info"
```
==- [!badge variant="success" text="usable" size="m"] `self.ask()`
This is a function that will ask the user a question and prompt them to click one of the options provided.
```python
from ETS2LA.Plugin import *

def run(self):
    answer = self.ask("Do you want to continue?", options=["Yes", "No"], description="This is a description")
    if answer == "Yes":
        print("The user wants to continue")
    else:
        print("The user doesn't want to continue")
```
==- [!badge variant="success" text="usable" size="m"] `self.dialog()`
Will show a dialog on the UI, with the form presented.
```python
from ETS2LA.Plugin import *
from ETS2LA.UI import *

class Dialog(ETS2LADialog):
    def render(self):
        with Form():
            Title("This is a dialog")
            Description("This is a description")
            Input("Input", "string_input", "string", "default value", description="This is an input")
            Checkbox("Checkbox", "checkbox", False, description="This is a checkbox")
            # Use a custom button with the target set to "submit" if you don't like the default style of:
            # Button("Submit", "", "submit", border=False)

class Plugin(ETS2LAPlugin):
    ...
    def run(self):
        # Will block until the user clicks on submit
        data = self.dialog(Dialog())
        # Data will contain all the values the USER CHANGED
        # for example if the user didn't change the checkbox, then the data will be:
        # data = {"string_input": "The user changed this"}
        # and if the user changed all values then it will be
        # data = {"string_input": "The user changed this", "checkbox": True}
```
==- [!badge variant="danger" text="reserved" size="m"] `self.path`
**READ ONLY**
Used to store the path of the plugin (relative to the plugins folder).
==- [!badge variant="danger" text="reserved" size="m"] `self.*_queue`
**DO NOT USE**
The following queues are used to communicate with the backend, and should not be used by the plugin.
```
self.return_queue
self.plugins_queue
self.plugins_return_queue
self.settings_menu_queue
self.settings_menu_return_queue
self.frontend_queue
self.frontend_return_queue
self.immediate_queue
self.immediate_return_queue
self.state_queue
self.performance_queue
self.performance_return_queue
```
==- [!badge variant="danger" text="reserved" size="m"] `self.performance`
**READ ONLY**
Used to store the performance data of the plugin. This is a list of `tuple(timestamp, time_to_execute)`. The app will save the last 30 seconds of performance data.
==- [!badge variant="danger" text="reserved" size="m"] `self.ensure_settings_file()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.ensure_functions()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.__new__()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.load_modules()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.__init__()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.settings_menu_thread()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.frontend_thread()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.performance_thread()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.plugin()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.before()`
**DO NOT USE**
==- [!badge variant="danger" text="reserved" size="m"] `self.after()`
**DO NOT USE**
==-
Example plugin:
==- Open/Close
```python plugins/Sockets/main.py
# This plugin was not made from the ground up for the new backend, so it is not perfectly optimized!
from ETS2LA.Plugin import *
from ETS2LA.UI import *

class SettingsMenu(ETS2LASettingsMenu):
    dynamic = False
    plugin_name = "Sockets"
    def render(self):
        Title("Sockets Settings")
        Description("This is the plugin that sends data to the visualization sockets.")
        Slider("Data FPS", "update_rate", 30, 10, 60, 1, description="How many times per second the data being sent to the clients is updated.", requires_restart=True)
        return RenderUI()

class Plugin(ETS2LAPlugin):
    description = PluginDescription(
        name="plugins.sockets",
        version="1.0",
        description="plugins.sockets.description",
        modules=["TruckSimAPI"],
    )
    
    author = Author(
        name="Tumppi066",
        url="https://github.com/Tumppi066",
        icon="https://avatars.githubusercontent.com/u/83072683?v=4"
    )
    
    settings_menu = SettingsMenu()
    
    send = ""
    connected_clients = []
    
    def imports(self):
        global multiprocessing, websockets, threading, logging, asyncio, json, os, zlib, time
        import multiprocessing
        import websockets
        import threading
        import logging
        import asyncio
        import json
        import zlib
        import time
        import os

    async def server(self, websocket):
        print("Client Connected!")
        self.connected_clients.append(websocket)  # Step 2: Add a client to the list when they connect
        print("Number of connected clients: ", len(self.connected_clients))
        try:
            while True:
                if self.send:
                    await websocket.send(self.send)
                    # Wait for acknowledgment from client
                    try:
                        ack = await websocket.recv()
                    except Exception as e:
                        print("Client disconnected while receiving data.", str(e))
                        break
                    if ack != "ok":
                        print(f"Unexpected message from client: {ack}")
        except Exception as e:
            print("Client disconnected due to exception.", str(e))
        finally:
            self.connected_clients.remove(websocket)  # Step 3: Remove a client from the list when they disconnect

    def position(self, data):
        send = ""
        send += "x:" + str(data["truckPlacement"]["coordinateX"]) + ";"
        send += "y:" + str(data["truckPlacement"]["coordinateY"]) + ";"
        send += "z:" + str(data["truckPlacement"]["coordinateZ"]) + ";"
        rotationX = data["truckPlacement"]["rotationX"] * 360
        if rotationX < 0: rotationX += 360
        send += "rx:" + str(rotationX) + ";"
        rotationY = data["truckPlacement"]["rotationY"] * 360
        send += "ry:" + str(rotationY) + ";"
        rotationZ = data["truckPlacement"]["rotationZ"] * 360
        if rotationZ < 0: rotationZ += 360
        send += "rz:" + str(rotationZ) + ";"
        return send

    def traffic_lights(self, data):
        data["TrafficLights"] = self.globals.tags.TrafficLights
        data["TrafficLights"] = self.globals.tags.merge(data["TrafficLights"])
        try:
            send = "JSONTrafficLights:" + json.dumps(data["TrafficLights"]) + ";"
        except:
            for i in range(0, len(data["TrafficLights"])):
                data["TrafficLights"][i] = data["TrafficLights"][i].json()
            send = "JSONTrafficLights:" + json.dumps(data["TrafficLights"]) + ";"
        return send

    def speed(self, data):
        data["targetSpeed"] = self.globals.tags.acc
        data["targetSpeed"] = self.globals.tags.merge(data["targetSpeed"])
        
        if data["targetSpeed"] is None:
            data["targetSpeed"] = data["truckFloat"]["cruiseControlSpeed"]
                
        send = "speed:" + str(data["truckFloat"]["speed"]) + ";"
        send += "speedLimit:" + str(data["truckFloat"]["speedLimit"]) + ";"
        send += "cc:" + str(data["targetSpeed"]) + ";"
        return send

    def accelBrake(self, data):
        send = "accel:" + str(data["truckFloat"]["gameThrottle"]) + ";"
        send += "brake:" + str(data["truckFloat"]["gameBrake"]) + ";"
        return send

    lastVehicles = [""]
    lastVehicleString = ""
    def vehicles(self, data):
        data["vehicles"] = self.globals.tags.vehicles
        data["vehicles"] = self.globals.tags.merge(data["vehicles"])
        
        if data["vehicles"] is None or type(data["vehicles"]) != list or data["vehicles"] == [] or type(data["vehicles"][0]) != dict:
            return "JSONvehicles:[];"
        
        try:    
            if data["vehicles"] == self.lastVehicles:
                return self.lastVehicleString
        except:
            return self.lastVehicleString
        
        if data["vehicles"] is not None:
            newVehicles = []
            try:
                for vehicle in data["vehicles"]:
                    if isinstance(vehicle, dict):
                        newVehicles.append(vehicle)
                    elif isinstance(vehicle, list): # No clue why this happens, it's just sometimes single coordinates like this [31352.055901850657, 18157.970393701282]
                        continue
                    elif isinstance(vehicle, tuple):
                        continue
                    elif isinstance(vehicle, str):
                        continue
                    else:
                        try:
                            newVehicles.append(vehicle.json())
                        except:
                            try:
                                newVehicles.append(vehicle.__dict__)
                            except:
                                pass
            except:
                pass
                        
            data["vehicles"] = newVehicles
        
        if data["vehicles"] is []:
            return "JSONvehicles:[];"
            
        send = "JSONvehicles:" + json.dumps(data["vehicles"]) + ";"
        self.lastVehicles = data["vehicles"]
        self.lastVehicleString = send
        return send

    lastObjects = [""]
    lastObjectString = ""
    def objects(self, data):
        data["objects"] = self.globals.tags.objects
        data["objects"] = self.globals.tags.merge(data["objects"])
        
        if data["objects"] is None or type(data["objects"]) != list or data["objects"] == [] or type(data["objects"][0]) != dict:
            return "JSONobjects:[];"
        
        try:    
            if data["objects"] == self.lastObjects:
                return self.lastObjectString
        except:
            return self.lastObjectString
        
        if data["objects"] is not None:
            newObjects = []
            try:
                for obj in data["objects"]:
                    if isinstance(obj, dict):
                        newObjects.append(obj)
                    elif isinstance(obj, list): # No clue why this happens, it's just sometimes single coordinates like this [31352.055901850657, 18157.970393701282]
                        continue
                    elif isinstance(obj, tuple):
                        continue
                    elif isinstance(obj, str):
                        continue
                    else:
                        try:
                            newObjects.append(obj.json())
                        except:
                            try:
                                newObjects.append(obj.__dict__)
                            except:
                                pass
            except:
                pass
                        
            data["objects"] = newObjects
        
        if data["objects"] is []:
            return "JSONobjects:[];"
            
        send = "JSONobjects:" + json.dumps(data["objects"]) + ";"
        self.lastObjects = data["objects"]
        self.lastObjectString = send
        return send

    lastSteeringPoints = []
    def steering(self, data):
        try:
            steeringPoints = []
            data["steeringPoints"] = self.plugins.Map
            if data["steeringPoints"] is not None:
                for point in data["steeringPoints"]:
                    steeringPoints.append(point)
                self.lastSteeringPoints = steeringPoints
            else:
                steeringPoints = self.lastSteeringPoints
            
            send = "JSONsteeringPoints:" + json.dumps(steeringPoints) + ";"
            return send
        except:
            return "JSONsteeringPoints:[];"
        
    def status(self, data):
        try:
            data["status"] = self.globals.tags.status
            data["status"] = self.globals.tags.merge(data["status"])
            if data["status"] is None or type(data["status"]) != dict:
                return 'JSONstatus:{};'
            send = "JSONstatus:" + json.dumps(data["status"]) + ";"
            return send
        except:
            logging.exception("Error in status")
            return 'JSONstatus:{};'
        
    def acc_status(self, data):
        try:
            data["acc_status"] = self.globals.tags.acc_status
            data["acc_status"] = self.globals.tags.merge(data["acc_status"])
            if data["acc_status"] is None or type(data["acc_status"]) != str:
                return 'acc_status:ACC status error;'
            send = "acc_status:" + data["acc_status"] + ";"
            return send
        except:
            logging.exception("Error in acc_status")
            return 'acc_status:ACC status error;'
        
    lastHiglights = ""
    def highlights(self, data):
        try:
            data["highlights"] = self.globals.tags.highlights
            data["highlights"] = self.globals.tags.merge(data["highlights"])
            if data["highlights"] is None or type(data["highlights"]) != list:
                data["highlights"] = self.lastHiglights
            else:
                self.lastHiglights = data["highlights"]
                
            send = "highlights:" + json.dumps(data["highlights"]) + ";"
            return send
        except:
            logging.exception("Error in highlights")
            return 'highlights:[];'
            
    lastInstruct = [{}]
    def instruct(self, data):
        try:
            data["instruct"] = self.globals.tags.instruct
            data["instruct"] = self.globals.tags.merge(data["instruct"])
            if data["instruct"] is None or type(data["instruct"]) != list:
                data["instruct"] = self.lastInstruct
            else:
                self.lastInstruct = data["instruct"]

            send = "instruct:" + json.dumps(data["instruct"][:4] + [data["instruct"][-1]]) + ";"
            return send
        except:
            return ""

    def stopping_distance(self, data):
        try:
            data["stopping_distance"] = self.globals.tags.stopping_distance
            data["stopping_distance"] = self.globals.tags.merge(data["stopping_distance"])

            if data["stopping_distance"] is None or type(data["stopping_distance"]) not in [int, float]:
                data["stopping_distance"] = -1

            send = "stopping_distance:" + str(data["stopping_distance"]) + ";"
            return send
        except:
            return ""

    def lateral_offset(self, data):
        try:
            data["lateral_offset"] = self.globals.tags.lateral_offset
            data["lateral_offset"] = self.globals.tags.merge(data["lateral_offset"])
            
            if data["lateral_offset"] is None:
                data["lateral_offset"] = 0

            send = "lateral_offset:" + str(data["lateral_offset"]) + ";"
            return send
        except:
            return ""

    async def start_server(self, func):
        async with websockets.serve(func, "localhost", 37522):
            await asyncio.Future() # run forever
            
    def run_server_thread(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(self.start_server(self.server))
        loop.run_forever()

    def Initialize(self):
        global TruckSimAPI
        global socket
        
        TruckSimAPI = self.modules.TruckSimAPI
        TruckSimAPI.TRAILER = True
        
        socket = threading.Thread(target=self.run_server_thread)
        socket.start()
        
        print("Visualization sockets waiting for client...")
        
    def compress_data(self, data):
        compressor = zlib.compressobj(wbits=28)
        compressed_data = compressor.compress(data)
        compressed_data += compressor.flush()
        return compressed_data

    # Example usage in your server function
    def run(self):
        self.fps_cap = self.settings.update_rate
        if self.fps_cap is None:
            self.fps_cap = 30
            self.settings.update_rate = 30
        
        data = TruckSimAPI.run()

        tempSend = ""
        tempSend += self.position(data)
        tempSend += self.speed(data)
        tempSend += self.accelBrake(data)
        tempSend += self.vehicles(data)
        tempSend += self.objects(data)
        tempSend += self.traffic_lights(data)
        tempSend += self.steering(data)
        tempSend += self.acc_status(data)
        tempSend += self.status(data)
        tempSend += self.highlights(data)
        tempSend += self.instruct(data)
        tempSend += self.stopping_distance(data)
        tempSend += self.lateral_offset(data)

        #Switch to zlib when on windows
        if os.name == "nt":
            self.send = zlib.compress(tempSend.encode("utf-8"), wbits=28)
        else:
            self.send = compress_data(tempSend.encode("utf-8"))
```
==-
+++ SettingsMenu
The settings menu has two different modes:
==- `dynamic: False`
In this mode the settings are built at app startup, and then they won't be updated in the future. This is useful for settings that don't need to be updated in real time.
```python
from ETS2LA.Plugin import *
from ETS2LA.UI import *

class SettingsMenu(ETS2LASettingsMenu):
    dynamic = False
    plugin_name = "PluginName"
    def render(self):
        Title("Settings Title")
        Description("Settings Description")
        #       name           key     default min max step
        Slider("Slider Name", "slider_key", 50, 0, 100, 5, description="This is a slider", suffic="%")
        return RenderUI()

class Plugin(ETS2LAPlugin):
    settings_menu = SettingsMenu()
    ...
```
!!! Note
The settings get updated, and any changes will be saved and reflected in the UI. You just can't change the layout or values after the app has started.
!!!
==- `dynamic: True`
In this mode the settings menu is updated in real time as long as the plugin is enabled. This way you can make interactive menus that show their status as it changes.
```python
from ETS2LA.Plugin import *
from ETS2LA.UI import *

class SettingsMenu(ETS2LASettingsMenu):
    dynamic = True
    plugin_name = "PluginName"

    def render(self):
        # dynamic settings menus have access to self.plugin to access the running plugin object
        update_rate = self.plugin.settings.update_rate
        if update_rate is None:
            update_rate = 1/5
            self.plugin.settings.update_rate = 1/5

        RefreshRate(self.plugin.settings.update_rate) # This will tell the frontend how often to update this menu.

        Title("Settings Title")
        Description("Settings Description")
        
        with EnabledLock(): # Will show the elements as blurred until the plugin is enabled.
            Label("Value: " + str(self.plugin.value))

        return RenderUI()

class Plugin(ETS2LAPlugin):
    settings_menu = SettingsMenu()
    value = 0
    
    ...

    def run(self):
        self.value = some_value

    ...
```
==-
For more information on the different components that you can use, please check out:
[!ref](/Developers/ui_components.md)
+++ Events
Events are how the plugins can receive information that doesn't necessarily have any specific timing. This can be used to trigger a function when a certain thing happens in game or in other plugins.

Currently available events are:
- ToggleSteering(state: bool)
- JobStarted(job: Job)
- JobFinished(job: Job)
- JobDelivered(job: Job)
- JobCancelled(job: Job)
- RefuelStarted(refuel: Refuel)
- RefuelPayed(refuel: Refuel) - not my typo :)
- VehicleChange(license_plate: str)

Usage:
```python
from ETS2LA.Plugin import *

class Plugin(ETS2LAPlugin):
    # Use the event name as the function name.
    def ToggleSteering(self, state:bool, *args, **kwargs):
        print(f"Steering is now {'enabled' if state else 'disabled'}")
    ...
```

!!! Note
Plugin made events are not yet in, for now you can only listen to events by the ETS2LA backend.
!!!
!!! Note
For information on the different objects like `Job` please check the `ETS2LA/backend/classes.py` file.
!!!
+++
### Special considerations
As all plugins run in their own processes, you need to remember that when importing things from the ETS2LA libraries, the data in those libraries will not be the same for all plugins. 

In addition to this you should remember that when returning any information from a plugin, whether it be using the tags or the return data values, you should not return large amounts of data. The larger the data, the more time it will take for the main process to extract it from the plugin. This will then slow down the entire program.