module.exports = {
    ensureStringOfLength: function(from) {
        if (typeof from !== 'string') {
          return undefined;
        }
        if (from.length === 0) {
          return undefined;
        }
        return from;
    },

    createNodeUnknownStatus: function() {
        return {
            fill: "gray",
            shape: "dot",
            text: "unknown"
        };
    },

    setNodeUnknownStatus: function(node) {
        node.status(this.createNodeUnknownStatus());
    },

    createNodeRegisterStatus: function(statusValue) {
        if (typeof statusValue !== 'boolean') {
            return this.createNodeUnknownStatus();
        } else if (statusValue === true) {
            return {
                fill: "green",
                shape: "dot",
                text: "registered"
            };
        } else {
            return {
                fill: "red",
                shape: "dot",
                text: "unregistered"
            }
        };
    },

    setNodeRegisterStatus: function(node, statusValue) {
        node.status(
            this.createNodeRegisterStatus(statusValue)
        );
    },

    isTestMode: function(request) {
        if (!request || typeof request.get !== 'function') {
            return false;
        }

        return request.get('IFTTT-Test-Mode') === '1';
    }
}