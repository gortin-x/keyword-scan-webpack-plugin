var KeywordScan = require("../src/index.js");
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
            keys: ["gortin"]
        })
    ]
};