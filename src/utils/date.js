/* eslint-disable no-extend-native */
// 补0
function add0(number) {
    return number > 9 ? number : `0${number}`;
}

Date.GetAll = (dateStr, isAdd0 = false) => {
    let date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    let result = {
        year: date.getFullYear(),
        month: isAdd0 ? add0(date.getMonth() + 1) : date.getMonth() + 1,
        day: isAdd0 ? add0(date.getDate()) : date.getDate(),
        hour: isAdd0 ? add0(date.getHours()) : date.getHours(),
        minute: isAdd0 ? add0(date.getMinutes()) : date.getMinutes(),
        second: isAdd0 ? add0(date.getSeconds()) : date.getSeconds(),
    };
    return result;
};

// 配置页面中使用了该计算，经营总览
// dateStr:起始时间  milliseconds:毫秒数  type：ADD-加 SUBTRACT
Date.AddSubtract = (dateStr, milliseconds, type = 'Add') => {
    let dt = new Date(dateStr.replace(/-/, '/'));
    let ndt = new Date(type === 'SUBTRACT' ? dt.getTime() - milliseconds : dt.getTime() + milliseconds);
    let result = Date.GetAll(ndt, true);
    return `${result.year}-${result.month}-${result.day} ${result.hour}:${result.minute}:${result.second}`;
};

Date.prototype.Format = function (fmt) {
    //author: meizz
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;
};

/*
按如下规则进行延期优化：
A月B日延期C个月，
先判断B日是否是A月的最后一天，
1.若为最后一天，则直接延期到（A+C）月的最后一天；
2.若不为最后一天，则初定延期到(A+C)月B日：
2.1.若B日是（A+C）月的有效日期，则得到结果；
2.2.若B日超过（A+C）月的有效日期，则取（A+C）月的最后一天
*/
Date.prototype.setNormalMonth = function (month) {
    if (this.isLastDayOfMonth()) {
        this.setDate(1);
        this.setMonth(month + 1);
        this.setDate(0);
    } else {
        let shouldMonth = new Date(this);
        shouldMonth.setDate(1);
        shouldMonth.setMonth(month);
        this.setMonth(month);
        if (this.Format('MM') !== shouldMonth.Format('MM')) {
            this.setDate(0);
        }
    }
};
// 月的最后一天
Date.prototype.isLastDayOfMonth = function () {
    let nextDay = new Date(this);
    nextDay.setDate(nextDay.getDate() + 1);
    return this.Format('MM') !== nextDay.Format('MM');
};
