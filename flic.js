/**
 * Copyright 2015 Benjamin Hardill
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
var Flic = require('node-flic-buttons');

module.exports = function(RED) {
	function flic(n) {
		RED.nodes.createNode(this,n);
		this.host = n.host;
		this.port = n.port;
		this.topic = n.topic;
		this.flic = new Flic(host, port);

		var node = this;

		node.status({fill:"green",shape:"dot",text:"connected"});

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
	}
	RED.nodes.registerType('flic', flic);
};