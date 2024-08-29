---
# https://retype.com/configuration/page/
# please also see the docs for components 
# https://retype.com/components/alert/
authors: 
  - name: DylDev
    link: https://github.com/DylDevs
    avatar: https://avatars.githubusercontent.com/u/110776467?v=4
date: 2024-6-9
icon: checklist
tags:
  - Annotation
  - Vehicle Detection
  - AI
---
# Vehicle Detection Image Annotation

## What's This?
Annotation is a very important part of object detection AI's. It allwos the neural network to know what an object is in an image. In order to create Vehicle Detection, we use an object detection model.It is a neural netowkr that can find cars, signs, and other objects on your screen for ETS2LA to process and use to createn a full self driving experience. Annotation comes in many forms, like, segmentation, bounding boxes, etc. For Vehicle Detection, we use a bounding box model called YOLO (You Only Look Once). This software allows us to easily create a state o the art object detection model. However, in order to train the model, we need to tell the model what to look for. This is where annotation comes in. We use a software called [insert software] which allows us to quickly and easily annotate these images with bounding boxes. Every bounding box has a "class". These can be in numeric form or in text form. You can check for a full list of classes at the end of this page. This is an example of what an annotated image looks like:

![Annotation Example](/assets/VehicleDeetectionAnnotation/annotation_example.png)

You should notice that around every car in this image, there is a box. This is called a bounding box. Once you annotate that, the model now knows what in that image is a car, and what in that images is not a car.

## Guidelines
Now that you know what annotation is, there are some guidelines that you should read before starting.

- Keep in mind that you are training a neural netowrk. **Neural networks think like humans.** If your human brain thinks that a vehicle should be detected, it most likely should. If you don't make it think like a human, it won't detect vehicles like a human can.
- Only annotate objects that fall within the classes specified at the end of this page.
- Make sure to annotate every vehicle and sign in the image with precision. The more precise the annotation is, the more accurate the model will be. This is very important for distance calculation.
- If you don't know what an object is, don't annotate it. It will not help the model.
- If an object is too blurry, don't annotate it. This is bad for the model. Of course, it can be slightly blurry because that's the nature of images. Here is an example of the most blurry vehicle that you should ever annotate:

![Blurry Vehicle Threshold](/assets/VehicleDeetectionAnnotation/blurry_vehicle.png)

If it is blurrier than the threshold, don't annotate it.
- If you have **any questions at all**, please ask them in the Discord.

## How Does it Work?
Coming soon.

## Classes
We have a total of 17 classes. These consist of different vehicle and sign types. 
You should read through these to see their numeric identifiers and all other information about the object. If you are unsure of what an object may be, ask in the Discord. Send a screenshot of it and we will tell you what to do with it.

==- Car
Coming soon. (a.k.a I'm lazy)
==- Truck
Coming soon. (a.k.a I'm lazy)
==- Van
Coming soon. (a.k.a I'm lazy)
==- Bus
Coming soon. (a.k.a I'm lazy)
==- Stop Sign
Comming soon. (a.k.a I'm lazy)
==- Yield Sign
Coming soon. (a.k.a I'm lazy)
==- Speed Limit Sign
Coming soon. (a.k.a I'm lazy)
==- Info Sign
Coming soon. (a.k.a I'm lazy)
==- Mandatory Sign
Coming soon. (a.k.a I'm lazy)
==- Warning Sign
Coming soon. (a.k.a I'm lazy)
==- Priority Sign
Coming soon. (a.k.a I'm lazy)
==- Prohibitary Sign
Coming soon. (a.k.a I'm lazy)
==- Regulatory Sign
Coming soon. (a.k.a I'm lazy)
==- Service Sign
Coming soon. (a.k.a I'm lazy)
==- Railroad Sign
Coming soon. (a.k.a I'm lazy)
==- Roadwork Sign
Coming soon. (a.k.a I'm lazy)
==- Additional Sign
Coming soon. (a.k.a I'm lazy)
===