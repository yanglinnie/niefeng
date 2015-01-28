/**
 * Created by Administrator on 2014/10/21.
 */
var fs = require('fs');
var fse = require('fs-extra');
var async = require('async');
var moment = require("moment");

exports.directoryExists = directoryExists;      // 文件夹是否存在，如果不存在，就创建一个【异步】
exports.fileExist = fileExist;                    // 文件是否存在，如果不存在，就创建一个【异步】

exports.writeFile = writeFile;                    // 写文件，如果不存在，就创建一个【异步】
exports.deleteFileOrDirection = deleteFileOrDirection;                  // 删除文件及文件夹
exports.moveFile = moveFile;                        // 移动文件
exports.copyFile = copyFile;                        // 拷贝文件

function writeFile(filename, content,callback){
    async.waterfall([
        function(cb){
            fileExist(filename, cb);
        },
        function(fileExist, cb1) {
            if(!fileExist) {
                // 判断文件夹是否存在，不存在则创建
                var folderPath = (filename.lastIndexOf("/") > 0 ? filename.substring(0, filename.lastIndexOf("/")) : "");
                directoryExists(folderPath, cb1);
            } else {
                cb1(null, true);
            }
        },
        function(folderExist) {
            if(folderExist){
                var _t = moment().format('YYYY-MM-DD HH:mm:ss').toString();
                fs.appendFile(filename, "------------------" + _t + "--------------\r\n" +  content + "\r\n\r\n", function(err){
                    callback(err ? false : true);
                });
            } else {
                callback(false);
            }
        }
    ], function(result) {

    });
}

function fileExist(filename, callback){
    fs.exists(filename, function (exists){
        callback(null, exists);
    });
}

function directoryExists(path, callback){
    fse.mkdirs(path,function(err) {
        callback(null, err ? false : true);
    });
}

function deleteFileOrDirection(path, callback){
    fse.remove(path,function(err) {
        callback(err ? false : true);
    });
}

function moveFile(src, dest, callback){
    fse.move(src,dest ,function(err) {
        callback(err ? false : true);
    });
}

function copyFile(src, dest, callback){
    fse.copy(src,dest ,function(err) {
        callback(err ? false : true);
    });
}