const CacheHelper = {
    _cache: {},
    addNonNilCache: function (key, value) {
        if (key) {
            this._cache[key] = value;
        }
    },
    getCache: function (key) {
        if (!key) {
            return null;
        } else {
            var cacheValue = this._cache[key];
            return cacheValue;
        }
    },
    remove: function (key) {
        if (this._cache[key]) {
            delete this._cache[key];
        }
    },
    removeAll: function () {
        for (let key in this._cache) {
            delete this._cache[key];
        }
    },
};

export default CacheHelper;

window.__cacheHelper = CacheHelper;
