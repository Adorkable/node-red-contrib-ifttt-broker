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

    createNodeStatus: function(statusValue) {
        if (typeof statusValue !== 'boolean') {
            return {
                fill: "gray",
                shape: "dot",
                text: "unknown"
            };
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

    setNodeStatus: function(node, statusValue) {
        node.status(
            this.createNodeStatus(statusValue)
        );
    },

    isTestMode: function(request) {
        if (!request || typeof request.get !== 'function') {
            return false;
        }

        return request.get('IFTTT-Test-Mode') === '1';
    }
}