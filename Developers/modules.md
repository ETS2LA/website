---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2024-8-31
order: 98
icon: file-code
tags: 
  - tutorial
---

!!! Warning
This page is not up to date. You should check the code for the modules to get the most up to date information. The information for `TruckSimAPI` is correct, as we use that internally as a reference.
!!!

### MapUtils
!!! Warning
This module also requires the **TruckSimAPI** module to be enabled!
The **Map plugin** also has to be enabled to load the map data!
!!!
This module provides information about the closest item to the given coordinates. It will give the following data:

{.compact}
Dictionary Key  | Description
---             | ---
closestItem     | The closest item to the coordinates, can be either of type Road or PrefabItem
closestLane     | The closest lane to the coordinates, will be a list of points.
closestPoint    | The closest point to the coordinates on said lane.
closestDistance | The distance to the closest point.
closestType     | The type of the closest item, can be either of type Road or PrefabItem
inBoundingBox   | All of the items that the coordinates is currently in the bounding box of.
closestLanes    | All the closest lanes of the items in the bounding box.
allPoints       | All the points of the items in the bounding box.

The `run()` function has the following inputs:
==- [!badge variant="success" text="x" size="m"] [!badge variant="ghost" text="coordinate" corners="square" size="s"][!badge variant="dark" text="float" corners="square" size="s"]
X coordinate of the item to check.
==- [!badge variant="success" text="y" size="m"] [!badge variant="ghost" text="coordinate" corners="square" size="s"][!badge variant="dark" text="float" corners="square" size="s"]
Y coordinate of the item to check.
==- [!badge variant="success" text="z" size="m"] [!badge variant="ghost" text="coordinate" corners="square" size="s"][!badge variant="dark" text="float" corners="square" size="s"]
Z coordinate of the item to check.
==- [!badge variant="warning" text="closestRoads" size="m"] [!badge variant="ghost" text="Road" corners="square" size="s"][!badge variant="dark" text="array" corners="square" size="s"]
This is only meant to be used by the Map plugin, it already has access to the closest roads so the module doesn't need to calculate it again.
==- [!badge variant="warning" text="closestPrefabs" size="m"] [!badge variant="ghost" text="PrefabItem" corners="square" size="s"][!badge variant="dark" text="array" corners="square" size="s"]
This is only meant to be used by the Map plugin, it already has access to the closest prefabs so the module doesn't need to calculate it again.
==-

### Raycasting
!!! Warning
This module also requires the **TruckSimAPI** module to be enabled!
The user has to be in the **interior view** for this plugin to work!

This plugin has a major flaw. It will only raycast to an imaginary plane originating from the bottom of the truck. If you are on stable ground, while the object to raycast is on a slope, the raycast will output the wrong position. This is mostly a limitation of performance.
!!!

This module provides a raycasting interface for the game. Just give it the X and Y screen coordinates and it will give you a position back.

The module will return a `RaycastResponse` object with the following data:

{.compact}
Response Variable   | Description
---                 | ---
point               | The point in game space where the raycast hit.
distance            | The distance from the camera to the hit point.
relativePoint       | The point in game space where the raycast hit, but relative to the camera.

The `run()` function has the following inputs:
==- [!badge variant="success" text="x" size="m"] [!badge variant="ghost" text="coordinate" corners="square" size="s"][!badge variant="dark" text="float" corners="square" size="s"]
Screen X coordinate from the top left.
==- [!badge variant="success" text="y" size="m"] [!badge variant="ghost" text="coordinate" corners="square" size="s"][!badge variant="dark" text="float" corners="square" size="s"]
Screen Y coordinate from the top left.
==-

### ScreenCapture
This module provides a simple ScreenCapture interface. It will automatically switch between windows_capture, bettercam and MSS depending on the PC it's running on.

The `run()` function has the following inputs:
==+ [!badge variant="success" text="imgtype" size="m"] [!badge variant="ghost" text="imgtype" corners="square" size="s"][!badge variant="dark" text="string" corners="square" size="s"]
This can be one of the following:
- both
- cropped
- full

If the variable is not set, it will default to `both`.

If the variable is set to `both`, the `run()` function will return two np.arrays, **first one is the cropped image, second one is the full image.**
if the variable is set to `cropped`, the `run()` function will return **only the cropped image.**
if the variable is set to `full`, the `run()` function will return **only the full image.**
==+

The module also has the following global variables:

{.compact}
Variable Name   | Description
---             | ---
monitor_x1      | The top left corner of the cropped image.
monitor_y1      | The top left corner of the cropped image.
monitor_x2      | The bottom right corner of the cropped image.
monitor_y2      | The bottom right corner of the cropped image.

### SDKController
!!! Warning
You should probably not use this module without asking us first, using the module in multiple plugins at the same time will cause them to constantly overwrite each other's values.
!!!
This module provides an interface to perform controller actions in the game. We hook directly into SCS's controller API.
You use the module by doing the following in your code:

```python
from ETS2LA.modules.SDKController.main import SDKController as Controller
from typing import cast

def Initialize():
    global SDKController
    SDKController = runner.modules.SDKController
    SDKController = cast(Controller, SDKController)

def plugin():
    SDKController.steering = 0.0 # You can set floats
    SDKController.wipers = True # You can also set bools
```

Please check the following page to see all the available variables:
[!ref](https://github.com/ETS2LA/scs-sdk-controller/blob/main/inputs.h)

### ShowImage
Will show a given image on the screen. Also supports showing overlays on top of said image (used by the Steering module to show the steering line).

The `run()` function has the following inputs:
==- [!badge variant="success" text="img" size="m"] [!badge variant="ghost" text="img" corners="square" size="s"][!badge variant="dark" text="np.array" corners="square" size="s"]
The image to show.
==- [!badge variant="warning" text="windowName" size="m"] [!badge variant="ghost" text="name" corners="square" size="s"][!badge variant="dark" text="string" corners="square" size="s"]
The name that the window will be given.
==-

The module also has the following global variables:

{.compact}
Variable Name   | Description
---             | ---
overlays        | A dictionary of overlays to show on top of the image.

Example of how to add an overlay:
```python
image = np.zeros((1080, 1920, 3), np.uint8)
ShowImage.overlays["test_overlay"] = image
```

### Steering
!!! Warning
This module requires the **TruckSimAPI** `if not IGNORE_GAME`, **ShowImage** `if drawLine` and **SDKController**  modules to be enabled!
!!!
This module provides an easy way to send steering input to the game. It also handles smoothness sensitivity etc...

The `run()` function has the following inputs:
==- [!badge variant="warning" text="value" size="m"] [!badge variant="ghost" text="steering" corners="square" size="s"][!badge variant="dark" text="float" corners="square" size="s"]
The steering value to set, can also be None to reset the steering.
==- [!badge variant="warning" text="sendToGame" size="m"] [!badge variant="ghost" text="toggle" corners="square" size="s"][!badge variant="dark" text="bool" corners="square" size="s"]
If the steering value should be sent to the game. (this can be used to enable / disable the steering)
==- [!badge variant="warning" text="drawLine" size="m"] [!badge variant="ghost" text="toggle" corners="square" size="s"][!badge variant="dark" text="bool" corners="square" size="s"]
If the steering line should be drawn with the ShowImage overlays
==- [!badge variant="warning" text="drawText" size="m"] [!badge variant="ghost" text="toggle" corners="square" size="s"][!badge variant="dark" text="bool" corners="square" size="s"]
Whether the drawLine text should be drawn.
==-

The module also has the following global variables:

{.compact}
Variable Name   | Description
---             | ---
SMOOTH_TIME     | The time the steering will be smoothed over. (default 0.1)
OFFSET          | General offset for the steering. (default 0.0)
SENSITIVITY     | The sensitivity of the steering. (default 1.0)
MAX_ANGLE       | The maximum angle the steering can be. (default 1.0)
IGNORE_SMOOTH   | If the steering should ignore any smoothing. (default False)
IGNORE_GAME     | If the steering should be sent to the game. (default False)

### TruckSimAPI
Provides information from the game. This module is required by basically all other modules and plugins.
!!! Note
Below is a list of all the data we have from the game. The top left value is the key, for all keys but root you need to use `data[key]["value"]` to get the value.

Example: `data["truckFloat"]["speed"]`

!!!
{.compact}
root                    | Description
---                     | ---
sdkActive               | If the SDK is active.
placeHolder             | A placeholder for future data.
pause                   | If the game is paused.
placeHolder2            | A placeholder for future data.
time                    | The current time in the game.
simulatedTime           | The simulated time in the game.
renderTime              | The last frame render time.
multiplayerTimeOffset   | The time offset for multiplayer.

{.compact}
scsValues                   | Description
---                         | ---
telemetryPluginRevision     | The revision of the telemetry plugin.
versionMajor                | The major version of the game.
versionMinor                | The minor version of the game.
game                        | The name of the game. `ETS2/ATS/unknown`
telemetryVersionGameMajor   | The major version of the telemetry plugin.
telemetryVersionGameMinor   | The minor version of the telemetry plugin.

{.compact}
commonUI   | Description
---        | ---
timeAbs    | The absolute time in the game.

{.compact}
configUI            | Description
---                 | ---
gears               | How many gears the truck has.
gearsReverse        | How many reverse gears the truck has.
retarderStepCount   | How many steps the retarder has.
truckWheelCount     | How many wheels the truck has.
selectorCount       | How many selectors the truck has. (no clue what this means btw)
timeAbsDelivered    | The absolute time the delivery was made. (no clue what this means also)
maxTrailerCount     | The maximum amount of trailers the truck can have.
unitCount           | How many units of cargo the current job has.
plannedDistanceKm   | The distance of the planned route in km.

{.compact}
truckUI             | Description
---                 | ---
shifterSlot         | ?
retarderBrake       | ?
lightsAuxFront      | whether the front aux lights are on.
lightsAuxRoof       | whether the roof aux lights are on.
truckWheelSubstance | Material of the wheels.
hshifterPosition    | The position of the hshifter.
hshifterBitmask     | No clue why this is here...

{.compact}
gameplayUI                  | Description
---                         | ---
jobDeliveredDeliveryTime    | The time the delivery was made.
jobStartingTime             | The time the job started.
jobFinishedTime             | The time the job finished.

{.compact}
commonInt  | Description
---        | ---
restStop   | ?

{.compact}
truckInt            | Description
---                 | ---
gear                | The current gear of the truck.
gearDashboard       | The gear shown on the dashboard.
hshifterResulting   | The resulting hshifter position. (I guess)

{.compact}
commonFloat | Description
---         | ---
scale       | I would assume this is the scale of the game map, for ETS2 that's 1/19 and for ATS it's 1/20.

{.compact}
configFloat             | Description
---                     | ---
fuelCapacity            | The fuel capacity of the truck.
fuelWarningFactor       | The fuel warning factor, when the fuel is at this percentage the warning will show.
adblueCapacity          | The adblue capacity of the truck.
adblueWarningFactor     | The adblue warning factor, when the adblue is at this percentage the warning will show.
airPressureWarning      | The air pressure warning factor, when the air pressure is at this percentage the warning will show.
airPressureEmergency    | The air pressure emergency factor, when the air pressure is at this percentage the emergency warning will show.
oilPressureWarning      | The oil pressure warning factor, when the oil pressure is at this percentage the warning will show.
waterTemperatureWarning | The water temperature warning factor, when the water temperature is at this percentage the warning will show.
batteryVoltageWarning   | The battery voltage warning factor, when the battery voltage is at this percentage the warning will show.
engineRpmMax            | The maximum RPM of the engine.
gearDifferential        | The current (?) gear differential.
cargoMass               | The mass of the cargo.
truckWheelRadius        | The radius of the wheels. (array of len(16))
gearRatiosForward       | The forward gear ratios. (array of len(24))
gearRatiosReverse       | The reverse gear ratios. (array of len(8))
unitMass                | The mass of one unit.

{.compact}
truckFloat                  | Description
---                         | ---
speed                       | The speed of the truck. In m/s. For km/h multiply by 3.6. For mph multiply by 2.236936.
engineRpm                   | The RPM of the engine.
userSteer                   | The steering input of the user.
userThrottle                | The throttle input of the user.
userBrake                   | The brake input of the user.
userClutch                  | The clutch input of the user.
gameSteer                   | The steering input of the game.
gameThrottle                | The throttle input of the game.
gameBrake                   | The brake input of the game.
gameClutch                  | The clutch input of the game.
cruiseControlSpeed          | The speed of the cruise control.
airPressure                 | The air pressure of the truck.
brakeTemperature            | The temperature of the brakes.
fuel                        | The amount of fuel. (%)
fuelAvgConsumption          | The average fuel consumption of the truck. Note that this is broken like 50% of the time.
fuelRange                   | The range of the fuel in km.
adblue                      | The current amount of adblue. (%)
oilPressure                 | The current oil pressure
oilTemperature              | The current oil temperature
waterTemperature            | The current water temperature
batteryVoltage              | The current battery voltage
lightsDasboard              | ?
wearEngine                  | The wear of the engine.
wearTransmission            | The wear of the transmission.
wearCabin                   | The wear of the cabin.
wearChassis                 | The wear of the chassis.
wearWheels                  | The wear of the wheels.
truckOdometer               | The odometer of the truck.
routeDistance               | The distance left on the current route.
routeTime                   | The time left on the current route.
speedLimit                  | The current speed limit. In m/s. For km/h multiply by 3.6. For mph multiply by 2.236936.
truck_wheelSuspDeflection   | The suspension deflection of the wheels. (array of len(16))
truck_wheelVelocity         | The velocity of the wheels. (array of len(16))
truck_wheelSteering         | The steering of the wheels. (array of len(16))
truck_wheelRotation         | The rotation of the wheels. (array of len(16))
truck_wheelLift             | The lift of the wheels. (array of len(16))
truck_wheelLiftOffset       | The lift offset of the wheels. (array of len(16))

{.compact}
gameplayFloat           | Description
---                     | ---
jobDeliveredCargoDamage | The damage of the cargo.
jobDeliveredDistanceKm  | The distance of the delivery in km. For miles multiply by 0.621371.
refuelAmount            | The last refuel amount.

{.compact}
jobFloat    | Description
---         | ---
cargoDamage | The damage of the cargo for the current job.

{.compact}
configBool          | Description
---                 | ---
truckWheelSteerable | If the wheels are steerable (array of len(16))
truckWheelSimulated | If the wheels are simulated (array of len(16))
truckWheelPowered   | If the wheels are powered (array of len(16))
truckWheelLiftable  | If the wheels are liftable (array of len(16))
isCargoLoaded       | If the cargo is loaded.
specialJob          | If the job is special.

{.compact}
truckBool                   | Description
---                         | ---
parkBrake                   | If the parking brake is on.
motorBrake                  | If the motor brake is on.
airPressureWarning          | If the air pressure is below the warning level.
airPressureEmergency        | If the air pressure is below the emergency level.
fuelWarning                 | If the fuel is below the warning level.
adblueWarning               | If the adblue is below the warning level.
oilPressureWarning          | If the oil pressure is below the warning level.
waterTemperatureWarning     | If the water temperature is above the warning level.
batteryVoltageWarning       | If the battery voltage is below the warning level.
electricEnabled             | If the electric is enabled.
engineEnabled               | If the engine is enabled.
wipers                      | If the wipers are on.
blinkerLeftActive           | If the left blinker is active.
blinkerRightActive          | If the right blinker is active.
blinkerLeftOn               | If the left blinker is on (currently the light is enabled, this blinks with the light)
blinkerRightOn              | If the right blinker is on (currently the light is enabled, this blinks with the light)
lightsParking               | If the parking lights are on.
lightsBeamLow               | If the low beam lights are on.
lightsBeamHigh              | If the high beam lights are on.
lightsBeacon                | If the beacon lights are on.
lightsBrake                 | If the brake lights are on.
lightsReverse               | If the reverse lights are on.
lightsHazard                | If the hazard lights are on.
cruiseControl               | If the cruise control is on.
truck_wheelOnGround         | If the wheels are on the ground. (array of len(16))
shifterToggle               | If the shifter is toggled.
differentialLock            | If the differential lock is on.
liftAxle                    | If the axle is lifted.
liftAxleIndicator           | If the lift axle indicator is on.
trailerLiftAxle             | If the trailer axle is lifted.
trailerLiftAxleIndicator    | If the trailer lift axle indicator is on.

{.compact}
gameplayBool                | Description
---                         | ---
jobDeliveredAutoparkUsed    | If the autopark was used for the delivery.
jobDeliveredAutoloadUsed    | If the autoload was used for the delivery.

{.compact}
configVector        | Description
---                 | ---
cabinPositionX      | The X position of the cabin.
cabinPositionY      | The Y position of the cabin.
cabinPositionZ      | The Z position of the cabin.
headPositionX       | The X position of the head.
headPositionY       | The Y position of the head.
headPositionZ       | The Z position of the head.
truckHookPositionX  | The X position of the truck hook.
truckHookPositionY  | The Y position of the truck hook.
truckHookPositionZ  | The Z position of the truck hook.
truckWheelPositionX | The X position of the wheels. (array of len(16))
truckWheelPositionY | The Y position of the wheels. (array of len(16))
truckWheelPositionZ | The Z position of the wheels. (array of len(16))

{.compact}
truckVector         | Description
---                 | ---
lv_accelerationX    | The X linear acceleration of the truck.
lv_accelerationY    | The Y linear acceleration of the truck.
lv_accelerationZ    | The Z linear acceleration of the truck.
av_accelerationX    | The X angular acceleration of the truck.
av_accelerationY    | The Y angular acceleration of the truck.
av_accelerationZ    | The Z angular acceleration of the truck.
accelerationX       | The X acceleration of the truck.
accelerationY       | The Y acceleration of the truck.
accelerationZ       | The Z acceleration of the truck.
aa_accelerationX    | ?
aa_accelerationY    | ?
aa_accelerationZ    | ?
cabinAVX            | The X angular velocity of the cabin.
cabinAVY            | The Y angular velocity of the cabin.
cabinAVZ            | The Z angular velocity of the cabin.
cabinAAX            | ?
cabinAAY            | ?
cabinAAZ            | ?

{.compact}
headPlacement           | Description
---                     | ---
cabinOffsetX            | The X offset of the cabin.
cabinOffsetY            | The Y offset of the cabin.
cabinOffsetZ            | The Z offset of the cabin.
cabinOffsetrotationX    | The X rotation offset of the cabin.
cabinOffsetrotationY    | The Y rotation offset of the cabin.
cabinOffsetrotationZ    | The Z rotation offset of the cabin.
headOffsetX             | The X offset of the head.
headOffsetY             | The Y offset of the head.
headOffsetZ             | The Z offset of the head.
headOffsetrotationX     | The X rotation offset of the head.
headOffsetrotationY     | The Y rotation offset of the head.
headOffsetrotationZ     | The Z rotation offset of the head.

{.compact}
truckPlacement  | Description
---             | ---
coordinateX     | The X coordinate of the truck.
coordinateY     | The Y coordinate of the truck.
coordinateZ     | The Z coordinate of the truck.
rotationX       | The X rotation of the truck.
rotationY       | The Y rotation of the truck.
rotationZ       | The Z rotation of the truck.

{.compact}
configString                | Description
---                         | ---
truckBrandId                | The brand ID of the truck.
truckBrand                  | The brand of the truck.
truckId                     | The ID of the truck.
truckName                   | The name of the truck.
cargoId                     | The ID of the cargo.
cargo                       | The name of the cargo.
cityDstId                   | The ID of the destination city.
cityDst                     | The name of the destination city.
compDstId                   | The ID of the destination company.
compDst                     | The name of the destination company.
citySrcId                   | The ID of the source city.
citySrc                     | The name of the source city.
compSrcId                   | The ID of the source company.
compSrc                     | The name of the source company.
shifterType                 | The type of the shifter.
truckLicensePlate           | The license plate of the truck.
truckLicensePlateCountryId  | The country ID of the license plate.
truckLicensePlateCountry    | The country of the license plate.
jobMarket                   | The job market.

{.compact}
gameplayString  | Description
---             | ---
fineOffence     | The fine offence.
ferrySourceName | The name of the source ferry.
ferryTargetName | The name of the target ferry.
ferrySourceId   | The ID of the source ferry.
ferryTargetId   | The ID of the target ferry.
trainSourceName | The name of the source train.
trainTargetName | The name of the target train.
trainSourceId   | The ID of the source train.
trainTargetId   | The ID of the target train.

{.compact}
configLongLong  | Description
---             | ---
jobIncome       | The income of the job.

{.compact}
gameplayLongLong    | Description
---                 | ---
jobCancelledPenalty | The penalty of the cancelled job.
jobDeliveredRevenue | The revenue of the delivered job.
fineAmount          | The amount of the fine.
tollgatePayAmount   | The amount paid at the tollgate.
ferryPayAmount      | The amount paid at the ferry.
trainPayAmount      | The amount paid at the train.

{.compact}
specialBool     | Description
---             | ---
onJob           | If the player is on a job.
jobFinished     | If the job is finished.
jobDelivered    | If the job is delivered.
jobCancelled    | If the job is cancelled.
fined           | If the player is fined.
tollgate        | If the player is at a tollgate.
ferry           | If the player is at a ferry.
train           | If the player is at a train.
refuel          | If the player is refueling.
refuelPayed     | If the player has payed for the refuel.