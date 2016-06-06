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

module.exports = function(RED) {
	function flicClient(n) {
		RED.nodes.createNode(this,n);

		this.host = n.host;
		this.port = n.port;

		console.log( "Connecting to Flic Daemon at " + this.host + ":" + this.port);

		this.client = new FlicClient(this.host, 5551);

		var node = this;

		this.on('close', function() {
			node.client.close();
		});

		/**
		this.client.on("bluetoothControllerStateChange", function(state) {
			console.log("Bluetooth controller state change: " + state);
		});
		**/

	}
	RED.nodes.registerType('Flic Client', flicClient);
};
