# node-red-contrib-flic-buttons

A Node-RED node to interact with the [flic.io][1] BLE buttons.

## Installing Flic Daemon
This node requires the [fliclib-linux-hci][2] daemon to handle the low level comunication with the buttons. You will need to install this before you start:

```
git clone https://github.com/50ButtonsEach/fliclib-linux-hci.git
```

you can either start the daemon manually:

```
cd bin/armv61/
./flicd -f flic.sqlite3
```
or you can edit /etc/rc.local to start the daemon on boot:

```
sudo nano /etc/rc.local
```
Add the following line just before the exit 0:
```
sleep 10 &&  /home/pi/git/fliclib-linux-hci/bin/armv6l/./flicd -d -l /var/log/flic.log  -f /home/pi/git/fliclib-linux-hci/bin/armv6l/flic.sqlite3 &

```
## Pairing Buttons

Buttons need to be paired before you can use this node at the moment. We do this using the scanwizard.js located in the lib folder.

 - Ensure that the `daemon` are running
 - Ensure that any phones or other devices that your flic buttons were previously paired with are switched off or have bluetooth disabled
 - navigate to `node-red-contrib-flic-buttons/lib`
 - type the command `node scanwizard.js`
 - press your flic button
 - If it has previously been paired to another device you will have to hold the flic button down for 7 seconds to put it into public mode
 - once paired take a note of the bluetooth address
 - repeat this for all your flic button noting down the address for each button

## Adding Buttons to Node-Red

Each flic node requires you specify a button and a click type. The button is configured with a configuration node that can be shared amounst multiple flic nodes. For example one `Living Room` button might be configured but one node will use the `SingleClick` event and another will use the `Hold` event.

The button config node takes the following parameters:

 - Host - this is the host running the flic.io daemon process, defaults to localhost
 - Port - the port for the daemon process, defaults to 5551
 - Button Address - the bluetooth address that you noted down when pairing your buttons

You shouldn't need to change these defaults unless you are doing something strange

The node emits a `msg.payload` that looks like this
```
{
  "deviceId":"80:E4:DA:70:XX:XX",
  "queued":true,
  "timeDiff":0,
  "clickType":"ButtonDown"
}
```

ClickType can be: `ButtonDown`,`ButtonUp`,`ButtonClick`,`ButtonSingleClick`,`ButtonDoubleClick`,`ButtonHold`.

[1]: https://flic.io/?r=985093
[2]: https://github.com/50ButtonsEach/fliclib-linux-hci
