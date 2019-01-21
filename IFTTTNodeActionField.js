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
    createDefault: function(field) {
        const result = new (this.class(field))();

        result.fieldRequired = field.required;
        result.setOptionsSampleData(field.sampleDataValid, field.sampleDataInvalid);
    
        return result;
    }
};
