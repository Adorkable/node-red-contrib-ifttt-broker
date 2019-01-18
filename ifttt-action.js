'use strict';

module.exports = function (RED) {
  var ifttt = require('ifttt');
  var util = require('util');
  var utility = require('./utility');
  const iftttNodeAction = require('./IFTTTNodeAction');

  function IFTTTActionNode(n) {
    RED.nodes.createNode(this, n);

    var node = this;
    
    utility.setNodeStatus(node, undefined);

    this.broker = n.broker;
    this.brokerNode = RED.nodes.getNode(this.broker);

    this.endpoint = n.endpoint;

    this.field = utility.createIFTTTFieldConfig(n.field, n.fieldValidSampleData, n.fieldInvalidSampleData);

    if (this.brokerNode.ifttt) {

      const actionInstance = iftttNodeAction.createDefault(node);
      node.actionInstance = actionInstance;

      node.brokerNode.ifttt.registerAction(actionInstance);

      node.on('close', function(done) {
          node.brokerNode.ifttt.unregisterAction(actionInstance);
          done();
      });

      utility.setNodeStatus(node, true);
    } else {
      utility.setNodeStatus(node, false);
    }

    this.on("input", function(msg) {
      msg.topic = this.endpoint;

      node.send(msg);
    });
  }

  RED.nodes.registerType('ifttt-action', IFTTTActionNode);
};
