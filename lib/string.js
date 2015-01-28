var crypto = require('crypto');

exports.isEmailFormat = isEmailFormat;          // 判断是否为Email格式
exports.getStringLength = getStringLength;        // 获取字符串长度，一个中文=2个字符
exports.formatCurrency = formatCurrency;          // 转换成金额格式
exports.GenerateRandomAlphaNum = GenerateRandomAlphaNum;          // 生成随机字母、数字字符串 参数：长度

exports.ToInt = ToInt;
exports.ToFloat = ToFloat;
exports.ToBoolean = ToBoolean;
exports.ToString = ToString;
exports.ToJSONStr = ToJSONStr;

exports.GetClientIP = GetClientIP;

exports.MD5 = MD5;
exports.SHA1 = SHA1;

function isEmailFormat(mail) {
    var patrn = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!patrn.test(mail))
        return false;
    else
        return true;
}

function getStringLength(str) {
    str = ToString(str);
    var cArr = str.match(/[^\x00-\xff]/ig);
    return str.length + (cArr == null ? 0 : cArr.length);
}

// precision：精度，即保留小数位数，最后一位四舍五入
function formatCurrency(amt, precision) {
    if (isNaN(parseFloat(amt))) {
        return 0;
    } else {
        return parseFloat(amt).toFixed(precision);
    }
}

function ToInt(value, defaultvalue) {
    defaultvalue = isNaN(parseInt(defaultvalue)) ? 0 : parseInt(defaultvalue);
    value = parseInt(value);
    if (isNaN(value)) {
        value = defaultvalue;
    }
    return value;
}

function ToFloat(value, defaultvalue) {
    defaultvalue = isNaN(parseFloat(defaultvalue)) ? 0 : parseFloat(defaultvalue);
    value = parseFloat(value);
    if (isNaN(value)) {
        value = defaultvalue;
    }
    return value;
}

function ToBoolean(value, defaultvalue) {
    switch (ToString(value).toLowerCase()) {
        case "true":
            return true;
        default:
            return defaultvalue ? true : false;
    }
}

function ToString(value) {
    return value ? value.toString() : "";
}

function ToJSONStr(value) {
    return ToString(value).replace("\"", "'").replace("\\", "|").replace("\r\n", "").replace("\n", "").replace("\r", "");
}

function GetClientIP(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

function MD5(value) {
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(value);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5").update(str).digest("hex").toLowerCase();

    /* 为了解决中文不一致，使用上面的代码
     var md5 = crypto.createHash('md5');
     md5.update(value);
     return md5.digest('hex').toLowerCase();
     */
}

function SHA1(value) {
    var shasum = crypto.createHash('sha1');
    shasum.update(value);
    return shasum.digest('hex').toLowerCase();
}

function GenerateRandomAlphaNum(len) {
    var  rdmString = "";
    for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
    return  rdmString.substr(0, len);
}