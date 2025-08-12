---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2025-8-12
icon: link
order: 99
title: Remote Connection
---

You can connect external devices to the ETS2LA instance running on your computer. This page will include common troubleshooting steps for remote connections.

---

#### Visualization
You can connect an external device (like a tablet) to the ETS2LA instance running on your local computer.
1. Make sure both your computer and your device are connected to the same network.
2. Make sure the `Visualization Sockets` plugin is enabled in ETS2LA.
3. Open `http://visualization.ets2la.com` in your device's browser. \
   **Note the HTTP protocol, HTTPS is not supported.** You will need a browser that allows pure HTTP connections like Firefox.
4. Press the red `Remote Connection` button to connect to your PC.

If these general steps don't work then you can follow the troubleshooting steps below.
1. Make sure your computer can access `http://ets2la.local:37520`. \
   Opening the page should display the ETS2LA version.
2. Make sure your device can access `http://ets2la.local:37520`. \
   If it can't, then the problem is between your device and the computer. We cannot help in this case, as networking is a rabbit hole of different devices and configurations.
3. Try to manually type the IP address of your computer, instead of pressing the `Remote Connection` button. \
   This IP address is provided in the `Visualization Sockets` plugin settings, you can also find it by running `ipconfig` in a terminal.

---

#### WebUI
You can also control the ETS2LA instance on your computer from an external device. This does have some limitations, but most settings should be available.
1. Make sure both your computer and your device are connected to the same network.
2. Open `http://app.ets2la.com` in your device's browser. \
   **Note the HTTP protocol, HTTPS is not supported.** You will need a browser that allows pure HTTP connections like Firefox.
3. The page will automatically connect to the ETS2LA instance if it can.

If these general steps don't work then you can follow the troubleshooting steps below.
1. Follow steps 1 and 2 in the above `Visualization` section.
2. The WebUI does not have the ability to manually select an IP address. If you cannot access the WebUI, then please contact us on Discord.