/**
 * 百度地图接口
 */
var request = require('request');
var ReturnValue = require('./return-value');

exports.Geocoding = Geocoding;                        // 地理编码
exports.Geodecoding = Geodecoding;                        // 逆地理编码
exports.CalcDistance = CalcDistance;                     // 计算两个位置的距离

/**
 * 地理编码
 * @param address 地址
 * @param ak 密钥
 * @param callback
 * @constructor
 */
function Geocoding(address, ak, callback){
    var retValue = ReturnValue.New();
    var url = "http://api.map.baidu.com/geocoder/v2/" +
        "?address=" +  address +
        "&output=json" +
        "&ak=" + ak;
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            if(parseInt(result.status) == 0){
                retValue.hasError = false;
                retValue.returnObject = result.result.location;
            } else {
                retValue.hasError = true;
                retValue.errorCode = result.status;
                retValue.message = result.message;
            }
            callback(retValue);
        }
    });
}

/**
 * 逆地理编码
 * @param lng 经度
 * @param lat 纬度
 * @param ak 密钥
 * @param callback
 * @constructor
 */
function Geodecoding(lng, lat, ak, callback){
    var retValue = ReturnValue.New();
    var url = "http://api.map.baidu.com/geocoder/v2/" +
        "?location=" +  lat + "," + lng +
        "&output=json" +
        "&ak=" + ak;
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            if(parseInt(result.status) == 0){
                retValue.hasError = false;
                retValue.returnObject = result.result;
            } else {
                retValue.hasError = true;
                retValue.errorCode = result.status;
                retValue.message = result.message;
            }
            callback(retValue);
        }
    });
}

/**
 * 取得两个地理位置的距离
 * @param lng1 经度1
 * @param lat1 纬度1
 * @param lng2 经度2
 * @param lat2 纬度2
 */
function CalcDistance(lng1, lat1,lng2, lat2){
    var flat = CalcDegree(lat1) ;
    var flng = CalcDegree(lng1) ;
    var tlat = CalcDegree(lat2) ;
    var tlng = CalcDegree(lng2) ;
    var result = Math.sin(flat)*Math.sin(tlat) ;
    result += Math.cos(flat)*Math.cos(tlat)*Math.cos(flng-tlng) ;
    return Math.acos(result) * 6378137.0 ;
}
function CalcDegree(d){
    return d * Math.PI/180.0 ;
}