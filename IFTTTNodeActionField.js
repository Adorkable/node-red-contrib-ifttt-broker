'use strict';
var ifttt = require('ifttt');
var util = require('util');

module.exports = {
    class: function(field) {
        function actionField() {
            actionField.super_.call(this, field.name);
        }
        util.inherits(actionField, ifttt.Action.ActionField);

        actionField.prototype.nodeField = field;

        return actionField;    
    },
    createDefault: function(field, required) {
        const result = new (this.class(field))();

        result.fieldRequired = required;
        result.setOptionsSampleData(field.validSampleData, field.invalidSampleData);
    
        return result;
    }
};
