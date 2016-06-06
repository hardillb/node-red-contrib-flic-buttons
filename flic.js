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

		this.topic = n.topic;
		this.event = n.event;

		this.button = RED.nodes.getNode(n.button);

		this.address = this.button.address;

		console.log( "Flic node address: " + this.address );

		console.log( "Flic node button client: " + this.button.client );
		console.log( "Flic node client: " + this.button.client.client );

		var client = this.button.client.client;

		var node = this;

		node.status({fill:"green",shape:"ring",text:"Connecting..."});

		function handleClick(bdAddr, clickType, wasQueued, timeDiff) {
			//console.log(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");

			if( clickType !== node.event && node.event !== "any" ){
				//console.log( "Discarding clicktype: " + clickType );
				return;
			}

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

			console.log("connecting to: " + bdAddr );

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
			console.log("Connected to Flic daemon!");

			node.status({fill:"green",shape:"dot",text:"connected"});

			listenToButton(node.address);
		});

		client.on("error", function(error) {

			//console.log("Connection Error: " + error);

			node.status({fill:"red",shape:"dot",text:"Connection Error"});
		});

		client.on("close", function(hadError) {
			//console.log("Connection closed: " + hadError);

			node.status({fill:"red",shape:"dot",text:"Connection Closed"});
		});

	}
	RED.nodes.registerType('flic', flic);
};
