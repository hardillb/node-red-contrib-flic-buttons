##node-red-contrib-flic-buttons##

A Node-RED node to interact with the [flic.io][1] BLE buttons.

Based on the [node-flic-buttons][2] npm. This node requires the 
[fliclib-linux-dist][3] daemon to handle the low level comunication 
with the buttons. You will need to install this (and the correct 
version of bluez) before you start.

Buttons need to be paired before you can use this node at the moment. 
The best way to do this at the moment is to use the `flic` command 
that ships with the `fliclib-linux` package. The steps are as follows:

 - Ensure that `bluetoothd` and the `daemon` are running
 - run `flic`
 - type the command `startScan`
 - press the flic button (you may have to press and hold for 7 seconds 
 to unlock if it has been previously paired)
 - type the command `stopScan`
 - type the command `list`, this will show all known flic.io buttons
```
80:E4:DA:70:XX:XX [Disconnected]
```
 - type `connect [80:E4:DA:70:XX:XX]` where [mac address is the button you want
 to pair]
 - you should now see something that looks like 
```
Connected to: 80:E4:DA:70:XX:XX
Verified: 80:E4:DA:70:XX:XX
```
 - the button should now be paired

The node takes 2 config parameters

 - Host - this is the host running the flic.io daemon process, defaults to localhost
 - Port - the port for the daemon process, defaults to 5000

You shouldn't need to change these defaults unless you are doing something strange

The node emits a `msg.payload` that looks like this
```
{
  "deviceId":"80:E4:DA:70:XX:XX",
  "queued":false,
  "timeDiff":0,
  "isSingleClick":true,
  "isDoubleClick":false,
  "isHold":false
}
```



[1]: https://flic.io/?r=985093
[2]: https://www.npmjs.com/package/node-flic-buttons
[3]: https://github.com/50ButtonsEach/fliclib-linux-dist
