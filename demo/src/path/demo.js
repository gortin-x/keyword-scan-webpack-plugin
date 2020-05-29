/**
 * @file 金融pass
 * @author 16111921
 * @version 1.0.0
 */

//环境
import foo from "./foo";

var runtime = {
  run: "xgpre"
}

/**
 * 环境特征
 */
const config = {
  sit: "sitpaypassport.cn",
  pre: "prepaypassport.cn",
  xgpre: "xgprepaypassport.cn",
  pst: "pstpaypassport.cn",
  prd: "paypassport."
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
  "://" +
  run +
  "gortin.com/ids/login?loginTheme={{theme}}&service={{target}}";

/**
 * 金融pass
 */
export default url;
