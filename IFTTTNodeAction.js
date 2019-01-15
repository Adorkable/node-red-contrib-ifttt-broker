'use strict';
var ifttt = require('ifttt');
var iftttNodeActionField = require('./IFTTTNodeActionField');
var util = require('util');

module.exports = {
    class: function(node) {
        function action() {
            action.super_.call(this, node.endpoint);
        }
        util.inherits(action, ifttt.Action);
        
        action.prototype.node = node;

        action.prototype._getResponseData = function(request, requestPayload, callback) {

            const createResult = function() {
                return {
                    'id': node.endpoint + '_' + new Date()
                };
            };
  
            const handleTest = function(action, node, callback) {
                var results = [];
    
                var result = createResult();
    
                const field = node.field;
                if (typeof field === 'object' && typeof field.name === 'string') {
                    const fieldValue = requestPayload.getField(field.name);
    
                    if (field.invalidSampleData && fieldValue === field.invalidSampleData) {
                        return action.generateErrorResponse('Invalid value \'' + fieldValue + '\' for action field \'' + field.name + '\'', true, callback);
                    } else if (field.validSampleData && fieldValue === field.validSampleData) {
                    } else {
                      // TODO: should report unexpected
                    }
    
                    results.push(result);
                }
    
                return callback(null, results);
            };
  
            if (utility.isTestMode(request)) {
                return handleTest(this, this.node, callback);
            }
  
            var nodePayload = {
                timestamp: new Date().toISOString()
            };
  
            const field = this.node.field;
            if (typeof field === 'object' && typeof field.name === 'string') {
                const fieldValue = requestPayload.getField(field.name);
                if (typeof fieldValue === 'undefined') {
                  return action.generateErrorResponse('Value required for action field \'' + field.name + '\'', true, callback);
                }
    
                nodePayload.fields = {};
                nodePayload.fields[field.name] = fieldValue;
            }
  
            this.node.emit("input", {
                payload: nodePayload
            });
  
            var results = [
                createResult()
            ]; 
            return callback(null, results);
        }

        return action;
    },
    createDefault: function(node) {
      const result = new (this.class(node))();
  
      if (node.field !== undefined) {
          const actionFieldInstance = iftttNodeActionField.createDefault(node.field, true);
          result.registerField(actionFieldInstance);
      }
  
      return result;
    }
  };
