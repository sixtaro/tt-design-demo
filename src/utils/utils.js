import moment from 'moment';
import { parse, stringify } from 'qs';
import { pinyin } from 'pinyin-pro';

// 左边补零
export function fixedZero(val, length = 2) {
    if (isNaN(val)) {
        return val;
    }
    val = val.toString();
    while (val.length < length) {
        val = '0' + val;
    }
    return val;
}

export function getTimeDistance(type) {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === 'today') {
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }

    if (type === 'week') {
        let day = now.getDay();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        if (day === 0) {
            day = 6;
        } else {
            day -= 1;
        }

        const beginTime = now.getTime() - day * oneDay;

        return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
    }

    if (type === 'month') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const nextDate = moment(now).add(1, 'months');
        const nextYear = nextDate.year();
        const nextMonth = nextDate.month();

        return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
    }

    const year = now.getFullYear();
    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
    const arr = [];
    nodeList.forEach(node => {
        const item = node;
        item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
        item.exact = true;
        if (item.children && !item.component) {
            arr.push(...getPlainNode(item.children, item.path));
        } else {
            if (item.children && item.component) {
                item.exact = false;
            }
            arr.push(item);
        }
    });
    return arr;
}

// export function digitUppercase(n) {
//     return nzh.toMoney(n);
// }

function getRelation(str1, str2) {
    if (str1 === str2) {
        console.warn('Two path are equal!'); // eslint-disable-line
    }
    const arr1 = str1.split('/');
    const arr2 = str2.split('/');
    if (arr2.every((item, index) => item === arr1[index])) {
        return 1;
    }
    if (arr1.every((item, index) => item === arr2[index])) {
        return 2;
    }
    return 3;
}

function getRenderArr(routes) {
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
        // 去重
        renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
        // 是否包含
        const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
        if (isAdd) {
            renderArr.push(routes[i]);
        }
    }
    return renderArr;
}

// /**
//  * Get router routing configuration
//  * { path:{name,...param}}=>Array<{name,path ...param}>
//  * @param {string} path
//  * @param {routerData} routerData
//  */
export function getRoutes(path, routerData) {
    let routes = Object.keys(routerData).filter(routePath => routePath.indexOf(path) === 0 && routePath !== path);
    // Replace path to '' eg. path='user' /user/name => name
    routes = routes.map(item => item.replace(path, ''));
    // Get the route to be rendered to remove the deep rendering
    const renderArr = getRenderArr(routes);
    // Conversion and stitching parameters
    const renderRoutes = renderArr.map(item => {
        const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
        return {
            exact,
            ...routerData[`${path}${item}`],
            key: `${path}${item}`,
            path: `${path}${item}`,
        };
    });
    return renderRoutes;
}

export function getPageQuery() {
    return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
    const search = stringify(query);
    if (search.length) {
        return `${path}?${search}`;
    }
    return path;
}

/* eslint no-useless-escape:0 */
const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
    return reg.test(path);
}

export function formatWan(val) {
    const v = val * 1;
    if (!v || Number.isNaN(v)) {
        return '';
    }

    let result = val;
    if (val > 10000) {
        result = Math.floor(val / 10000);
        result = `${result}万`;
    }
    return result;
}

export const importCDN = (url, name) =>
    new Promise(resolve => {
        const dom = document.createElement('script');
        dom.src = url;
        dom.type = 'text/javascript';
        dom.onload = () => {
            resolve(window[name]);
        };
        document.head.appendChild(dom);
    });

export const reFixUrl = function (url, obj) {
    if (typeof url !== 'string') {
        console.warn('reFixUrl 传参url不是字符串');
        return null;
    }
    var queryString = [];
    if (obj) {
        for (var i in obj) {
            if (obj[i] instanceof Array) {
                var list = obj[i];
                for (var j in list) {
                    var item = list[j];
                    if (typeof item == 'object') {
                        for (var key in item) {
                            queryString.push(i + '[' + key + ']=' + item[key]);
                        }
                    } else {
                        queryString.push(i + '=' + item);
                    }
                }
            } else {
                if (obj[i] == null) {
                    queryString.push(i + '=');
                } else {
                    queryString.push(i + '=' + obj[i]);
                }
            }
        }
        queryString = queryString.join('&');
        if (url.indexOf('?') > -1) {
            return url + '&' + queryString;
        } else {
            return url + '?' + queryString;
        }
    }
};

export const getChromeVersion = () => {
    var arr = navigator.userAgent.split(' ');
    var chromeVersion = '';
    for (var i = 0; i < arr.length; i++) {
        if (/chrome/i.test(arr[i])) {
            chromeVersion = arr[i];
        }
    }
    if (chromeVersion) {
        return Number(chromeVersion.split('/')[1].split('.')[0]);
    } else {
        return false;
    }
};

export const recursiveTreeNode = function (treeNode, getLeafValue, getParentValue) {
    if (!treeNode.children) {
        return [];
    }
    if (treeNode.children.length === 0) {
        return getLeafValue(treeNode);
    }

    const childrenValue = treeNode.children.map(treeNodeChild => {
        return recursiveTreeNode(treeNodeChild, getLeafValue, getParentValue);
    });

    return getParentValue(treeNode, childrenValue);
};

export const getIconNameByNodeType = function (type) {
    switch (type) {
        case 1:
        case 'org':
        case 'icon-org':
            return 'icon-org';
        case 0:
        case 'park':
        case 'icon-park':
            return 'icon-park';
        case 'role':
            return 'icon-gangwei';
        case 'user':
            return 'user';
        case 'icon-user':
            return 'user';
        case 'passageway':
            return 'icon-tongdao';
        case 'device':
            return 'icon-chedao';
        case 'unit':
            return 'icon-bumen';
        case 'icon-unit':
            return 'icon-bumen';
        case 'icon-root':
            return 'icon-quanxian';
        case 'icon-none':
            return 'icon-quanxian';
        case 'icon-project':
            return 'icon-xiangmu';
        case 'groupbusiness':
            return 'icon-org';
        case 'allbusiness':
            return 'icon-org';
        case 'business':
            return 'icon-org';
        case 'icon-province':
            return 'icon-org';
        case 'icon-region':
            return 'icon-district';
        case 'icon-role':
            return 'icon-gangwei';
        default:
            return type;
    }
};

export const desktopTreeIcon = item => {
    const orgType = item.attributes.orgType;
    const isRoadSide = item.attributes.isRoadSide;

    if (item.attributes.type === 'user') {
        return 'user';
    }

    if (item.attributes.type === 'role') {
        return 'icon-xianxinggangweiguanli';
    }

    // if (item.attributes.type === 'org') {
    //     return 'icon-bumen1';
    // }

    switch (orgType) {
        case 0:
            return isRoadSide ? 'icon-lucechechang' : 'icon-fengbichechang';
        case 1:
            return 'icon-bumen1';
        case 3:
            return 'icon-zibumen';
        case 2:
            return 'icon-menjin';
        case 4:
            return 'icon-chongdianzhuang2';
        case 5:
            return 'icon-lianglunche';
        default:
            return 'icon-bumen1';
    }
};

// 设置网页标签
let lastTitle = '';
let lastFavIcon = '';
export const setWebPageLabel = function (title, favIcon) {
    lastTitle = document.title;
    lastFavIcon = document.querySelector('link[type="image/x-icon"]')?.getAttribute('href');
    if (favIcon) {
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = favIcon;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    if (title) {
        document.title = title;
    }
};

export const restoreWebPageLabel = function () {
    setWebPageLabel(lastTitle, lastFavIcon);
};

/** 表单验证 */
// 后台要求的int型，最大值不能超过2147483647
export const validateMaxInt = (rule, value, callback) => {
    if (value > 2147483647) {
        callback('数值不能超过2147483647，请输入有效数值');
    } else {
        callback();
        return;
    }
};

// 只能填写小数点后2位的正实数 0.01
export const validateUnit = (rule, value, callback) => {
    if (value !== '' && !/(^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$)/.test(value)) {
        callback('只能填写小数点后2位的正实数');
    } else {
        callback();
        return;
    }
};

// 小于1并且小数点后一位或者两位的数字 0.1
export const validateDiscount = (rule, value, callback) => {
    if ((value !== '' && !/([0]+(.[0-9]{1,2})?$)/.test(value)) || value < 0) {
        callback('请输入小于1并且小数点后一位或者两位的数字');
    } else {
        callback();
        return;
    }
};

// 请求url中的参数, code-encode、decode
export const getRequestParams = code => {
    let url = window.location.search;
    if (!url) {
        return {};
    }
    let paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');
    let paraObj = {};
    for (let i = 0; i < paraString.length; i++) {
        let j = paraString[i];
        let paraValue = j.substring(j.indexOf('=') + 1, j.length);
        if (code === 'encode') {
            paraValue = encodeURIComponent(paraValue);
        } else if (code === 'decode') {
            paraValue = decodeURIComponent(paraValue);
        }
        paraObj[j.substring(0, j.indexOf('='))] = paraValue;
    }
    return paraObj;
};

// 修复Url中有 /../../ 的情况
export const fixUrl = url => {
    if (typeof url !== 'string') {
        return url;
    }
    let protocol = '';
    if (url.indexOf('://') > -1 || url.indexOf('//') === 0) {
        protocol = url.split('//')[0] + '//';
    }
    const contentIndex = url.indexOf('/', protocol.length) + 1;
    const content = url.substr(contentIndex);
    const list = content.split('/');
    for (let i = 0; i < list.length; i++) {
        if (list[i] === '..') {
            if (i === 0) {
                list.splice(i, 1);
                i -= 1;
            } else {
                list.splice(i - 1, 2);
                i -= 2;
            }
        }
    }
    const newUrl = url.substring(0, contentIndex) + list.join('/');
    return newUrl;
};

// 生成uuid
export function uuid() {
    var tempUrl = URL.createObjectURL(new Blob());
    var uuid = tempUrl.toString(); // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
    URL.revokeObjectURL(tempUrl);
    return String.replaceAll(uuid.substr(uuid.lastIndexOf('/') + 1), '-', '');
}

// 车牌校验 参照c端，是c端 内地车牌、无牌、港澳车牌的组合
export const plateReg =
    /^[京津渝沪冀晋辽吉黑苏浙皖闽赣鲁豫鄂湘粤琼川贵云陕甘青蒙桂宁新藏][A-z\d][a-hj-np-zA-HJ-NP-Z\d]{4,5}[领学警挂港澳试超军a-hj-np-zA-HJ-NP-Z\d]$|^[使][\d]{6}$|^[\d]{6}[使]$|^[A-z]{2}[\d]{5}$|^WJ[京津渝沪冀晋辽吉黑苏浙皖闽赣鲁豫鄂湘粤琼川贵云陕甘青蒙桂宁新藏]?[\d]{4}[\dA-z]$|^[京津渝沪冀晋辽吉黑苏浙皖闽赣鲁豫鄂湘粤琼川贵云陕甘青蒙桂宁新藏][A-z\d]{5,6}[领]$|^[Uu电][A-z\d]{1,12}$|^[A-Z\d]{1,8}$/;
// 手机号校验 包括港澳手机号
export const telReg = /^1\d{10}$|^852[5,6,9]\d{7}$|^8536\d{7}$/;

// 复制文本
export function copyText(text) {
    var textarea = document.createElement('textarea'); //创建input对象
    var currentFocus = document.activeElement; //当前获得焦点的元素
    document.body.appendChild(textarea); //添加元素
    textarea.value = text;
    textarea.focus();
    if (textarea.setSelectionRange) {
        textarea.setSelectionRange(0, textarea.value.length); //获取光标起始位置到结束位置
    } else {
        textarea.select();
    }
    var flag = false;
    try {
        flag = document.execCommand('copy'); //执行复制
    } catch (eo) {
        flag = false;
    }
    document.body.removeChild(textarea); //删除元素
    currentFocus.focus();
    return flag;
}

// 获取拼音全拼与首字母，用于优化搜索体验。输入：云平台，返回：['yunpingtai', 'ypt']
export const getPinyin = text => {
    // 全拼的拼音
    const quanpin = [];
    // 首字母拼音
    const shoupin = [];
    // 取出每个字所有的拼音
    for (let index = 0; index < text.length; index++) {
        const word = text[index];
        quanpin.push(Array.uniq(pinyin(word, { toneType: 'none', multiple: true, type: 'array' })));
        shoupin.push(Array.uniq(pinyin(word, { toneType: 'none', pattern: 'first', multiple: true, type: 'array' })));
    }
    // 组合成句子
    let res = [[]];
    for (let i = 0; i < quanpin.length; i++) {
        let res1 = Object.clone(res);
        for (let j = 0; j < quanpin[i].length; j++) {
            const text = quanpin[i][j];
            // 待复制的句子
            if (j === 0) {
                for (let n = 0; n < res.length; n++) {
                    res[n].push(text);
                }
            } else {
                let res2 = Object.clone(res1);
                for (let m = 0; m < res2.length; m++) {
                    res2[m].push(text);
                }
                res.push(...res2);
            }
        }
    }
    for (let i = 0; i < res.length; i++) {
        res[i] = res[i].join('');
    }
    let resShou = [[]];
    for (let i = 0; i < shoupin.length; i++) {
        let res1 = Object.clone(resShou);
        for (let j = 0; j < shoupin[i].length; j++) {
            const text = shoupin[i][j];
            // 待复制的句子
            if (j === 0) {
                for (let n = 0; n < resShou.length; n++) {
                    resShou[n].push(text);
                }
            } else {
                let res2 = Object.clone(res1);
                for (let m = 0; m < res2.length; m++) {
                    res2[m].push(text);
                }
                resShou.push(...res2);
            }
        }
    }
    for (let i = 0; i < resShou.length; i++) {
        resShou[i] = resShou[i].join('');
    }
    res = res.join('‖');
    resShou = resShou.join('‖');
    return [res, resShou];
};

// 将手机号中间4位隐藏
export const encodeTel = tel => {
    if (Number(tel) && String(tel).length === 11) {
        var mobile = String(tel);
        var reg = /^(\d{3})\d{4}(\d{4})$/;
        return mobile.replace(reg, '$1****$2');
    } else {
        return tel;
    }
};

// 移除某种类型的子节点、去除空的父节点
// removeFunction 判断子节点是否需要移除
// isChildNodeFunction 判断是否是叶子节点
export function removeTreeNodes(tree, children = 'children', isChildNodeFunction, removeFunction) {
    return tree?.filter(node => {
        if (isChildNodeFunction && !isChildNodeFunction(node) && !node[children]?.length) {
            return false;
        }
        if (node[children]?.length > 0) {
            node[children] = removeTreeNodes(node[children], children, isChildNodeFunction, removeFunction);
            if (isChildNodeFunction && !isChildNodeFunction(node) && !node[children]?.length) {
                return false;
            }
        }
        if (isChildNodeFunction?.(node) && removeFunction?.(node)) {
            return false;
        }
        return true;
    });
}

export const imageReg =
    /\.(jpg|jpeg|bmp|gif|png|psd|dxf|tiff|svg|swf|pcx|wmf|emf|lic|fli|flc|eps|tga|xbm|tif|jfif|ico|webp|pjp|apng|pjpeg|avif|svgz|JPG|JPEG|BMP|GIF|PNG|PSD|DXF|TIFF|SVG|SWF|PCX|WMF|EMF|LIC|FLI|FLC|EPS|TGA|XBM|TIF|JFIF|ICO|WEBP|PJP|APNG|PJPEG|AVIF|SVGZ)$/;

// 手机号与座机号码 校验
export const telWithFixedPhoneReg = /^((\d{3,4}-?[0-9]{7,8})|(1\d{10}))$/;

export const downloadFile = (res, fileName) => {
    if (!res) {
        return;
    }
    if (window.navigator.msSaveBlob) {
        // IE以及IE内核的浏览器
        try {
            window.navigator.msSaveBlob(res, fileName);
        } catch (e) {
            console.log(e);
        }
    } else {
        const blob = res;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = e => {
            const a = document.createElement('a');
            a.download = `${fileName}`;
            a.href = e.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }
};

export const isJSON = str => {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
};

// 判断绝对路径
export function isAbsoluteURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

const BASE_URLS = [
    '/PublicV2/',
    '/Public/',
    '/Manager/',
    '/ManagerV2/',
    '/ManagerV3/',
    '/tongtongpay/',
    '/parksupervision/',
    '/WorkOrder/',
    '/CommonPlatform/',
    '/bs/',
    '/accountcenter/',
    '/parkaccess/',
    '/apiplatform/',
    '/mortisejointenon/',
    '/DataCenter/',
    '/Operation/',
    '/MessageCenter/',
    '/thirdapi/',
    '/CloudImplement/',
    '/CloudImplement-sync/',
    '/TongBenefit/',
    '/cloudpark-web/',
    '/tongtongoperation/',
];
// 处理前缀，必须走域名+前缀路径，例如：前缀egova，https://www.xxx.com/egova/PublicV2
export function getUrlWithBaseUrlPrefix(url) {
    if (window._baseURL_prefix) {
        if (!isAbsoluteURL(url)) {
            // console.log('url-old: ', url);
            let newUrl = fixUrl(url);
            function getUrl(_url) {
                if (_url.indexOf('../') === 0) {
                    _url = _url.slice(3);
                    return getUrl(_url);
                } else {
                    return _url;
                }
            }
            newUrl = getUrl(newUrl);
            const arr = newUrl.split('/').filter(item => !!item);
            if (BASE_URLS.includes(`/${arr[0]}/`)) {
                newUrl = '/' + window._baseURL_prefix + '/' + newUrl;
            } else {
                newUrl = '/' + window._baseURL_prefix + '/' + window._baseURL + '/' + newUrl;
            }
            newUrl = window.location.origin + newUrl.replace(/\/+/g, '/');
            // console.log('url-new: ', newUrl);
            return newUrl;
        }
        return fixUrl(url);
    }
    return fixUrl(url);
}

export function getDuration(duration, hasSeconds) {
    var res = '';
    var t = parseInt(duration / (1000 * 60 * 60 * 24), 10);
    var h = parseInt((duration - t * 24 * 60 * 60 * 1000) / (1000 * 60 * 60), 10);
    var m = parseInt((duration - t * 24 * 60 * 60 * 1000 - h * 1000 * 60 * 60) / (1000 * 60), 10);

    if (t > 0) {
        res = t + '天';
    }
    if (h > 0) {
        res += h + '小时';
    }
    if (m > 0) {
        res += m + '分钟';
    }
    if (hasSeconds && res.length === 0) {
        var s = parseInt(duration / 1000, 10);
        res = s + '秒钟';
    }
    return res;
}

export const generateTradeTypeTree = data => {
    const firstLevel = data.filter(item => item.seniorID === 0);
    let rest = data.filter(item => item.seniorID !== 0);

    let result = firstLevel.map(item => ({
        value: +item.value,
        label: item.text,
        children: [],
    }));

    function setChildrens(options) {
        options.forEach(option => {
            option.children = rest
                .filter(item => item.seniorID === option.value)
                .map(item => ({
                    value: +item.value,
                    label: item.text,
                    children: [],
                }));
            rest = rest.filter(item => item.seniorID !== option.value);

            if (rest.length === 0) {
                return;
            }

            if (option.children.length > 0) {
                setChildrens(option.children);
            }
        });
    }

    setChildrens(result);

    return result;
};
