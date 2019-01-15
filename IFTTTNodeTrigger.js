'use strict';
var ifttt = require('ifttt');
var iftttNodeTriggerField = require('./IFTTTNodeTriggerField');
var util = require('util');

module.exports = {
    class: function(node) {
        function trigger() {
            trigger.super_.call(this, node.endpoint);
        }
        util.inherits(trigger, ifttt.Trigger);
        
        trigger.prototype.node = node;

        trigger.prototype._getResponseData = function(request, requestPayload, callback) {
            const createResult = function(node, date) {
                const timestamp = Math.floor(date.getTime() / 1000);
                return {
                    'meta': {
                        'id': node.endpoint + '_' + timestamp,
                        'timestamp': timestamp
                    }
                };
            };
      
            const handleTest = function(node, responseLimit, callback) {
                var results = [];
      
                // TODO: find a place for 50 to be shared
                for (var count = 0; count < (responseLimit || 50); count ++) { // IFTTT defaults to max 50 responses if no limit is defined
                    var result = createResult(node, new Date(new Date().getTime() - count * 1000));
      
                    const field = node.field;
                    if (typeof field === 'object' && typeof field.name === 'string') {
                        const fieldValue = requestPayload.getField(field.name);
      
                        if (field.invalidSampleData && fieldValue === field.invalidSampleData) {
                        // TODO: this isn't really supposed to happen apparently
                        // TODO: think about what to do here
                        } else if (field.validSampleData && fieldValue === field.validSampleData) {
                            result[field.name] = 'triggered';
                        } else {
                            // TODO: should report unexpected
                        }
                    }
      
                    results.push(result);
                }
      
                return callback(null, results);
            };
    
            const responseLimit = requestPayload.getLimit();
    
            if (utility.isTestMode(request)) {
                return handleTest(this.node, responseLimit, callback);
            }
      
            var results = []; 
    
            // TODO: notify if we're going to drop results that haven't been sent
            if (this.node.triggerEventQueue.length > 50) {
                this.node.triggerEventQueue.length = 50;
            }
      
            for(var index = 0; index < this.node.triggerEventQueue.length; index ++) {
                const msg = this.node.triggerEventQueue[index];
      
                var result = createResult(this.node, msg.payload.createdAt);
      
                const field = this.node.field;
                if (typeof field === 'object' && typeof field.name === 'string') {
                    // const fieldValue = requestPayload.getField(field.name);
                    if (typeof msg.payload[field.name] === 'undefined') {
                    // continue;
                        msg.payload[field.name] = 'fakeData';
                    }
      
                    result[field.name] = msg.payload[field.name];
                    console.log(result);
                }
      
                results.push(result);
            }
      
            this.node.log("Sending IFTTT " + results.length + " trigger events");
      
            return callback(null, results);
        }

        return trigger;
    },
    createDefault: function(node) {
      const result = new (this.class(node))();
  
      if (node.field !== undefined) {
          const triggerFieldInstance = iftttNodeTriggerField.createDefault(node.field, true);
          result.registerField(triggerFieldInstance);
      }
  
      return result;
    }
  };
