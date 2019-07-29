/**
 * 封装常用的业务相关功能函数
 */
// import fullInfoLabels from '../data/infoLabels';

/**
 * 时间戳的语义化表示
 * @param {number|string} timestamp   时间戳
 * @return {string} 该时间戳相对于当前时间点的语义化表达，如“刚刚”、“3分钟前”
 */
export function semanticTime(timestamp){
    var time = parseInt(timestamp);
    var gapTime = Date.now() - time;

    var gapArr = [
      {
        gap : 60 * 60 * 1000,
        func : function () {
          var result = Math.floor(gapTime / 60 / 1000);
          return result > 0 ? result+"分钟前" : "刚刚";
        }
      },
      {
        gap : 24 * 60 * 60 * 1000,
        func : function () {
          return Math.floor(gapTime / 60 / 60 / 1000) + "小时前";
        }
      },
      {
        gap : 7 * 24 * 60 * 60 * 1000,
        func : function () {
          return Math.floor(gapTime / 24 / 60 / 60 /1000) + "天前";
        }
      },
      {
        gap : Infinity,
        func : function () {
          var pushTime = new Date(time);
          var year = pushTime.getFullYear(),
            month = pushTime.getMonth() + 1,
            date = pushTime.getDate();

          return year+ "年" + month + "月" + date
            + '日';
        }
      }
    ];

    for(var i = 0; i < gapArr.length; i++) {
      if(gapTime < gapArr[i].gap){
        return gapArr[i].func.call();
      }
    }
  }

/**
 * 用户标签的语义映射
 * @param {Array} userLabels 接口返回的userLabels字段，格式形如：[{"position":"0","labelId":"778899970827747330","showStyle":"0"}]
 * @return {Object} labelObj 解析后的用户标签对象，格式形如：{v: false, wechat: true}，以标签名为key，是否具备该标签为value
 */
export function semanticUserLabels(userLabels) {
  if(!userLabels) return;
  const LABEL_MAP = {
    '788281141730738178': 'v',
    '788281283250749442' : 'star',
    '778899970827747330' : 'wechat',
    '791269618537725954' : 'auth'
  };

  let labels = userLabels.map((label)=>LABEL_MAP[label.labelId]);
  let labelObj = {};
  for (let label of labels)
    labelObj[label] = true;
  return labelObj;
}
