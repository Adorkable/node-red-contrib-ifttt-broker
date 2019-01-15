module.exports = function (RED) {
  'use strict';
  var express = require('express');
  var ifttt = require('ifttt');
  var bodyParser = require('body-parser');
  var logger = require('./ifttt-logger');

  function IFTTTBrokerNode(n) {
    RED.nodes.createNode(this, n);

    this.expressPort = parseInt(n.port);

    var node = this;

    var expressApp = express();
    expressApp.use(bodyParser.json());
    var httpServer;
    
    var iftttService = new ifttt({ 
      serviceKey: n.serviceKey,
      logger: logger(node)
    });
    this.ifttt = iftttService;

    iftttService.handlers.status = function(request, callback) {
        callback(null, true);
    };

    iftttService.addExpressRoutes(expressApp);

    this.on('close', function (done) {
      this.closing = true;
      node.log('IFTTT broker shutting down');
      if (httpServer != undefined) {
        httpServer.close(function() { 
          done();
        });
      }
    });

    node.log('IFTTT broker listening on port ' + this.expressPort);
    httpServer = expressApp.listen(this.expressPort);
  }

  RED.nodes.registerType('ifttt-broker', IFTTTBrokerNode);
};
