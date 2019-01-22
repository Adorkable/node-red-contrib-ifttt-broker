'use strict';
var ifttt = require('ifttt');
var iftttNodeTriggerField = require('./IFTTTNodeTriggerField');
var util = require('util');
var utility = require('./utility');

module.exports = {
    class: function(node) {
        function trigger() {
            trigger.super_.call(this, node.endpoint);
        }
        util.inherits(trigger, ifttt.Trigger);
        
        trigger.prototype.node = node;

        trigger.prototype._getResponseData = function(request, requestPayload, callback) {

            var fields = node.fields;
            if (!Array.isArray(fields)) {
                return trigger.generateErrorResponse('fields is unexpected type \'' + typeof fields + '\'', true, callback);
            }

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
      
                    for(var index = 0; index < fields.length; index ++) {
                        const field = fields[index];
                        if (typeof field === 'object' && typeof field.name === 'string') {
                            const fieldValue = requestPayload.getField(field.name);
            
                            if (field.sampleDataInvalid && fieldValue === field.sampleDataInvalid) {
                            // TODO: this isn't really supposed to happen apparently
                            // TODO: think about what to do here
                            } else if (field.sampleDataValid && fieldValue === field.sampleDataValid) {
                                result[field.name] = 'processed';
                            } else {
                                // TODO: should report unexpected
                            }
                        }
                    }

                    // TODO: ensure we have all ingredients configured for node expectation and IFTTT expectation
                    for(var index = 0; index < node.ingredients.length; index ++) {
                    const ingredient = node.ingredients[index];
    
                        if (typeof ingredient === 'object' && typeof ingredient.slug === 'string') {
                            result[ingredient.slug] = 'This is a test.';
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
                const event = this.node.triggerEventQueue[index];
      
                var result = createResult(this.node, event.createdAt);
      
                // TODO: ensure we have all fields configured for node expectation and IFTTT expectation
                for(var fieldsIndex = 0; fieldsIndex < fields.length; fieldsIndex ++) {
                    const field = fields[fieldsIndex];

                    if (typeof field === 'object' && typeof field.name === 'string') {
                        const fieldValue = requestPayload.getField(field.name);
                        if (typeof fieldValue === 'undefined') {
                            return action.generateErrorResponse('Value required for trigger field \'' + field.name + '\'', true, callback);
                        }

                        // TODO: filter via match, regex, etc
                        // TODO: custom function processing
                        result[field.name] = 'processed';
                    }
                }

                var missingIngredients = [];
                // TODO: ensure we have all ingredients configured for node expectation and IFTTT expectation
                for(var ingredientsIndex = 0; ingredientsIndex < this.node.ingredients.length; ingredientsIndex ++) {
                    const ingredient = this.node.ingredients[ingredientsIndex];

                    if (typeof ingredient === 'object' && typeof ingredient.slug === 'string') {
                        if (typeof event.payload[ingredient.slug] !== 'undefined') {
                            result[ingredient.slug] = event.payload[ingredient.slug];
                        } else {
                            missingIngredients.push(ingredient.slug);
                        }
                    }
                }

                // TODO: should potentially be handled downstream at queue?
                if (missingIngredients.length === 0) {
                    results.push(result);

                    event.sent = true;
                } else {
                    this.node.error("Trigger event payload missing ingredients: '" + missingIngredients + "'")
                }      
            }
      
            this.node.log("Sending IFTTT " + results.length + " trigger events");
      
            this.node.updateNodeStatus();

            return callback(null, results);
        }

        return trigger;
    },
    createDefault: function(node) {
      const result = new (this.class(node))();
  
      if (node.field !== undefined) {
          const triggerFieldInstance = iftttNodeTriggerField.createDefault(node.field);
          result.registerField(triggerFieldInstance);
      }
  
      return result;
    }
  };
