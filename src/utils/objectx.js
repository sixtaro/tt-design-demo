import './string';

// identicalArr 数组内的内容不会深度复制
Object.clone = (obj, func = false, identicalArr = []) => {
    Object.clone.count ++;
    if (!obj || !(obj instanceof Object) || typeof obj == 'function') {
        if (typeof obj == 'function' && func) {
            return null;
        }
        return obj;
    }
    if (obj.$$typeof === Symbol.for('react.element')) {
        return obj;
    }
    var constructor = obj.constructor;
    var result = new constructor();
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === "object" && identicalArr.includes(obj[key])) {
                result[key] = obj[key];
            } else {
                identicalArr.push(obj[key])
                result[key] = Object.clone(obj[key], func, identicalArr);
            }
        }
    }
    return result;
};
Object.clone.count = 0;
Object.extend = function (target, object1) {
    Object.extend.count ++;
    if (object1 && typeof object1 === 'object') {
        for (let key in object1) {
            if (object1.hasOwnProperty(key)) {
                //判断ojb子元素是否为对象，如果是，递归复制
                if (
                    object1[key] &&
                    typeof object1[key] === 'object' &&
                    !(object1[key] instanceof Array) &&
                    !(object1[key] instanceof Function) &&
                    !(object1[key] instanceof RegExp)
                ) {
                    target[key] = Object.extend(
                        (target[key] instanceof Function ? {} : target[key]) ||
                            (object1[key] instanceof Array ? [] : {}),
                        object1[key]
                    );
                } else if (object1[key] instanceof Array) {
                    //如果不是，简单复制
                    target[key] = [...object1[key]];
                } else {
                    //如果不是，简单复制
                    target[key] = object1[key];
                }
            }
        }
    }
    for (var i = 2; i < arguments.length; i++) {
        Object.extend(target, arguments[i]);
    }
    return target;
};
Object.extend.count = 0;

const getValueX = (object, field) => {
    const repeat = [];
    let totalIndex = 0;
    const fields = field.split('.');
    const fs = fields.map((f, i) => fields.slice(0, i + 1).join('.'));
    const variable = [];
    let maxIndex = 10;
    if (fields.every(f => f !== '*')) {
        maxIndex = fields.length;
    }
    const getKeys = (subObjects, index = 1) => {
        if (index > maxIndex || totalIndex > 10000) {
            return undefined;
        }
        variable[index] = {};
        for (const subObjectKey in subObjects) {
            const subObject = subObjects[subObjectKey];
            for (const key in subObject) {
                totalIndex++;
                try {
                    const val = subObject[key];
                    if ((subObjectKey ? field.includes('.') : true) && String.test(subObjectKey + key, field)) {
                        return val;
                    }
                    if (
                        val instanceof Object &&
                        !repeat.includes(val) &&
                        String.testSome(subObjectKey + key, fs.slice(0, index))
                    ) {
                        repeat.push(val);
                        variable[index][subObjectKey + key + '.'] = val;
                    }
                } catch (ex) {
                    continue;
                }
            }
        }
        return Object.isEmpty(variable[index]) || index > maxIndex ? undefined : getKeys(variable[index], index + 1);
    };
    return getKeys({ '': object });
};

const getValue = (object, field) => {
    let fields = field.split('.');
    let result = { ...object };
    for (let key of fields) {
        if (result !== undefined && result !== null && result[key] !== undefined) {
            result = result[key];
        } else {
            return undefined;
        }
    }
    return result;
};

Object.getValue = (object, field, defaultValue) => {
    Object.getValue.count ++;
    if (!field) {
        return object;
    }
    if (!object || !Object.keys(object).length || !field) {
        return defaultValue;
    }
    if (String.replaceAlls) {
        field = String.replaceAlls(field, ['[', ']', '"', "'"], ['.', '', '', '']);
    }
    const fields = field.split('|');
    let result = defaultValue;
    for (const f of fields) {
        const res = ~f.indexOf('*') ? getValueX(object, f) : getValue(object, f);
        if (res !== undefined) {
            result = res;
            if (res !== null) {
                break;
            }
        }
    }
    return result === undefined || result === null ? defaultValue : result;
};
Object.getValue.count = 0;

Object.setValue = (object, field, value, force = true) => {
    Object.setValue.count ++;
    if (!field) {
        object = value;
        return object;
    }
    if (!object) {
        object = {};
    }
    let fields = field.split ? field.split('.') : field;
    let result = object;
    for (let i = 0; i < fields.length - 1; i++) {
        const key = fields[i];
        if (typeof result[key] === 'object') {
            result = result[key];
        } else {
            if (force) {
                result[key] = {};
                result = result[key];
            } else {
                break;
            }
        }
    }
    const lastField = fields.pop();
    const obj = Object.getValue(object, fields.join('.'));
    if (obj) {
        obj[lastField] = value;
    }
    return object;
};
Object.setValue.count = 0;
// 判断对象是否为空，except为除外的属性, except为数组，支持字符串与正则匹配
Object.isEmpty = (object, except = []) => {
    Object.isEmpty.count ++;
    if (!object) {
        return true;
    }
    for (let key in object) {
        if (except && except.some(ex => (typeof ex === 'string' ? ex === key : ex.test(key)))) {
            continue;
        }
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};
Object.isEmpty.count = 0;

Object.isNotEmpty = (object, except = []) => {
    return !Object.isEmpty(object, except);
}
Object.toStr = object => {
    return JSON.stringify(Object.clone(object));
};

Object.equal = (object1, object2) => {
    return Object.toStr(object1) === Object.toStr(object2);
};

Object.changeList = (object1, object2) => {
    if (!object1) {
        object1 = {};
    }
    if (!object2) {
        object2 = {};
    }
    const changes = [];
    for (const key in object1) {
        if (object1[key] !== object2[key]) {
            !changes.includes(key) && changes.push(key);
        }
    }
    for (const key in object2) {
        if (object1[key] !== object2[key]) {
            !changes.includes(key) && changes.push(key);
        }
    }
    return changes;
};

Object.renderText = (text, object, rewrite) => {
    Object.renderText.count ++;
    if (!text || Object.isEmpty(object)) {
        return text;
    }
    const fields = String.Resovles(text, '${', '}') || [];
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        let newField = field;
        if (rewrite) {
            for (const rewriteKey in rewrite) {
                newField = String.replaceAll(field, rewriteKey, rewrite[rewriteKey]);
            }
        }
        const result = Object.getValue(object, newField, '');
        if ('${' + field + '}' === text) {
            return result;
        }
        text = String.replaceAll(text, '${' + field + '}', String.toString(result));
    }
    return text;
};
Object.renderText.count = 0;
Object.renderRecord = (text, object, rewrite) => {
    Object.renderRecord.count ++;
    if (!text || Object.isEmpty(object)) {
        return text;
    }
    // eslint-disable-next-line no-unused-vars
    const props = object;let method = {};
    if (typeof props.method === "string") {
        // eval('method = ' + (props.method || '{}'));
        try {
            method = new Function('return ' + (props.method || '{}'))();
        } catch (e) {
            method = {};
        }
    }
    const expressions = String.Resovles(text, '[#', '#]') || [];
    if (expressions && expressions.length) {
        for (let i = 0; i < expressions.length; i++) {
            const expression = expressions[i];
            let exp = Object.renderText(expression, object, rewrite);
            try {
                exp = eval(exp);
                if ('[#' + expression + '#]' === text) {
                    return exp;
                }
                exp = exp === null || exp === undefined ? '' : String.toString(exp);
            } catch (ex) {
                console.log(exp, ex);
            }
            text = text.toString().replace('[#' + expression + '#]', exp);
        }
    }
    return Object.renderText(text, object, rewrite);
};
Object.renderRecord.count = 0;
Object.renderObject = (obj, object, rewrite) => {
    Object.renderObject.count ++;
    if (typeof obj === "string") {
        return Object.renderRecord(obj, object, rewrite);
    }
    for (const key in obj) {
        switch (typeof obj[key]) {
            case 'string':
                obj[key] = Object.renderRecord(obj[key], object, rewrite);
                break;
            case 'object':
                Object.renderObject(obj[key], object, rewrite);
                break;
        }
    }
    return obj;
};
Object.renderObject.count = 0;
Object.renderArray = (arr, obj, object) => {
    Object.renderArray.count ++;
    return arr?.map((s, index) => ({
        ...s,
        ...Object.renderObject(Object.clone(obj), { ...object, item: s, ...s }, { '[index]': `[${index}]` }),
    }));
};
Object.renderArray.count = 0;

Object.print = (obj, tag) => {
    console.log(tag, obj);
    return obj;
};
