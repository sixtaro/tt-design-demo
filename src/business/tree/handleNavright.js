import { Storage } from '@/utils';

export default function handleNavright(childrens, parent, level = 0, appID) {
    if (parent) {
        parent.options = [];
    }
    childrens &&
        childrens.forEach(item => {
            if (!parent) {
                parent = { parents: [], options: [] };
            }
            // arr[3]: 1-云平台页面显示机构树 2-新打开页面 3-车场页面显示机构树 4-门禁页面显示机构树 5-门禁页面不显示机构树 6-云控制台页面 7-私有云页面 8-启动程序
            // arr[3]: 101-充电站，可选企业 102-充电站，只可选择充电站   临时加的，后续使用新版参数配置
            let arr = item.param.split(';');
            item.path = arr[4];
            item.url = arr[1];
            item.icon = arr[2];
            if (arr[3]?.indexOf(',') > -1) {
                const config = arr[3].split(',');
                // config结构可查看文档地址https://tttc.yuque.com/ttfe/gx9vua/ymk0m279g4yv1gar
                item.showTree = config[0] === '1';
                item.newPage = config[1] === '1';
                item.isCommplatform = config[2] === '1';
                item.isManager = config[3] === '1';
                item.isCloudPage = config[4] === '1';
                item.isApp = config[5] === '1';
                item.depStatus = config[6]; // 部门节点的显示选择状态 0 不显示  1显示：可选择 2显示：不可选择  0用不上，不做此功能
                item.allowPark = config[7] === '1';
                item.allowCharge = config[8] === '1';
                item.allowWash = config[9] === '1';
                item.allowCommplatform = config[10] === '1';
                item.allowEBike = config[11] === '1';
                item.isClosedPark = config[12] === '1'; // 只显示封闭车场
                item.isRoadsidePark = config[12] === '2'; // 只显示路侧车场

                item.isPark = item.depStatus === '2' && !!item.allowPark;
            } else {
                item.showTree = arr[3] === '1' || arr[3] === '3' || arr[3] === '4' || arr[3] === '101' || arr[3] === '102';
                item.newPage = arr[3] === '2';
                item.isPark = arr[3] === '3';
                item.isChargeStation = arr[3] === '101' || arr[3] === '102';
                item.isCommplatform = arr[3] === '4' || arr[3] === '5';
                item.isManager = arr[3] === '6';
                item.isCloudPage = arr[3] === '7';
                item.isApp = arr[3] === '8';
            }
            item.parents = [...parent.parents, item.rightID];
            item.level = level;
            item.isOldPage = !item.path && item.url;
            item.isNullPage = !item.path && !item.url;
            item.isLayoutPage = item.path === 'PageLayout';
            // 页面附加参数
            item.pageParam = item.cloudRightName = arr[5];
            // 页面验证级别（默认不验证，2为短信验证）,3-云运营主体页面，需要验证是否具有云运营主体身份
            item.verify = arr[6];
            const user = Storage.get('user');
            if (appID) {
                item.pageGroup = `${user?.userGroupID || ''}-${appID}`;
            }
            if (item.funcFlag === 1) {
                if (!parent.options) {
                    parent.options = [];
                }
                parent.options?.push(item.rightName);
                return;
            }
            if (item.level === 0) {
                item.className = '';
            }
            if (item.children && item.children.length) {
                if (item.level === 0 && item.children.some(el => el.funcFlag === 0)) {
                    item.className = 'dropdown-two';
                } else if (item.level === 1 && item.children.some(el => el.funcFlag === 0)) {
                    parent.className = 'dropdown';
                }
                handleNavright(item.children, item, level + 1, appID);
            }
        });
}
