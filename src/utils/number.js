Number.toFix = (number, length = 2) => {
    var int = parseFloat(number);
    if (int.toString().indexOf('.') > 0) {
        return parseFloat(int.toFixed(length));
    }
    return int;
};
Number.fixedZero = (val, length) => {
    if (isNaN(val)) {
        return val;
    }
    val = val.toString();
    while (val.length < length) {
        val = '0' + val;
    }
    return val;
};
