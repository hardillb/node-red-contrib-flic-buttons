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

		//console.log( "Connecting to Flic Daemon at " + this.host + ":" + this.port );

		var client = new FlicClient(this.host, 5551);

		var node = this;

		node.status({fill:"green",shape:"ring",text:"Connecting..."});

		function handleClick(bdAddr, clickType, wasQueued, timeDiff) {
			//console.log(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");

				var msg = {
					topic: node.topic||'flic' + '/' + bdAddr,
					payload: {
						"deviceId":bdAddr,
						"queued":wasQueued,
						"timeDiff":timeDiff,
						"clickType":clickType
					}
				}
				node.send(msg);
		}

		function listenToButton(bdAddr) {

			var cc = new FlicConnectionChannel(bdAddr);
			client.addConnectionChannel(cc);

			//console.log("connecting to: " + bdAddr );

			cc.on("buttonSingleOrDoubleClickOrHold", function(clickType, wasQueued, timeDiff) {
				handleClick( bdAddr, clickType, wasQueued, timeDiff );
			});

			cc.on("buttonUpOrDown", function(clickType, wasQueued, timeDiff) {
				handleClick( bdAddr, clickType, wasQueued, timeDiff );
			});

			/**
			cc.on("createResponse", function(error, connectionStatus) {
				console.log( "createResponse for " + bdAddr + ": " + error + " : " + connectionStatus );
			});

			cc.on("removed", function(removedReason) {
				console.log( "removed for " + bdAddr + ": " + removedReason );
			});

			cc.on("connectionStatusChanged", function(connectionStatus, disconnectReason) {
				console.log( "connectionStatusChanged for " + bdAddr + ": " + connectionStatus + " : " + disconnectReason );
			});
			**/
		}

		client.once("ready", function() {
			//console.log("Connected to Flic daemon!");

			node.status({fill:"green",shape:"dot",text:"connected"});

			client.getInfo(function(info) {
				info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
					listenToButton(bdAddr);
				});
			});
		});

		/**
		client.on("bluetoothControllerStateChange", function(state) {
			console.log("Bluetooth controller state change: " + state);
		});
		**/

		client.on("newVerifiedButton", function(bdAddr) {
			//console.log("A new button was added: " + bdAddr);
			listenToButton(bdAddr);
		});

		client.on("error", function(error) {

			//console.log("Connection Error: " + error);

			node.status({fill:"red",shape:"dot",text:"Connection Error"});
		});

		client.on("close", function(hadError) {
			//console.log("Connection closed: " + hadError);

			node.status({fill:"red",shape:"dot",text:"Connection Closed"});
		});

		this.on('close', function() {
			client.close();
		});
		
	}
	RED.nodes.registerType('flic', flic);
};
