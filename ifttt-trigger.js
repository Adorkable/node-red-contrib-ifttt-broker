module.exports = function (RED) {
  'use strict';
  var ifttt = require('ifttt');
  var util = require('util');
  var utility = require('./utility');
  const iftttNodeTrigger = require('./IFTTTNodeTrigger');

  function IFTTTTriggerNode(n) {
    RED.nodes.createNode(this, n);

    var node = this;
    
    utility.setNodeStatus(node, undefined);

    this.broker = n.broker;
    this.brokerNode = RED.nodes.getNode(this.broker);

    this.endpoint = n.endpoint;

    this.fields = n.fields;
    this.ingredients = n.ingredients;

    this.triggerEventQueue = [];

    this.addTriggerEvent = function(msg) { 
      msg.payload = {
        payload: msg.payload,
        createdAt: new Date()
      };
      this.triggerEventQueue.unshift(msg);

      // this.log("Queued trigger event");
      // console.log(msg);
    };
    this.on("input", function(msg) {
      msg.topic = this.endpoint;

      this.addTriggerEvent(msg);
    });

    if (this.brokerNode.ifttt) {

      const triggerInstance = iftttNodeTrigger.createDefault(node);
      node.triggerInstance = triggerInstance;

      this.brokerNode.ifttt.registerTrigger(triggerInstance);

      this.on('close', function(done) {
        this.brokerNode.ifttt.unregisterTrigger(triggerInstance);
        done();
      });

      utility.setNodeStatus(node, true);
    } else {
      utility.setNodeStatus(node, false);
    }
  }

  RED.nodes.registerType('ifttt-trigger', IFTTTTriggerNode);
};
