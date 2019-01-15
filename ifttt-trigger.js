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

    this.field = utility.createIFTTTFieldConfig(n.field, n.fieldValidSampleData, n.fieldInvalidSampleData);

    this.triggerEventQueue = [];
    this.addTriggerEvent = function(msg) { 
      msg.payload = {
        payload: msg.payload,
        createdAt: new Date()
      };
      this.triggerEventQueue.unshift(msg);
      this.log("Queued trigger event");
      console.log(msg);
    };

    this.on("input", function(msg) {
      msg.topic = this.endpoint;

      this.addTriggerEvent(msg);
    });

    if (this.brokerNode.ifttt) {

      // function trigger() {
      //   trigger.super_.call(this, node.endpoint);
      // }
      // util.inherits(trigger, ifttt.Trigger);
  
      // trigger.prototype._getResponseData = function(request, requestPayload, callback) {

      //   const createResult = function(node, date) {
      //     const timestamp = Math.floor(date.getTime() / 1000);
      //     return {
      //       'meta': {
      //         'id': node.endpoint + '_' + timestamp,
      //         'timestamp': timestamp
      //       }
      //     };
      //   };

      //   const handleTest = function(node, responseLimit, callback) {
      //     var results = [];

      //     // TODO: find a place for 50 to be shared
      //     for (var count = 0; count < (responseLimit || 50); count ++) { // IFTTT defaults to max 50 responses if no limit is defined
      //       var result = createResult(node, new Date(new Date().getTime() - count * 1000));

      //       const field = node.field;
      //       if (typeof field === 'object' && typeof field.name === 'string') {
      //         const fieldValue = requestPayload.getField(field.name);

      //         if (field.invalidSampleData && fieldValue === field.invalidSampleData) {
      //           // TODO: this isn't really supposed to happen apparently
      //           // TODO: think about what to do here
      //         } else if (field.validSampleData && fieldValue === field.validSampleData) {
      //           result[field.name] = 'triggered';
      //         } else {
      //           // TODO: should report unexpected
      //         }
      //       }

      //       results.push(result);
      //     }

      //     return callback(null, results);
      //   };

      //   // const user = requestPayload.getUser();
      //   // const source = requestPayload.getIFTTTSource();
      //   const responseLimit = requestPayload.getLimit();
      //   // const identity = requestPayload.getIdentity();

      //   if (utility.isTestMode(request)) {
      //     return handleTest(this.node, responseLimit, callback);
      //   }

      //   var results = []; 

      //   if (this.node.triggerEventQueue.length > 50) {
      //     this.node.triggerEventQueue.length = 50;
      //   }

      //   for(var index = 0; index < this.node.triggerEventQueue.length; index ++) {
      //     const msg = this.node.triggerEventQueue[index];

      //     var result = createResult(this.node, msg.payload.createdAt);

      //     const field = this.node.field;
      //     if (typeof field === 'object' && typeof field.name === 'string') {
      //       // const fieldValue = requestPayload.getField(field.name);
      //       if (typeof msg.payload[field.name] === 'undefined') {
      //         // continue;
      //         msg.payload[field.name] = 'fakeData';
      //       }

      //       result[field.name] = msg.payload[field.name];
      //       console.log(result);
      //     }

      //     results.push(result);
      //   }

      //   this.node.log("Sending IFTTT " + results.length + " trigger events");

      //   return callback(null, results);
      // }

      // const triggerInstance = new trigger();
      // triggerInstance.node = this;

      // if (this.field !== undefined) {
      //   function triggerField() {
      //     triggerField.super_.call(this, node.field.name);
      //   }
      //   util.inherits(triggerField, ifttt.Trigger.TriggerField);

      //   const triggerFieldInstance = new triggerField();
      //   triggerFieldInstance.fieldRequired = true;
      //   triggerFieldInstance.setOptionsSampleData(this.field.validSampleData, this.field.invalidSampleData);

      //   triggerInstance.registerField(triggerFieldInstance);
      // }


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
