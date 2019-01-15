module.exports = function(node) {
    return {
        log: console.log,
        info: node.log,
        warn: node.warn,
        error: node.error
    }
};