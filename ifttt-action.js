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

      // function action() {
      //   action.super_.call(this, node.endpoint);
      // }
      // util.inherits(action, ifttt.Action);
  
      // action.prototype._getResponseData = function(request, requestPayload, callback) {

      //   const createResult = function() {
      //     return {
      //       'id': node.endpoint + '_' + new Date()
      //     };
      //   };

      //   const handleTest = function(action, node, callback) {
      //     var results = [];

      //     var result = createResult();

      //     const field = node.field;
      //     if (typeof field === 'object' && typeof field.name === 'string') {
      //       const fieldValue = requestPayload.getField(field.name);

      //       if (field.invalidSampleData && fieldValue === field.invalidSampleData) {
      //         return action.generateErrorResponse('Invalid value \'' + fieldValue + '\' for action field \'' + field.name + '\'', true, callback);
      //       } else if (field.validSampleData && fieldValue === field.validSampleData) {
      //       } else {
      //         // TODO: should report unexpected
      //       }

      //       results.push(result);
      //     }

      //     return callback(null, results);
      //   };

      //   if (utility.isTestMode(request)) {
      //     return handleTest(this, this.node, callback);
      //   }

      //   var nodePayload = {
      //     timestamp: new Date().toISOString()
      //   };

      //   const field = this.node.field;
      //   if (typeof field === 'object' && typeof field.name === 'string') {
      //     const fieldValue = requestPayload.getField(field.name);
      //     if (typeof fieldValue === 'undefined') {
      //       return action.generateErrorResponse('Value required for action field \'' + field.name + '\'', true, callback);
      //     }

      //     nodePayload.fields = {};
      //     nodePayload.fields[field.name] = fieldValue;
      //   }

      //   this.node.emit("input", {
      //     payload: nodePayload
      //   });

      //   var results = [
      //     createResult()
      //   ]; 
      //   return callback(null, results);
      // }

      // const actionInstance = new action();
      // actionInstance.node = this;

      // if (this.field !== undefined) {
      //   function actionField() {
      //     actionField.super_.call(this, node.field.name);
      //   }
      //   util.inherits(actionField, ifttt.Action.ActionField);

      //   const actionFieldInstance = new actionField();
      //   actionFieldInstance.fieldRequired = true;
      //   actionFieldInstance.setOptionsSampleData(this.field.validSampleData, this.field.invalidSampleData);

      //   actionInstance.registerField(actionFieldInstance);
      // }

      // this.actionInstance = actionInstance;
      // this.brokerNode.ifttt.registerAction(actionInstance);

      // this.on('close', function(done) {
      //   this.brokerNode.ifttt.unregisterAction(actionInstance);
      //   done();
      // });

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
