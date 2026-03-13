import qs from 'qs';
import axios from 'axios';
import { Utils } from '@/utils';
import tracker from '@/business/track/requestTracker';

// import { mock } from 'mockjs';

const noReplace = (url) => {
    // 不需要替换功能名字的接口
    const filterList = [
        '/get-user-group-function-name',
        'home/group/groupcard/groupcardlist',
        'home/group/groupcard/groupcarduserlist',
        'home/group/groupcard/groupcardbilllist',
        'home/group/groupcard/getGroupCardUserAuditList',
        'home/group/zigui/finance/getparkincomestats',
        'home/datacenter/groupcard/income/rank',
        'home/datacenter/groupcard/car/delaytimes',
        'home/datacenter/groupcard/income/changetrend',
        'home/datacenter/groupcard/income/numanalyse',
        'home/datacenter/groupcard/car/firstbuyanalyse',
        'home/datacenter/groupcard/freeanalyse',
        'home/datacenter/groupcard/car/delayrank',
        'home/datacenter/groupcard/groupcardstat',
        'home/datacenter/groupcard/car/durationrank',
        'home/datacenter/groupcard/car/delaytimesreport',
        'manager/groupcard/groupcardlist',
        'manager/business/charge/getmembercardlistbyusergroupid',
        'mortisejointenon/home/event/msgevent/list',
        'mortisejointenon/home/event/msgevent/detail',
        'mortisejointenon/home/event/msgnotice/list',
        'mortisejointenon/home/event/msgnotice/detail',
    ]
    return filterList.some(item => url.indexOf(item) >= 0);
};

const request = (api, params, apiConfig) => {
    return new Promise(async resolve => {
        // 标记请求开始（如果有跟踪器）
        const isTracked = !!tracker;
        const { pageID, viewID } = tracker;
        if (isTracked) {
            tracker.start(api, pageID, viewID);
        }

        if (!api) {
            if (isTracked) {
                tracker.end(api, pageID, viewID);
            }
            resolve({ success: false, message: '没有配置接口' });
        } else {
            if (window._request_params) {
                params = {
                    ...window._request_params,
                    ...params,
                };
            }
            const prevParams = Object.clone(params);
            let url;
            let type = 'get';
            if (typeof api === 'object') {
                url = api._url;
                type = api._type || 'get';
                if (api._token) {
                    params = {
                        token: api._token,
                        ...params,
                    };
                }
                if (api._params) {
                    params = {
                        ...params,
                        ...api._params,
                    };
                }
                if (api._before) {
                    params = api._before(params);
                }
            } else {
                url = api;
            }

            // 处理前缀，必须走域名+前缀路径，例如：前缀egova，https://www.xxx.com/egova/PublicV2
            url = Utils.getUrlWithBaseUrlPrefix(url);

            const _cacheKey = url + '?' + qs.stringify(params);
            let res = window.__cache.get(_cacheKey);
            // 如果同时调用多次相同接口，重复部分会进入waiting状态
            if (res?.status === 'waiting') {
                let res = await new Promise(resolve => {
                    let interval = setInterval(() => {
                        const value = window.__cache.get(_cacheKey);
                        if (value && value?.status !== 'waiting') {
                            resolve(value);
                            clearInterval(interval);
                        }
                    }, 100);
                    setTimeout(() => {
                        resolve({ success: false });
                        clearInterval(interval);
                    }, api._timeout || 30000);
                });
                if (res && window._memberCardText && !noReplace(url)) {
                    res = JSON.parse(JSON.stringify(res).replace(/会员[卡车](?!管理)/g, window._memberCardText));
                }
                // 结束跟踪并返回结果
                if (isTracked) {
                    tracker.end(api, pageID, viewID);
                }
                resolve(res);
                return;
            }
            if (typeof api === 'object' && api._result) {
                const { default: mock } = await import('mockjs');
                if (api._result instanceof Function) {
                    res = mock.mock(api._result(params));
                } else {
                    res = mock.mock(api._result);
                }
            }
            if (res) {
                if (typeof api === 'object' && api._handle) {
                    res = api._handle(res, params, prevParams);
                }
                if (res && window._memberCardText && !noReplace(url)) {
                    res = JSON.parse(JSON.stringify(res).replace(/会员[卡车](?!管理)/g, window._memberCardText));
                }
                // 结束跟踪并返回缓存结果
                if (isTracked) {
                    tracker.end(api, pageID, viewID);
                }
                resolve(res);
                return;
            } else {
                if (api._cacheKeys && api._cacheKeys.includes(_cacheKey)) {
                    api._cacheKeys.splice(api._cacheKeys.indexOf(_cacheKey), 1);
                }
            }
            let config = {};
            if (type === 'get') {
                config = {
                    params,
                    paramsSerializer: param => {
                        for (let key in param) {
                            let value = param[key];
                            if (typeof value === 'object' && !(value instanceof Array)) {
                                param[key] = JSON.stringify(value);
                            }
                        }
                        return qs.stringify(param, { arrayFormat: 'repeat' });
                    },
                };
            } else {
                config = {
                    data: params,
                    transformRequest: [
                        function (data) {
                            for (let key in data) {
                                let value = data[key];
                                if (typeof value === 'object' && !(value instanceof Array)) {
                                    data[key] = JSON.stringify(value);
                                }
                            }
                            return qs.stringify(data, { arrayFormat: 'repeat' });
                        },
                    ],
                };
            }

            if (typeof api === 'object') {
                config.timeout = api._timeout;
                config.silence = api._silence;
            }
            config = Object.assign(config, apiConfig);
            if (api._cache) {
                window.__cache.set(_cacheKey, { status: 'waiting' }, api._cache);
            }
            axios
                .request(url, {
                    method: type,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    ...config,
                })
                .then(res => {
                    if (api._cache) {
                        api._cacheKey = url + '?' + qs.stringify(params);
                        window.__cache.set(api._cacheKey, res, api._cache);
                        if (!api._cacheKeys) {
                            api._cacheKeys = [];
                        }
                        if (!api._cacheKeys.includes(api._cacheKey)) {
                            api._cacheKeys.push(api._cacheKey);
                        }
                    }
                    if (api._handle) {
                        res = api._handle(res, params, prevParams);
                    }
                    if (res && window._memberCardText && !noReplace(url)) {
                        res = JSON.parse(JSON.stringify(res).replace(/会员[卡车](?!管理)/g, window._memberCardText));
                    }
                    // 结束跟踪并返回失败结果
                    if (isTracked) {
                        tracker.end(api, pageID, viewID);
                    }
                    resolve(res && 'success' in res ? res : res && res.data ? res.data : res);
                })
                .catch(err => {
                    resolve({ success: false, message: '', error: err, ...err });
                });
        }
    });
};

const defaultCache = '1s';
const defaultType = 'get';

window.__cache = {
    get: function (key) {
        var value = this.data[key];
        if (value) {
            if (value.time && value.time < new Date()) {
                this.remove(key);
                return null;
            }
            return value.data;
        }
        return null;
    },
    set: function (key, value, time) {
        var t = null;
        if (time && time.length >= 2) {
            try {
                t = new Date();
                let n = parseInt(time.substring(0, time.length - 1), 10);
                let f = time.substring(time.length - 1, time.length);

                switch (f) {
                    case 's':
                        t.setSeconds(t.getSeconds() + n);
                        break;
                    case 'm':
                        t.setMinutes(t.getMinutes() + n);
                        break;
                    case 'h':
                        t.setHours(t.getHours() + n);
                        break;
                    case 'd':
                        t.setDate(t.getDate() + n);
                        break;
                    case 'w':
                        t.setDate(t.getDate() + n * 7);
                        break;
                    case 'M':
                        t.setMonth(t.getMonth() + n);
                        break;
                    case 'y':
                        t.setFullYear(t.getFullYear() + n);
                        break;
                }
                t = t.getTime();
            } catch (e) {
                t = null;
            }
        }
        this.data[key] = { data: value, time: t };
        return true;
    },
    remove: function (keys) {
        if (keys instanceof Array) {
            for (const key of keys) {
                delete this.data[key];
            }
        } else if (keys instanceof Object) {
            if (keys._cacheKeys) {
                for (const key of keys._cacheKeys) {
                    delete this.data[key];
                }
                delete keys._cacheKeys;
            }
        } else {
            delete this.data[keys];
        }
    },
    data: {},
};

export const loopApi = (obj, options = {}) => {
    options = Object.extend({}, options, {
        defaultCache,
        defaultType,
    });
    if (typeof obj === 'object') {
        for (let key in obj) {
            if (key.indexOf('_') === 0) {
                continue;
            }
            let val = obj[key];
            if (typeof val === 'string') {
                obj[key] = {
                    __url: val,
                };
                val = obj[key];
            }
            if (typeof val === 'object') {
                if (val._loop_done) {
                    continue;
                }
                val._loop_done = true;
                if (val.__url) {
                    val._url = val.__url;
                } else if (!val._url) {
                    if (obj._url) {
                        val._url = obj._url + '/' + key;
                    } else {
                        val._url = key;
                    }
                } else {
                    val._url = (obj._url ? obj._url + '/' : '') + val._url;
                }
                if (obj._token) {
                    val._token = obj._token;
                }
                if (obj._params) {
                    if (val._params) {
                        val._params = Object.extend(val._params, obj._params);
                    } else {
                        val._params = obj._params;
                    }
                }
                val._type = val._type || obj._type || options.defaultType;
                val._cache = val._cache !== undefined ? val._cache : obj._cache !== undefined ? obj._cache : options.defaultCache;
                if (!Object.isEmpty(val, [/^_/])) {
                    loopApi(val);
                }
            }
        }
    }
};

export default request;
