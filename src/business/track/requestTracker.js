import { isFilter } from './filter';
class RequestTracker {
    constructor(delay = 2000) {
        this.delay = delay; // 延迟确认时间
        this.pageCallbacks = new Map();
        this.requestList = new Map();
        this.requestTimer = new Map();
        this.pageID = null;
        this.viewID = null;
        this.viewName = null;
    }

    // 标记一个请求开始
    start(api, pageID, viewID) {
        // 被过滤的接口直接return
        if (isFilter(api)) {
            return;
        }
        let _pageID = viewID || pageID;
        let activeRequests;
        if (api && _pageID) {
            if (!this.requestList.has(_pageID)) {
                activeRequests = [];
            } else {
                activeRequests = this.requestList.get(_pageID);
            }
            activeRequests.push({
                api: api,
                time: Date.now(),
            });
            this.requestList.set(_pageID, activeRequests);
        }
        const timer = this.requestTimer.get(_pageID);
        if (timer) {
            clearTimeout(timer);
            this.requestTimer.delete(_pageID);
        }
    }
    end(api, pageID, viewID) {
        let _pageID = viewID || pageID;
        if (api && _pageID) {
            const list = this.requestList.get(_pageID);
            if (list) {
                const endApi = list.find(item => item.api === api);
                if (endApi) {
                    list.splice(list.indexOf(endApi), 1);
                    this.requestList.set(_pageID, list);
                    if (list.length === 0) {
                        this.requestList.delete(_pageID);
                        const lastRequestEndTime = Date.now();
                        const timeoutId = setTimeout(() => {
                            const totalTime = lastRequestEndTime - endApi.time;
                            const fn = this.pageCallbacks.get(_pageID);
                            fn && fn(totalTime);
                            clearTimeout(timeoutId);
                            // 加载完就不监听了
                            this.off(_pageID);
                        }, this.delay);
                        this.requestTimer.set(_pageID, timeoutId);
                    }
                }
            }
        }
    }

    clear() {
        this.pageCallbacks.clear();
        this.requestList.clear();
        this.requestTimer.clear();
        this.pageID = null;
        this.viewID = null;
        this.viewName = null;
    }

    setPage(pageID, viewID, viewName) {
        this.pageID = pageID;
        this.viewID = viewID;
        this.viewName = viewName;
    }

    on(viewID, callback) {
        this.pageCallbacks.set(viewID, callback);
    }

    off(viewID) {
        this.pageCallbacks.delete(viewID);
        this.requestList.delete(viewID);
        this.requestTimer.delete(viewID);
    }
}

export default new RequestTracker();
