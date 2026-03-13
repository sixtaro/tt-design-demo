// 数组去重
Array.uniq = (arr, field) => {
    if (!arr || !arr.length) {
        return arr;
    }
    const newArr = [];
    arr.forEach(item => {
        if (!newArr.some(newItem => (field ? newItem[field] === item[field] : newItem === item))) {
            newArr.push(item);
        }
    });
    return newArr;
};

// 数组交集， 第一个参数可以是要比较的属性名
Array.intersect = function () {
    if (arguments.length < 2) {
        return arguments[0];
    }
    var list = arguments[0];
    var field = null;
    if (typeof arguments[0] == 'string') {
        field = arguments[0];
        list = arguments[1];
    }
    for (let i = field ? 2 : 1; i < arguments.length; i++) {
        list = list.filter(a => arguments[i].some(b => (field ? a[field] === b[field] : a === b)));
    }
    return list;
};

// 递归对象数组
// func: 递归方法，若返回一个值则停止递归，并返回此值
// field: 子对象中的数组值,默认值children
// level: 当前遍历深度，默认从0开始
// parent: 父节点， 默认为空
// indexs: 总遍历索引，数组形式，每层所在的index
// parents: 父节点们
Array.loopItem = (arr, func, field = 'children', level = 0, parent, indexs = [], parents = []) => {
    if (arr instanceof Array || arr instanceof NodeList) {
        for (let index = 0; index < arr.length; index++) {
            const item = arr[index];
            const _indexs = [...indexs, index];
            const _parents = [...parents];
            if (parent) {
                _parents.push(parent);
            }
            const res = func(item, index, { arr, level, parent, indexs: _indexs, parents: _parents });
            if (res) {
                return res;
            }
            if (item[field] instanceof Array || item[field] instanceof NodeList) {
                const result = Array.loopItem(item[field], func, field, level + 1, item, _indexs, _parents);
                if (result) {
                    return result;
                }
            }
        }
    }
};
// 对tree结构进行map操作，返回新的tree
// func: 返回新的Item
// field: 子对象中的数组值,默认值children
// level: 遍历深度，默认从0开始
// parent: 父节点， 默认为空
// indexs: 总遍历索引，数组形式，每层所在的index
// parents: 父节点们
Array.mapTree = (arr, func, field = 'children', level = 0, parent, indexs = [], parents = []) => {
    const newArr = [];
    if (arr instanceof Array || arr instanceof NodeList) {
        for (let index = 0; index < arr.length; index++) {
            const item = arr[index];
            const _indexs = [...indexs, index];
            const _parents = [...parents];
            if (parent) {
                _parents.push(parent);
            }
            const res = func(item, index, { arr, level, parent, indexs: _indexs, parents: _parents });
            newArr.push(res);
            if (item[field] instanceof Array || item[field] instanceof NodeList) {
                res[field] = Array.mapTree(item[field], func, field, level + 1, item, _indexs, _parents);
            }
        }
    }
    return newArr;
};

// 对tree结构进行过滤，返回新的tree
// func: 过滤函数，如果返回真,则不过滤，如果返回假，则过滤掉，同时子节点也过滤掉。
// field: 子对象中的数组值,默认值children
// level: 遍历深度，默认从0开始
// parent: 父节点， 默认为空
// indexs: 总遍历索引，数组形式，每层所在的index
// parents: 父节点们
Array.filterTree = (arr, func, field = 'children', level = 0, parent, indexs = [], parents = []) => {
    const newArr = [];
    if (arr instanceof Array || arr instanceof NodeList) {
        for (let index = 0; index < arr.length; index++) {
            const item = arr[index];
            const _indexs = [...indexs, index];
            const _parents = [...parents];
            if (parent) {
                _parents.push(parent);
            }
            const res = func(item, index, { arr, level, parent, indexs: _indexs, parents: _parents });
            if (res) {
                newArr.push(item);
                if (item[field] instanceof Array || item[field] instanceof NodeList) {
                    item[field] = Array.filterTree(item[field], func, field, level + 1, item, _indexs, _parents);
                }
            }
        }
    }
    return newArr;
};

// 对象数组中有children数组，转为一维数组
Array.flatten = (arr, childrenKey = 'children', isDeleteChildrenKey = false) => {
    if (Array.isArray(arr)) {
        return arr.reduce((acc, cur) => {
            if (Array.isArray(cur[childrenKey])) {
                const copyCur = { ...cur };
                isDeleteChildrenKey && delete copyCur[childrenKey];
                return acc.concat(copyCur, Array.flatten(cur[childrenKey]));
            } else {
                return acc.concat(cur);
            }
        }, []);
    } else {
        return arr;
    }
};

// 数组a（旧数据）和b（新数据）做对比, 返回a， b数组所独有的数据项组成的两个数组
// tag是做对比的标签，通过判断tag值的相同与否做筛选(tag可以是string或者array代表标签数组)
export const getUniqArr = (a, b, tag) => {
    const res = {
        remove: [],
        add: [],
    };
    // 如果其中之一不是数组
    if (!Array.isArray(a) || !Array.isArray(b)) {
        return res;
    }
    const aLen = a.length;
    const bLen = b.length;
    // 如果旧数据和新数据都是空
    if (!aLen && !bLen) {
        return res;
    }
    // 如果旧数据是空
    if (!aLen) {
        res.add = b;
        // 如果新数据是空
    } else if (!bLen) {
        res.remove = a;
    } else {
        // 需要删除的数据（旧数据包含，新数据不包含）
        res.remove = includesArr(a, b, tag);
        // 需要添加的数据（新数据包含，旧数据不包含）
        res.add = includesArr(b, a, tag);
    }
    return res;
};

// 返回a中独有的数据数组
function includesArr(a, b, tag) {
    const res = [];
    for (let i = 0; i < a.length; i++) {
        let flag = false;
        for (let j = 0; j < b.length; j++) {
            // 如果tag为空字符串或空数组，说明是比较原始数据类型
            if (!tag || (Array.isArray(tag) && !tag.length)) {
                if (a[i] === b[j]) {
                    flag = true;
                }
            } else if (typeof tag === 'string') {
                // tag是字符串，比较对象属性
                if (a[i][tag] === b[j][tag]) {
                    flag = true;
                }
            } else if (Array.isArray(tag)) {
                // tag是数组，比较对象多个属性
                let count = 0;
                tag.forEach(key => {
                    if (a[key] === b[key]) {
                        count++;
                    }
                });
                if (count === tag.length) {
                    flag = true;
                }
            }
        }
        if (!flag) {
            res.push(a[i]);
        }
    }
    return res;
}
