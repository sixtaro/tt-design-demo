export const getSize = size => {
    if (size / 1024 < 1000) {
        return `${(size / 1024).toFixed(2)} KB`;
    } else {
        return `${(size / 1024 / 1024).toFixed(2)} MB`;
    }
};

export const getParamsString = param => {
    const keys = Object.keys(param);
    const values = Object.values(param);
    const temp = keys.map((key, index) => `${key}=${values[index]}`);
    return temp.join('&');
};

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
                return 'removed';
            }
        case 4:
            return 'removed';
        default:
            return 'wait';
    }
};

export function UUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}

export const getFieldType = type => {
    switch (type) {
        case 1:
            return '文本';
        case 2:
            return '数值';
        case 3:
            return '日期';
        case 4:
            return '单选';
        case 5:
            return '多选';
        case 6:
            return '地址';
        case 7:
            return '人员';
        default:
            return '文本';
    }
};
