

export default class Utils {
    /**
     * 检查该Item是否被收藏
     * **/
    static checkFavorite(item, items) {
        for (var i = 0, len = items.length; i < len; i++) {
            let id = item.id ? item.id : item.fullName;
            if (id.toString() === items[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查项目更新时间
     * @param longTime 项目更新时间
     * @return {boolean} true 不需要更新,false需要更新
     */
    static checkDate(longTime) {
        return false;
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;
        // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
        return true;
    }

    /**
     * 转化时间格式
     * @param strTime
     * @returns {string}
     * @private
     */
    static _Time(strTime) {
        let d = new Date();
        d.setTime(strTime);
        let time = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}  ${d.getHours()}:${d.getMinutes()}`
        return time;
    }

    static FormatTime (date, fmt) { //author: meizz   
        let o = {   
            "M+" : date.getMonth()+1,                 //月份   
            "d+" : date.getDate(),                    //日   
            "h+" : date.getHours(),                   //小时   
            "m+" : date.getMinutes(),                 //分   
            "s+" : date.getSeconds(),                 //秒   
            "q+" : Math.floor((date.getMonth()+3)/3), //季度   
            "S"  : date.getMilliseconds()             //毫秒
        };   
        if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
        for(let k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        return fmt;   
    }
}