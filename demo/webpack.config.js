var KeywordScan = require("../index.js");

module.exports = {
    entry: {
        index: "./src/index.js"
    },
    output: {
        filename: "[name].bundle.js"
    },
    mode: 'production',
    plugins: [
        new KeywordScan({
            target: "./src/path",
            keys: ["gortin", "suen"]
        })
    ]
};