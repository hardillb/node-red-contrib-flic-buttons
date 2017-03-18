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
	function flicButton(n) {
		RED.nodes.createNode(this,n);

		this.host = n.host;
		this.port = n.port;

		this.address = n.address;

		var node = this;

		var clientName = this.host + ":" + this.port;
		var globalContext = this.context().global;

		if(globalContext == null){
			globalContext = global;
		}

		if(globalContext.flicClients == null){
			globalContext.flicClients = {};
		}

		this.client = globalContext.flicClients[clientName];

		//console.log( "client (" + clientName + ") from lookup: " + this.client );

		if( this.client == null )
		{
			console.log( "Connecting to Flic Daemon at " + this.host + ":" + this.port);
			this.client = new FlicClient(this.host, 5551);

			globalContext.flicClients[clientName] = this.client;
		}

		this.on('close', function() {
			if(globalContext.flicClients[clientName]){

				//console.log( "closing client" );

				globalContext.flicClients[clientName].close();

				globalContext.flicClients[clientName] = undefined;
			}
		});

	}
	RED.nodes.registerType('Flic Button', flicButton);
};
