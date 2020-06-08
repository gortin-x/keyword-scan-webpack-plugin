var vm = require("vm");
var fs = require("fs");
var rollup = require('rollup');
var path = require("path");

function sandBox(code, keys){
    var context = {
        module: {
            exports: null
        }
    };
    vm.createContext(context); // Contextify the object.
    vm.runInContext(code, context);
    // console.log(context.module.exports);
    keys.map(item => {
        if(context.module.exports.indexOf(item) >= 0){
            console.log("检测到敏感字符串")
            process.exit();
        }
    })
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

module.exports = function walkFile(dir, keys){
    var __dir = path.resolve(__dirname, dir);
    var __keys = keys || [];
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
                read(filedir).then(code => sandBox(code, __keys));
            });
        });
        console.log(`遍历目录${__dir}下的文件`)


        
    });
}
