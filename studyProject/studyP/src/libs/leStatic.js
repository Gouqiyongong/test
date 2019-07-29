import { lego } from '@zz/lego'
import Cookies from '@zz-vc/zz-open-libs/lib/libs/cookie'
import qs from 'querystring'
let urlQuery = qs.parse(location.search.split('?')[1])
const bussinessFlag = 'MATB-'
function paramFilter(str) {
  str = str.split('?')[0]
  str = str.split('&')[0]
  return str
}

function leStatic(actiontype, pagetype, backup = {}) {
  pagetype = pagetype || this.$route.name || this.$route.path || "undefined";
  if(pagetype.indexOf(bussinessFlag) != 0) {
    pagetype = bussinessFlag + pagetype
  }
  let fromChannel =
    Cookies.get('fromChannel') ||
    this.$route.query.fromChannel ||
    urlQuery.fromChannel ||
    ''
  let fromShare =
    Cookies.get('fromShare') ||
    this.$route.query.fromShare ||
    urlQuery.fromShare ||
    ''

  fromChannel && Object.assign(backup, { fromChannel: fromChannel })
  fromShare && Object.assign(backup, { fromShare: fromShare })

  let params = {
    actiontype: actiontype.toUpperCase(),
    pagetype: pagetype.toUpperCase(),
    backup: backup
  }

  lego.send(params)
}
export default {
  install(Vue) {
    Vue.prototype.$log = leStatic
  },
  leStatic
}
