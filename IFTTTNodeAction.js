'use strict';
var ifttt = require('ifttt');
var iftttNodeActionField = require('./IFTTTNodeActionField');
var util = require('util');
var utility = require('./utility');

module.exports = {
    class: function(node) {
        function action() {
            action.super_.call(this, node.endpoint);
        }
        util.inherits(action, ifttt.Action);
        
        action.prototype.node = node;

        action.prototype._getResponseData = function(request, requestPayload, callback) {

            var fields = node.fields;
            if (!Array.isArray(fields)) {
                return action.generateErrorResponse('fields is unexpected type \'' + typeof fields + '\'', true, callback);
            }

            const createResult = function() {
                return {
                    'id': node.endpoint + '_' + new Date()
                };
            };

            const handleTest = function(action, callback) {
                var results = [];
    
                var result = createResult();
    
                for(var index = 0; index < fields.length; index ++) {
                    var field = fields[index];
                    if (typeof field === 'object' && typeof field.name === 'string') {
                        const fieldValue = requestPayload.getField(field.name);
        
                        if (field.sampleDataInvalid && fieldValue === field.sampleDataInvalid) {
                            return action.generateErrorResponse('Invalid value \'' + fieldValue + '\' for action field \'' + field.name + '\'', true, callback);
                        } else if (field.sampleDataValid && fieldValue === field.sampleDataValid) {
                        } else {
                            // TODO: should report unexpected
                        }
                    }
                }
                
                results.push(result);
    
                return callback(null, results);
            };
  
            if (utility.isTestMode(request)) {
                return handleTest(this, callback);
            }
  
            var nodePayload = {
                timestamp: new Date().toISOString(),
                fields: {}
            };
  
            // TODO: error if required field isn't provided
            // TODO: ensure we have all fields configured for response requirements
            for(var index = 0; index < fields.length; index ++) {
                const field = fields[index];

                if (typeof field === 'object' && typeof field.name === 'string') {
                    const fieldValue = requestPayload.getField(field.name);
                    if (typeof fieldValue === 'undefined' && field.required) {
                        return action.generateErrorResponse('Value required for action field \'' + field.name + '\'', true, callback);
                    }
        
                    nodePayload.fields[field.name] = fieldValue;
                }
            }
  
            this.node.emit("input", {
                payload: nodePayload
            });
  
            // TODO: double check if we need to respond with the processed fields
            var results = [
                createResult()
            ]; 
            return callback(null, results);
        }

        return action;
    },
    createDefault: function(node) {
        const result = new (this.class(node))();
    
        if (Array.isArray(node.fields)) {
            for(var index = 0; index < node.fields.length; index ++) {
                const field = node.fields[index];

                const actionFieldInstance = iftttNodeActionField.createDefault(field);
                result.registerField(actionFieldInstance);
            }
        } else {
            node.error("fields of unexpected type '" + typeof node.fields + "'");
        }
    
        return result;
    }
  };
