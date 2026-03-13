const store = {
    _data__: '_data__',
    _task__: '_task__',
    group: '',
    timer: new Map(),
    storage: localStorage,
    get: function (key, group = store.group, storage = store.storage) {
        if (storage) {
            var value = storage.getItem(group + store._data__ + key);
            if (value) {
                var j = JSON.parse(value);
                if (j.time && j.time < new Date()) {
                    storage.removeItem(group + store._data__ + key);
                    return null;
                }
                return j.data;
            }
        }
        return null;
    },
    set: function (key, value, time, group = store.group, storage = store.storage) {
        if (storage) {
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
            try {
                storage.setItem(group + store._data__ + key, JSON.stringify({ data: value, time: t }));
            } catch (ex) {
                this.clear(true);
                this.clearMapCache();
                storage.setItem(group + store._data__ + key, JSON.stringify({ data: value, time: t }));
            }
            return true;
        }
        return false;
    },
    remove: function (key, group = store.group, storage = store.storage) {
        if (storage) {
            storage.removeItem(group + store._data__ + key);
        }
    },
    clear: function (justCache, group = store.group, storage = store.storage) {
        if (storage) {
            for (var i = 0; i < storage.length; ) {
                if (storage.key(i).indexOf(group + store._data__) !== -1) {
                    if (justCache) {
                        var value = storage.getItem(storage.key(i));
                        if (value) {
                            var j = JSON.parse(value);
                            if (j.time && j.time < new Date()) {
                                if (storage.removeItem) {
                                    storage.removeItem(storage.key(i));
                                } else {
                                    return;
                                }
                            } else {
                                i++;
                            }
                        }
                    } else {
                        if (storage.removeItem) {
                            storage.removeItem(storage.key(i));
                        } else {
                            return;
                        }
                    }
                } else {
                    i++;
                }
            }
        }
    },
    listen: function (callback, key, time, storage = store.storage) {
        if (storage) {
            clearInterval(store.timer.get(key));
            store.lastTimer = setInterval(function () {
                var param = store.get(store._task__ + key, '');
                if (param && callback) {
                    callback(param);
                    store.remove(store._task__ + key, '', storage);
                }
            }, time || 100);
            store.timer.set(key, store.lastTimer);
            return store.lastTimer;
        }
    },
    removeListen: function (timer = store.lastTimer) {
        clearInterval(timer);
    },
    trigger: function (param, key, time) {
        store.set(store._task__ + key, param, time || '10s', '');
    },
    // 清除高德或者百度地图的缓存
    clearMapCache: function (storage = store.storage) {
        if (storage) {
            for (var i = 0; i < storage.length; ) {
                var key = storage.key(i);
                if (key.indexOf('_AMap_') === 0 || key.indexOf('BMap_') === 0) {
                    if (storage.removeItem) {
                        storage.removeItem(key);
                    } else {
                        return;
                    }
                } else {
                    i++;
                }
            }
        }
    },
};

export default store;
