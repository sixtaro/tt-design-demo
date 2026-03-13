export const ENUM_SYSTEMHOOK = {
    REFRESH_NAVRIGHT: Symbol(),
    REFRESH_ORGTREE: Symbol(),
    REFRESH_MESSAGE: Symbol(),
    REFRESH_USER: Symbol(),
    REFRESH_PAGE: Symbol(),
    GET_PAGE: Symbol(),
    CLOSE_PAGE: Symbol(),
    CHANGE_PAGE_TITLE: Symbol(),
};

// Selector组件的渲染顺序
export const ENUM_SELECTOR_RENDER_ORDER = {
    Before: 1,
    Content: 2,
    After: 3,
    Attach: 4,
    Finally: 5,
};
