module.exports = function (RED) {
  'use strict';
  var ifttt = require('ifttt');
  var util = require('util');
  var utility = require('./utility');
  const iftttNodeTrigger = require('./IFTTTNodeTrigger');

  function IFTTTTriggerNode(n) {
    RED.nodes.createNode(this, n);

    var node = this;
    
    utility.setNodeUnknownStatus(node, undefined);

    this.broker = n.broker;
    this.brokerNode = RED.nodes.getNode(this.broker);

    this.endpoint = n.endpoint;

    this.fields = n.fields;
    this.ingredients = n.ingredients;

    this.triggerEventQueue = [];

    this.unsentTriggerEventCount = function() {
      return this.triggerEventQueue.filter(function(test) {
        return test.sent === false;
      }).length;
    };

    this.updateNodeStatus = function() {
      if (this.brokerNode.ifttt) {
        const count = this.unsentTriggerEventCount();
        this.status({
          fill: count > 0 ? "yellow" : "green",
          shape: "dot",
          text: count + " unsent"
        });
      } else {
        utility.setNodeRegisterStatus(this, false);
      }
    };

    this.addTriggerEvent = function(msg) { 
      const event = {
        payload: msg.payload,
        createdAt: new Date(),
        sent: false
      };
      this.triggerEventQueue.unshift(event);

      this.updateNodeStatus();
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
    }
    this.updateNodeStatus();
  }

  RED.nodes.registerType('ifttt-trigger', IFTTTTriggerNode);
};
