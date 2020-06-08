var path = require("path");
var validate = require('schema-utils');
var walkFile = require("./src/scan");

// schema for options object
var schema = {
    type: 'object',
    properties: {
        target: {
            type: 'string'
        },
        keys: {
            type: 'array'
        }
    }
};

class KeywordScan {
    constructor(options = {}) {
        validate(schema, options, {
            name: 'keyword-scan-plugin',
            postFormatter: (formattedError, error) => {
                if (error) {
                  return `${formattedError}\nAdditional Information.`;
                }
            
                return formattedError;
              },
        });

        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.done.tap('Hello World Plugin', (stats /* 在 hook 被触及时，会将 stats 作为参数传入。 */) => {});

        compiler.hooks.compile.tap('MyPlugin', params => {
            var pwd = process.env.PWD;
            walkFile(path.resolve(pwd, this.options.target), this.options.keys);
        });

        compiler.hooks.done.tap('done', (stats) => {
            // 在 done 事件中回调 doneCallback
            // console.log('在 done 事件中回调 doneCallback');
        });

        compiler.hooks.failed.tap('failed', (err) => {
            // 在 failed 事件中回调 failCallback
            // console.log('在 failed 事件中回调 failCallback');
        });
    }
}

module.exports = KeywordScan;