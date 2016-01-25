"use strict";
var Flic = require('node-flic-buttons');

module.exports = function(RED) {
	function flic(n) {
		RED.nodes.createNode(this,n);
		this.host = n.host;
		this.port = n.port;
		this.topic = n.topic;
		this.flic = new Flic();

		var node = this;

		this.flic.on('click', function(evt){
			var msg = {
				topic: this.topic + '/' + evt.deviceId,
				payload: evt
			}
			node.send(msg);
		});
	}
	RED.nodes.registerType('flic', flic);
};