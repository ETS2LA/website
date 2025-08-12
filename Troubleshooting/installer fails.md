---
authors: 
  - name: Tumppi066
    link: https://github.com/Tumppi066
    avatar: https://avatars.githubusercontent.com/u/83072683?v=4
date: 2025-8-12
icon: download
order: 99
title: Installer Fails
---

---

#### The installer doesn't open?
We use a standardized installer called `NSIS`. This program is used by many other applications as well. If the installer fails to even open, please check your antivirus settings to make sure it's not getting blocked. Also make sure you downloaded the installer from the [official repository](https://github.com/ets2la/installer/releases/latest) *(github.com)*.

---

#### I get an error message when installing?
If the installer throws an error message, it can be one of many cases. To determine the problem you are facing correctly, please click `Ok` on the error message, and click the `Show Details` button in the installer window. You can then look at the latest logs to match them to cases you see below.

`WARNING: Retrying (Retry(total=4...`
- This means that the installer is having trouble connecting to python servers. Please check your internet connection and make sure you can access python. Usually turning on a free VPN like [ProtonVPN](https://protonvpn.com/) *(protonvpn.com)* will fix this issue.

`fatal: destination path '.' already exists and is not an empty directory.`
- This means the directory you are trying to install ETS2LA to is not empty. If you haven't changed any settings, then you should delete the `C:\ETS2LA` folder and try again.

`fatal: unable to access '...'`
- This means the installer is having trouble connecting to the download mirror you selected. Please check your internet connection and make sure you can access at least one of the mirrors. Usually turning on a free VPN like [ProtonVPN](https://protonvpn.com/) *(protonvpn.com)* will fix this issue. 

`warning: Could not find remote branch rewrite to clone.`
- This means you are still using an old installer that is incompatible with changes made to the repository. Please download the latest version of the installer from the [official repository](https://github.com/ets2la/installer/releases/latest) *(github.com)*.

---

#### The installer crashes completely?
This hasn't happened yet, but if it does, then please contact us immediately on our [Discord server](https://ets2la.com/discord) *(ets2la.com)*. We will try to fix it as soon as possible. Installer crashes should never happen.

---