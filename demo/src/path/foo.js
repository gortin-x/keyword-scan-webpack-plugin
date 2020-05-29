/**
 * @file 微信联合登录
 * @author 16111921
 * @version 1.0.0
 */

//环境
import demo from "./demo";

var runtime = {
  run: "prd"
}

/**
 * 环境特征
 */
const config = {
  sit: "sit.cn",
  pre: "pre.cn",
  xgpre: "xgpre.cn",
  pst: "pst.cn",
  prd: "."
};

/**
 * 环境key
 */
const run = config[config[runtime.run] ? runtime.run : "pre"];

/**
 * 拼接url
 */
const url =
  "http" +
  (runtime.run != "pst" ? "s" : "") +
  "://eppmembersjoint" +
  run +
  "gortin.com/sf-emjs/login.do?sysCode={{code}}&service={{target}}";

/**
 * 微信联合登录
 */
export default url;
