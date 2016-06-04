/**
 * Copyright 2015-2016 Benjamin Hardill
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 "use strict";
var fliclib = require("./lib/fliclibNodeJs");
var FlicClient = fliclib.FlicClient;
var FlicConnectionChannel = fliclib.FlicConnectionChannel;
var FlicScanner = fliclib.FlicScanner;

module.exports = function(RED) {
	function flic(n) {
		RED.nodes.createNode(this,n);
		this.host = n.host;
		this.port = n.port;
		this.topic = n.topic;

		console.log( "Connecting to Flic Daemon at " + this.host + ":" + this.port );

		var client = new FlicClient(this.host, 5551);

		var node = this;

		node.status({fill:"green",shape:"ring",text:"Connecting..."});

		function listenToButton(bdAddr) {
			var cc = new FlicConnectionChannel(bdAddr);
			client.addConnectionChannel(cc);
			cc.on("buttonUpOrDown", function(clickType, wasQueued, timeDiff) {
				console.log(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
			});
			cc.on("connectionStatusChanged", function(connectionStatus, disconnectReason) {
				console.log(bdAddr + " " + connectionStatus + (connectionStatus == "Disconnected" ? " " + disconnectReason : ""));
			});
		}

		client.once("ready", function() {
			console.log("Connected to Flic daemon!");

			node.status({fill:"green",shape:"dot",text:"connected"});

			client.getInfo(function(info) {
				info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
					listenToButton(bdAddr);
				});
			});
		});

		client.on("bluetoothControllerStateChange", function(state) {
			console.log("Bluetooth controller state change: " + state);
		});

		client.on("newVerifiedButton", function(bdAddr) {
			console.log("A new button was added: " + bdAddr);
			listenToButton(bdAddr);
		});

		client.on("error", function(error) {

			console.log("Connection Error: " + error);

			node.status({fill:"red",shape:"dot",text:"Connection Error"});
		});

		client.on("close", function(hadError) {
			console.log("Connection closed: " + hadError);

			node.status({fill:"red",shape:"dot",text:"Connection Closed"});
		});

/**
		function onClick(evt){
			var msg = {
				topic: this.topic||'flic' + '/' + evt.deviceId,
				payload: evt
			}
			node.send(msg);
		}

		this.flic.on('online', function(){
			node.status({fill:"green",shape:"dot",text:"connected"});
		});

		this.flic.on('offline', function(){
			node.status({fill:"red",shape:"dot",text:"disconnected"});
		});

		this.flic.on('click', onClick);

		this.on('close',function(){
			node.flic.removeListener('click', onClick);
			node.flic.close();
		});

		**/
	}
	RED.nodes.registerType('flic', flic);
};
