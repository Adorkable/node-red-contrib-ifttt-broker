'use strict';
var ifttt = require('ifttt');
var util = require('util');

module.exports = {
    class: function(field) {
        function triggerField() {
            triggerField.super_.call(this, field.name);
        }
        util.inherits(triggerField, ifttt.Trigger.TriggerField);

        triggerField.prototype.nodeField = field;

        return triggerField;
    },
    createDefault: function(field) {
      const result = new (this.class(field))();
  
      result.setOptionsSampleData(field.sampleDataValid, field.sampleDataInvalid);
  
      return result;
    }
  };
