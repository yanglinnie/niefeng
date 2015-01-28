/**
 * Created by Administrator on 2014/10/21.
 */
exports.getThisMonthFirstDay=getThisMonthFirstDay;      // 取得本月第一天
exports.getThisMonthLastDay=getThisMonthLastDay;        // 取得本月最后一天
exports.getPreviousMonthFirstDay=getPreviousMonthFirstDay;      // 取得上月第一天
exports.getPreviousMonthLastDay=getPreviousMonthLastDay;        // 取得上月最后一天
exports.getThisYearFirstDay=getThisYearFirstDay;        // 取得本年第一天
exports.getThisYearLastDay=getThisYearLastDay;          // 取得本年最后一天
exports.getPreviousYearFirstDay=getPreviousYearFirstDay;      // 取得上年第一天
exports.getPreviousYearLastDay=getPreviousYearLastDay;        // 取得上年最后一天
exports.getAddDateString=getAddDateString;              // 取得间隔天数的字符串
exports.getMonthDays=getMonthDays;                      // 获取时间所在月的天数
exports.getTimeStamp=getTimeStamp;                          // 时间戳，距 1970 年 1 月 1 日之间的毫秒数
exports.timeStampToDate=timeStampToDate;                // 时间戳转换为日期

function getThisMonthFirstDay(){
    var date = new Date();
    date.setDate(1);
    return getDateString(date);
}

function getThisMonthLastDay(){
    var date = new Date();
    var dateNew = new Date(date.getFullYear(), date.getMonth() + 1,0);
    dateNew.setDate(dateNew.getDate());
    return getDateString(dateNew);
}

function getPreviousMonthFirstDay(){
    var date = new Date();
    var dateNew = new Date(date.getFullYear(), date.getMonth(),0);
    dateNew.setDate(1);
    return getDateString(dateNew);
}

function getPreviousMonthLastDay(){
    var date = new Date();
    var dateNew = new Date(date.getFullYear(), date.getMonth(),0);
    dateNew.setDate(dateNew.getDate());
    return getDateString(dateNew);
}

function getThisYearFirstDay(){
    return new Date().getFullYear() + '-01-01';
}

function getThisYearLastDay(){
    return new Date().getFullYear() + '-12-31';
}

function getPreviousYearFirstDay(){
    return (new Date().getFullYear() - 1) + '-01-01';
}

function getPreviousYearLastDay(){
    return (new Date().getFullYear() - 1) + '-12-31';
}

// addDays: 间隔天数 可为负数
function getAddDateString(addDays){
    var date = new Date();
    date.setDate(date.getDate() + addDays);
    return getDateString(date);
}

function getMonthDays(date){
    var dateNew = new Date(date.getFullYear(), date.getMonth() + 1,0);
    return dateNew.getDate();
}

function getTimeStamp(date){
    return date.getTime();
}

function timeStampToDate(stamp){
    var date = new Date(stamp);
    return getDateString(date);
}

function getDateString(date){
    var month = date.getMonth() + 1;
    if(month < 10){
        month = "0" + month;
    }

    var day =  date.getDate();
    if(day < 10){
        day = "0" + day;
    }
    return date.getFullYear() + '-' + month + '-' + day;
}

