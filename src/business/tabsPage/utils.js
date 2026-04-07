const findProperty = (obj, propArray) => {
    return propArray.find(prop => obj.hasOwnProperty(prop));
};

export const getPageName = page => {
    let pageName = page?.data?.displayName || '';
    pageName = pageName.substring(0, pageName.indexOf('-') > -1 ? pageName.indexOf('-') : pageName.length);
    return pageName;
};

export const getPageID = page => {
    // page?.data?.pageParam 菜单 page?.data?.pageID 详情tab页
    return page?.data?.path === 'PageLayout' ? `${page?.data?.pageParam || page?.data?.pageID}(配置)` : page?.data?.path;
};

const codeTabKeys = ['activeTab', 'activeKey'];
export const getViewID = page => {
    // 代码页面key
    let codeViewID = '';
    const pageState = page?.ref?.state;
    if (pageState) {
        const key = findProperty(pageState, codeTabKeys);
        codeViewID = pageState[key];
    }

    // 获取配置页面tabs的key
    const configViewID = page?.ref?.pageRef?.current?.activeKey;

    const viewID = configViewID || codeViewID;
    const pageID = getPageID(page);
    if (viewID) {
        return `${pageID}_VIEW_${viewID}`;
    }
    return pageID;
};
export const getViewName = page => {
    // 代码页面标题 需要页面单独配置viewName数组或对象，根据tabKey对应
    let codeTabTitle = '';
    const pageState = page?.ref?.state;
    if (pageState) {
        const key = findProperty(pageState, codeTabKeys);
        const codeViewID = pageState[key];
        const viewNames = pageState['viewName'];
        if (viewNames && codeViewID !== undefined) {
            codeTabTitle = viewNames[codeViewID];
        }
    }

    // 获取配置页面tabs的标题
    const configTabTitle = page?.ref?.pageRef?.current?.currentTab?.title;

    const title = codeTabTitle || configTabTitle;
    const displayName = page?.data?.displayName || '';
    return title ? `${displayName}_${title}` : displayName;
};

export const getPageView = page => {
    return {
        pageID: getPageID(page),
        viewID: getViewID(page),
        viewName: getViewName(page),
        pageName: getPageName(page),
    };
};

// 所有tab页面
const TabsPages = [
    'MonthCardMana', // 会员卡
    'MonthRentCarTabs', // 月租车
    'TempBill', // 临停账单
    'AccountIncomeStat', // 收款账户收入统计
    'freeUserTab', // 免费车
    'BlackCarTabs', // 黑名单
    'SpecialUserTabs', // 特殊用户
    'UserMana', // 用户管理
    'UserFee', // 用户缴费
    'AnomalyAudit', // 异常稽核
    'AuditResults', // 稽核规则
    'ArrearageManager', // 欠费管理
    'ArrearageConfig', // 欠费配置
    'ScheduleRecord', // 出勤报表
    'NewEvaluation', // 人员评价
    'EvaluationRank', // 项目评价
    'EvaluationRule', // 评价规则
    'evaluationtabs', // 用户评价
    'VisitorTabs', // 访客管理
    'Wallet', // 个人钱包
    'CarSharingRecord', // 车位共享记录
    'ParkingSpaceBooking', // 车位预约管理
    'ParkSpaceOnlineRenTab', // 车位租赁管理
    'userinfobyopenid', // C端用户查询
    'VehiclesInTabs', // 在场车辆
    'ParkingOccupyTabs', // 车位占用率
    'ParkingTurnoverTabs', // 车位周转率
    'ParkingBehavior', // 停车行为分析
    'ParkConfig', // 车场配置
];
// 判断是否是tab页面
export const isTabPage = page => {
    return TabsPages.some(
        pageID =>
            page === pageID ||
            page?.data?.rightID === pageID ||
            page?.data?.rightName === pageID ||
            page?.key === pageID ||
            page?.data?.path === pageID ||
            page?.data?.pageID === pageID ||
            page?.data?.pageParam === pageID
    );
};
