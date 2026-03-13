String.Resovle = (context, startString, stopString, isTurn, subIndex = 0) => {
    let res = null;
    let start = startString.split('*');
    let stop = stopString.split('*');
    try {
        if (!isTurn) {
            for (let i = 0; i < start.length; i++) {
                let s1 = GetGoodString(context, start[i], isTurn);
                let indexOf = context.indexOf(s1);
                if (indexOf > -1) {
                    context = context.substring(indexOf + s1.length);
                } else {
                    return false;
                }
            }
            let s2 = GetGoodString(context, stop[0], isTurn);
            res = context.substring(subIndex, context.indexOf(s2) - subIndex);
            return res;
        } else {
            for (let i = stop.length - 1; i >= 0; i--) {
                let s1 = GetGoodString(context, stop[i], isTurn);
                let indexOf = context.lastIndexOf(s1);
                if (indexOf > -1) {
                    context = context.substring(0, indexOf);
                } else {
                    return false;
                }
            }
            let s2 = GetGoodString(context, start[start.length - 1], isTurn);
            res = context.substring(context.lastIndexOf(s2) + s2.length + subIndex);
            return res;
        }
    } catch (Exception) {
        return false;
    }
};

String.Resovles = (context, startString, stopString, isTurn, subIndex = 0) => {
    let list = [];
    let start = startString.split('*');
    let stop = stopString.split('*');
    try {
        if (!isTurn) {
            while (context.indexOf(start[0]) > -1) {
                for (let i = 0; i < start.length; i++) {
                    let s1 = GetGoodString(context, start[i], isTurn);
                    let indexOf = context.indexOf(s1);
                    if (indexOf > -1) {
                        context = context.substring(indexOf + s1.length);
                    } else {
                        return list;
                    }
                }
                let s2 = GetGoodString(context, stop[0], isTurn);
                if (context.indexOf(s2) > -1) {
                    list.push(context.substring(subIndex, context.indexOf(s2) - subIndex));
                } else {
                    return list;
                }
            }
        } else {
            while (context.indexOf(stop[0]) > -1) {
                for (let i = stop.length - 1; i >= 0; i--) {
                    let s1 = GetGoodString(context, stop[i], isTurn);
                    let indexOf = context.lastIndexOf(s1);
                    if (indexOf > -1) {
                        context = context.substring(0, indexOf);
                    } else {
                        return list;
                    }
                }
                let s2 = GetGoodString(context, start[start.length - 1], isTurn);
                list.push(context.substring(context.lastIndexOf(s2 + s2.length + subIndex)));
            }
        }
        return list;
    } catch (Exception) {
        return list;
    }
};
String.test = (string, key) => {
    const keys = key.split('*');
    if (string.indexOf(keys[0]) !== 0) {
        return false;
    }
    if (!string.endsWith(keys[keys.length - 1])) {
        return false;
    }
    return String.Resovle(string, key, '') === false ? false : true;
};
String.testSome = (string, keys) => {
    for (const key of keys) {
        if (String.test(string, key)) {
            return true;
        }
    }
    return false;
};
String.testEvery = (string, keys) => {
    for (const key of keys) {
        if (!String.test(string, key)) {
            return false;
        }
    }
    return true;
};

function GetGoodString(context, substring, turn) {
    if (!context) {
        return substring;
    }
    let arr = substring.split('|');
    let index = turn ? -1 : context.length;
    let ret = substring;
    for (let i in arr) {
        let str = arr[i];
        if (!str) {
            continue;
        }
        if (!turn) {
            let temp = context.indexOf(str);
            if (temp > -1 && temp < index) {
                index = temp;
                ret = str;
            }
        } else {
            let temp = context.lastIndexOf(str);
            if (temp > -1 && temp > index) {
                index = temp;
                ret = str;
            }
        }
    }
    return ret;
}
String.replaceAll = (string, oldValue, newValue) => {
    if (typeof string === 'string') {
        return string.split(oldValue).join(newValue);
    }
    return string;
};
String.replaceAlls = function (string, oldValues, newValues) {
    for (let i = 0; i < oldValues.length; i++) {
        string = String.replaceAll(string, oldValues[i], newValues[i]);
    }
    return string;
};

String.toString = obj => {
    if (obj instanceof Array || obj instanceof RegExp) {
        return obj.toString();
    }
    if (typeof obj === 'object') {
        return JSON.stringify(obj);
    }
    return obj;
};

String.toNodeArray = string => {
    // 字符串预处理
    // const arrTag = String.Resovles(string, '<', ' |>');
    // const errTagArr = [];
    // for (let i = 0;i < arrTag.length; i += 2) {
    //     if ('/' + arrTag[i] !== arrTag[i + 1]) {
    //         errTagArr.push(arrTag[i]);
    //         i --;
    //     }
    // }
    // for (let errTag of errTagArr) {
    //     const index = string.indexOf('/>', string.indexOf('<' + errTag));
    //     string = String.insertStr(string, index, `></${errTag}>`, 2);
    // }
    if (!string) {
        return string;
    }

    const nodeList = [];
    const root = document.createElement('root');
    root.innerHTML = string;
    Array.loopItem(
        root.childNodes,
        (item, index, { parent }) => {
            const node = {
                node: item.nodeName,
                value: item.nodeValue,
                props: {},
            };
            if (item.attributes) {
                for (const attr of item.attributes) {
                    node.props[attr.name] = attr.value;
                    if (
                        typeof attr.value === 'string' &&
                        attr.value[0] === '{' &&
                        attr.value[attr.value.length - 1] === '}'
                    ) {
                        node.props[attr.name] = eval(`(${attr.value.replace('{{', '{').replace('}}', '}')})`);
                    }
                }
            }
            if (parent) {
                if (!parent._temp.children) {
                    parent._temp.children = [];
                }
                parent._temp.children.push(node);
            } else {
                nodeList.push(node);
            }
            item._temp = node;
        },
        'childNodes'
    );
    return nodeList;
};

String.insertStr = (source, start, newStr, del = 0) => {
    return source.slice(0, start) + newStr + source.slice(start + del);
};
