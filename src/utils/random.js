/* eslint-disable no-unused-vars */

const isNumber = (value) => typeof value === 'number' && !isNaN(value);

const isInt = (value) => typeof value === 'number' && !isNaN(value) && Math.ceil(value) === value;

const isFloat = (value) => typeof value === 'number' && !isNaN(value) && Math.ceil(value) > value;

/**
 * randint(start?, end?)
 *      功能：生成随机整数
 * @start:
 *      非必传, 随机整数的起始值，负值强制转换成0，默认为0，可取到
 * @end:
 *      非必传, 随机整数的结束值，负值强制转换成100，默认为100, 取不到
 *
 * 返回值：
 *      数组，如：23
 */
function randint(start = 0, end = 100) {
    return Math.floor(Math.random() * (end - start)) + start;
}

/**
 * randperm(start, end, num)
 *      功能，生成系列随机整数
 * @start:
 *      必传, 随机整数的起始值，可取到
 * @end:
 *      必传, 随机整数的结束值，取不到
 * @num:
 *      必传，需要生成的随机整数的数量，正整数
 *
 * 返回值：
 *      数组，如：[ 23, 56 ]
 */
function randperm(start, end, num) {
    if (!isInt(start) || !isInt(end) || !isInt(num) || start < 0 || start >= end || num < 0) {
        throw Error('randperm 参数有误!');
    }
    if (num === 0) {
        return [];
    }
    if (end - start < num) {
        num = end - start;
        console.warn('randperm 所需要生成的数量无法满足，已尽量为您生成更多数量的值');
    }
    // 判断是否返回稀疏数组
    const isAsc = (end - start) / num > 2;
    let result = [];
    if (isAsc) {
        while (result.length < num) {
            const int = randint(start, end);
            result.indexOf(int) < 0 && result.push(int);
        }
    } else {
        let fullArr = Array.from({ length: end })
            .map((_, index) => index)
            .slice(start);
        while (fullArr.length > num) {
            const int = randint(start, end);
            fullArr = fullArr?.filter((item) => item !== int);
        }
        result = fullArr;
    }
    result.sort((a, b) => a - b);
    return result;
}

export { isNumber, isInt, isFloat, randint, randperm };
