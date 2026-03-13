import sensors from 'sa-sdk-javascript';
import { Storage } from '@/utils';
import moment from 'moment';
import tracker from '@/business/track/requestTracker';

/** 生成混合 UUID（数字+小写字母） */
const generateMixedUUID = () => {
    const hexString = Math.random().toString(16).slice(2);
    const fullHexString = hexString.padStart(16, '0');
    const digits = fullHexString.replace(/[^0-9]/g, '');
    const lowercase = fullHexString.replace(/[^a-z]/g, '');
    return (digits + lowercase).padEnd(16, '0').slice(0, 16);
};

// 本地存储键名常量
const STORAGE_KEYS = {
    IS_INITIALIZED: 'track_is_initialized',
    EVENT_SESSION_ID: 'event_sessionId',
    BASE_PROPERTIES: 'track_base_properties',
    PAGE_PROPERTIES: 'track_page_properties',
    APP: 'track_appId',
    INIT_CONFIG: 'track_init_config',
};

class Track {
    appId = null;
    /** 初始化状态标记（优先从本地存储读取） */
    static get isInitialized() {
        return Storage.get(STORAGE_KEYS.IS_INITIALIZED) === 'true';
    }

    static set isInitialized(value) {
        Storage.set(STORAGE_KEYS.IS_INITIALIZED, String(value));
    }

    /** 全局基础属性（持久化到本地存储） */
    static get baseProperties() {
        const stored = Storage.get(STORAGE_KEYS.BASE_PROPERTIES);
        return stored ? JSON.parse(stored) : {};
    }

    static set baseProperties(value) {
        Storage.set(STORAGE_KEYS.BASE_PROPERTIES, JSON.stringify(value));
    }

    /** 当前页面属性（持久化到本地存储） */
    static get pageProperties() {
        const stored = Storage.get(STORAGE_KEYS.PAGE_PROPERTIES);
        return stored ? JSON.parse(stored) : {};
    }

    static set pageProperties(value) {
        Storage.set(STORAGE_KEYS.PAGE_PROPERTIES, JSON.stringify(value));
    }

    /** 会话 ID（从本地存储读取/写入） */
    static get eventSessionId() {
        return Storage.get(STORAGE_KEYS.EVENT_SESSION_ID) || '';
    }

    static set eventSessionId(value) {
        Storage.set(STORAGE_KEYS.EVENT_SESSION_ID, value);
    }

    /** 初始化配置 */
    static set initConfig(value) {
        Storage.set(STORAGE_KEYS.INIT_CONFIG, value);
    }

    static get initConfig() {
        return Storage.get(STORAGE_KEYS.INIT_CONFIG);
    }

    static set appId(value) {
        Storage.set(STORAGE_KEYS.APP, value);
    }

    static get appId() {
        return Storage.get(STORAGE_KEYS.APP);
    }

    /**
     * 初始化神策分析（支持刷新后恢复状态）
     * @param config 初始化配置
     * @param properties 额外基础属性
     */
    static init(config, properties = {}) {
        // 从本地存储恢复初始化状态
        const storedInitialized = this.isInitialized;
        if (storedInitialized) {
            console.warn('本地存储标记已初始化，但 SDK 未初始化，重新初始化');
        }

        try {
            // 校验必填配置
            if (!config?.server_url) {
                throw new Error('神策初始化失败：缺少 server_url 配置');
            }

            // // 初始化会话 ID（从存储读取或生成新的）
            // this.initSessionId();

            // 初始化用户信息
            const user = this.getUserInfo();
            if (user.userID) {
                sensors.login(user.userID);
            }
            const sensorConfig = {
                server_url: config.server_url,
                useClientTime: true,
                sendType: 'beacon',
                showLog: process.env.NODE_ENV === 'development',
                ...config,
            };

            // 初始化神策 SDK
            sensors.init(sensorConfig);

            this.initConfig = sensorConfig;
            // 初始化基础属性（合并存储的属性和新属性）
            const storedBaseProps = this.baseProperties;
            this.baseProperties = {
                userId: user.userID,
                userName: user.userName,
                cloudName: user.cloud_name,
                cloudId: user.cloud_id,
                userGroupId: user.userGroupID,
                appEnv: process.env.NODE_ENV,
                ...storedBaseProps,
                ...properties,
            };

            // 标记为已初始化（持久化）
            this.isInitialized = true;
            console.log('神策分析初始化成功');
            return true;
        } catch (error) {
            console.error('神策分析初始化失败：', error);
            this.isInitialized = false;
            return false;
        }
    }

    static destroy() {
        this.clear();
        this.initConfig = null;
        Storage.remove(STORAGE_KEYS.INIT_CONFIG);
    }

    /**
     * 清除初始化状态与缓存（退出登录时调用）
     */
    static clear() {
        // 清除内存状态
        this.isInitialized = false;
        this.baseProperties = {};
        this.pageProperties = {};
        this.eventSessionId = '';

        // 清除本地存储
        Storage.remove(STORAGE_KEYS.IS_INITIALIZED);
        Storage.remove(STORAGE_KEYS.EVENT_SESSION_ID);
        Storage.remove(STORAGE_KEYS.BASE_PROPERTIES);
        Storage.remove(STORAGE_KEYS.PAGE_PROPERTIES);

        // 清除神策 SDK 状态
        sensors.logout();
        console.log('神策分析状态已清除');
    }

    /**
     * 设置用户属性（神策用户画像）
     * @param profile 用户属性对象
     */
    static setProfile(profile = {}) {
        if (!this.checkInitialized()) {
            return;
        }
        if (Object.keys(profile).length === 0) {
            console.warn('设置用户属性失败：属性对象不能为空');
            return;
        }
        sensors.setProfile(profile);
    }

    /**
     * 通用事件跟踪
     * @param eventName 事件名称
     * @param properties 事件属性
     */
    static track(eventName, properties = {}) {
        if (!this.checkInitialized()) {
            console.warn('请先初始化埋点');
            return;
        }
        if (!eventName) {
            console.warn('跟踪事件失败：事件名称不能为空');
            return;
        }

        try {
            const eventProperties = {
                ...this.baseProperties,
                ...this.pageProperties,
                appId: this.appId,
                ...properties,
                url: window.location.href,
                title: document.title,
                timestamp: Date.now(),
                eventTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                $event_session_id: this.eventSessionId,
            };

            sensors.track(eventName, eventProperties);
        } catch (error) {
            console.error(`跟踪事件[${eventName}]失败：`, error);
        }
    }

    /**
     * 跟踪按钮点击
     * @param buttonName 按钮名称
     * @param properties 额外属性
     */
    static trackButtonClick(buttonName, properties = {}) {
        if (!buttonName) {
            console.warn('跟踪按钮点击失败：按钮名称不能为空');
            return;
        }
        this.track('click', {
            buttonName,
            ...properties,
        });
    }

    /**
     * 跟踪页面加载
     * @param pageId 页面ID
     * @param properties 额外属性
     */
    static trackPageLoad(pageId, properties = {}) {
        if (!pageId) {
            console.warn('跟踪页面加载失败：页面ID不能为空');
            return;
        }
        this.track('pageLoad', {
            pageId,
            ...properties,
        });
    }

    /**
     * 跟踪视图加载
     * @param viewId 视图ID
     * @param properties 额外属性
     */
    static trackViewLoad(viewId, properties = {}) {
        if (!viewId) {
            console.warn('跟踪视图加载失败：视图ID不能为空');
            return;
        }
        this.track('viewLoad', {
            viewId,
            ...properties,
        });
    }

    /**
     * 跟踪应用进入
     * @param appId 应用ID
     * @param properties 额外属性
     */
    static trackAppEnter(appId, properties = {}) {
        if (!appId) {
            console.warn('跟踪应用进入失败：应用ID不能为空');
            return;
        }
        // 初始化会话 ID（从存储读取或生成新的）
        this.initSessionId();
        this.appId = appId;
        this.track('appEnter', {
            appId,
            ...properties,
        });
    }

    /**
     * 跟踪应用离开
     * @param appId 应用ID
     * @param properties 额外属性
     */
    static trackAppLeave(appId, properties = {}) {
        if (!appId) {
            console.warn('跟踪应用离开失败：应用ID不能为空');
            return;
        }
        this.trackPageLeave();
        this.track('appLeave', {
            appId,
            ...properties,
        });
        Storage.remove(STORAGE_KEYS.APP);
        Storage.remove(STORAGE_KEYS.EVENT_SESSION_ID);
    }

    /**
     * 跟踪页面进入（刷新后恢复页面属性）
     * @param pageId 页面ID
     * @param properties 额外属性
     */
    static trackPageEnter(pageId, properties = {}) {
        if (!pageId) {
            console.warn('跟踪页面进入失败：页面ID不能为空');
            return;
        }

        const { viewId, viewName, pageName } = properties;
        tracker.setPage(pageId, viewId, viewName);

        // 监听请求完成时间
        if (viewId) {
            tracker.on(viewId, totalTime => {
                console.log(`${viewName || viewId}请求完成，耗时:${totalTime}ms`);
                this.trackPageLoad(pageId, {
                    loadTime: totalTime,
                    pageName,
                    viewId,
                    viewName,
                });
            });
        }

        // 触发页面进入事件
        this.track('pageEnter', {
            pageId,
            ...properties,
        });

        // 保存页面属性到本地存储（刷新后恢复）
        this.pageProperties = {
            pageId,
            ...properties,
        };
    }

    /**
     * 跟踪页面离开
     * @param pageId 页面ID
     * @param properties 额外属性
     */
    static trackPageLeave(pageId, properties = {}) {
        // if (!pageId) {
        //     console.warn('跟踪页面离开失败：页面ID不能为空');
        //     return;
        // }

        const { viewId } = properties;
        if (viewId) {
            tracker.off(viewId);
        }

        // 触发页面离开事件
        this.track('pageLeave', {
            ...(pageId ? { pageId: pageId } : {}),
            ...properties,
        });

        // 清除当前页面属性
        this.pageProperties = {};
    }

    /**
     * 跟踪视图进入
     * @param viewId 视图ID
     * @param properties 额外属性
     */
    static trackViewEnter(viewId, properties = {}) {
        if (!viewId) {
            console.warn('跟踪视图进入失败：视图ID不能为空');
            return;
        }
        this.track('viewEnter', {
            viewId,
            ...properties,
        });
    }

    /**
     * 跟踪视图离开
     * @param viewId 视图ID
     * @param properties 额外属性
     */
    static trackViewLeave(viewId, properties = {}) {
        if (!viewId) {
            console.warn('跟踪视图离开失败：视图ID不能为空');
            return;
        }
        this.track('viewLeave', {
            viewId,
            ...properties,
        });
    }

    /**
     * 初始化会话 ID（从存储读取或生成）
     */
    static initSessionId() {
        const sessionId = generateMixedUUID();
        this.eventSessionId = sessionId;
        console.log('生成新会话ID：', sessionId);
    }

    /**
     * 获取用户信息（从本地存储读取）
     */
    static getUserInfo() {
        return Storage.get('user') || {};
    }

    /**
     * 检查是否已初始化
     */
    static checkInitialized() {
        const initialized = this.isInitialized;
        if (!initialized) {
            console.warn('神策分析未初始化，请先在首页调用 Track.init()');
        }
        return initialized;
    }

    /**
     * 页面卸载时的清理（确保事件发送完成）
     */
    // static initUnloadHandler() {
    //     window.addEventListener('beforeunload', () => {
    //         // 发送页面离开事件（使用同步方式确保发送成功）
    //         if (this.isInitialized && Object.keys(this.pageProperties).length > 0) {
    //             const { pageId } = this.pageProperties;
    //             if (pageId) {
    //                 try {
    //                     sensors.track(
    //                         'pageUnload',
    //                         {
    //                             ...this.baseProperties,
    //                             ...this.pageProperties,
    //                             url: window.location.href,
    //                             appId: this.appId,
    //                             title: document.title,
    //                             timestamp: Date.now(),
    //                             $event_session_id: this.eventSessionId,
    //                         },
    //                         {
    //                             sendImmediately: true, // 立即发送
    //                             useBeacon: false, // 避免 beacon 在卸载时失效
    //                         }
    //                     );
    //                 } catch (error) {
    //                     console.error('页面卸载时发送事件失败：', error);
    //                 }
    //             }
    //         }
    //     });
    // }
}

// 初始化页面卸载处理器（全局只初始化一次）
// Track.initUnloadHandler();

export default Track;
