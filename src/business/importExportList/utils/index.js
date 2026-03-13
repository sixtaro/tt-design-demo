import moment from 'moment';

export const getState = (status, failType) => {
    switch (status) {
        case 0:
            return 'start';
        case 1:
            return 'pending';
        case 2:
            return 'success';
        case 3:
            if (failType !== 2) {
                return 'error';
            } else {
                return 'cancel';
            }
        case 4:
            return 'cancel';
        default:
            return 'wait';
    }
};

// 当前时间是否已经过期
export const getIsExpired = expireTime => {
    return moment().isAfter(moment(expireTime));
};

// 根据当前时间和过期时间的时间差，返回文本
export const getDurationText = expireTime => {
    const now = moment();
    const expire = moment(expireTime);
    if (now.isAfter(expire)) {
        return `文件已过期`;
    }
    const duration = moment.duration(expire.diff(now));
    const day = duration.days();
    const hour = duration.hours();
    const minute = duration.minutes();
    if (day >= 1) {
        return `文件准备完成。文件下载链接将于${day}天${hour > 0 ? hour + '小时' : ''}后失效，请尽快下载`;
    }
    if (day < 1) {
        if (hour > 0) {
            return `文件准备完成。文件下载链接将于${hour}小时${minute > 0 ? minute + '分钟' : ''}后失效，请尽快下载`;
        } else {
            return `文件准备完成。文件下载链接将于${minute}分钟后失效，请尽快下载`;
        }
    }
};
