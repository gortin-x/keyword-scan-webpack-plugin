var vm = require("vm");
var fs = require("fs");
var rollup = require('rollup');
var path = require("path");

var targetPath = "../demo/src/path";

function sandBox(code){
    var context = {
        module: {
            exports: null
        }
    };
    vm.createContext(context); // Contextify the object.
    vm.runInContext(code, context);
    // console.log(context.module.exports);
    if(context.module.exports.indexOf("gortin") >= 0){
        console.log("检测到敏感字符串")
        process.exit();
    }
}

function walkFile(dir){
    var __dir = path.resolve(__dirname, dir)
    // 校验目录是否合法
    fs.stat(__dir,function(err,stats){
        if(err){
            console.log(err);
            return;
        }

        // 判断是否是文件；是返回true、不是返回false；
        if(!stats.isDirectory()){
            console.log("false");
            return;
        }

        // 遍历目录下的js文件
        //根据文件路径读取文件，返回文件列表
        fs.readdir(__dir,function(err,files){
            if(err){
                console.warn(err)
                return;
            }
            console.log(files)
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(__dir, filename);
                read(filedir).then(code => sandBox(code));
            });
        });
        console.log(`遍历目录${__dir}下的文件`)


        
    });
}

async function read(path){
    // create a bundle
    var bundle = await rollup.rollup({
        input: path
    });

    //错误
    var error;

    //输出
    var {
        output
    } = await bundle.generate({
        output: {
            format: 'cjs'
        },
        onwarn(warning, warn) {
            error = warning.message;
            return false;
        }
    });

    // or write the bundle to disk
    // await bundle.write(outputOptions);
    // console.log(output);
    let code = output && output.length > 0 ? output[0].code : '';

    return code;
}

class KeywordScan {
    apply(compiler) {
        compiler.hooks.done.tap('Hello World Plugin', (
            stats /* 在 hook 被触及时，会将 stats 作为参数传入。 */
        ) => {
            console.log('Hello KeywordScan!');
        });

        compiler.hooks.compile.tap('MyPlugin', params => {
            walkFile(targetPath);
        });

        compiler.hooks.done.tap('done', (stats) => {
            // 在 done 事件中回调 doneCallback
            console.log('在 done 事件中回调 doneCallback');
        });
        compiler.hooks.failed.tap('failed', (err) => {
            // 在 failed 事件中回调 failCallback
            console.log('在 failed 事件中回调 failCallback');
        });
    }
}

module.exports = KeywordScan;