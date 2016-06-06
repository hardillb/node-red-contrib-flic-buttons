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

module.exports = function(RED) {
	function flicButton(n) {
		RED.nodes.createNode(this,n);

		this.client = RED.nodes.getNode(n.client);

		console.log( "client in button: " + this.client );

		this.address = n.address;

		/**
		client.getInfo(function(info) {
			info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
				listenToButton(bdAddr);
			});
		});
		**/

	}
	RED.nodes.registerType('Flic Button', flicButton);
};
