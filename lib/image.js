var ReturnValue = require('./return-value');
var imageMagick = require('gm').subClass({imageMagick: true});

exports.Ratio = Ratio;
exports.Resize = Resize;

function Ratio(Path, callback) {
    imageMagick(Path).size(function (err, value) {
        var retValue = ReturnValue.New();
        if (err) {
            retValue.hasError = true;
            retValue.message = err.message;
            retValue.returnObject = err;
            callback(retValue);
            return;
        }
        retValue.returnObject = value.width / value.height;
        callback(retValue);
    });
}

function Resize(mode, source, target, width, height, callback) {
    var retValue = ReturnValue.New();
    var _image = imageMagick(source);
    if (!_image) {
        retValue.hasError = true;
        retValue.message = "没有找到图片文件";
        callback(retValue);
        return;
    }
    height = (height && height > 0) ? height : null;
    _image.size(function (err, value) {
        if (err) {
            retValue.hasError = true;
            retValue.message = err.message;
            callback(retValue);
            return;
        }
        var x = 0, y = 0, ow = value.width, oh = value.height, tw = width, th = height;
        var Ratio = {
            Original: value.width / value.height,
            This: -1
        };
        switch (mode) {
            case "W"://固定宽
            case "H"://固定高
            case "W_H"://最大宽,最大高(比例)
                _image.resize(tw, th);
                Ratio.This = tw / th;
                break;
            default://固定宽,固定高
                _image.resize(tw, th, "!");
                Ratio.This = tw / th;
                break;
            case "Cut_Middle"://裁剪(中)(按比例放大or缩小)
                if (!width || !height) {
                    _image.resize(tw, th);
                    Ratio.This = tw / th;
                    break;
                }
                th = oh * tw / ow;
                if (height > th) {
                    tw = tw * height / th;
                    th = height;
                }
                _image = _image.resize(tw, th).crop(width, height, (tw - width) / 2, (th - height) / 2);
                Ratio.This = width / height;
                break;
            case "Cut_Top"://裁剪(顶)(按比例放大or缩小)
                if (!width || !height) {
                    _image.resize(tw, th);
                    Ratio.This = tw / th;
                    break;
                }
                th = oh * tw / ow;
                if (height > th) {
                    tw = tw * height / th;
                    th = height;
                }
                _image = _image.resize(tw, th).crop(width, height, (tw - width) / 2, 0);
                Ratio.This = width / height;
                break;
            case "Cut_Bottom"://裁剪(顶)(按比例放大or缩小)
                if (!width || !height) {
                    _image.resize(tw, th);
                    Ratio.This = tw / th;
                    break;
                }
                th = oh * tw / ow;
                if (height > th) {
                    tw = tw * height / th;
                    th = height;
                }
                _image = _image.resize(tw, th).crop(width, height, (tw - width) / 2, th - height);
                Ratio.This = width / height;
                break;
            case "W_HMaxCut"://固定宽，最大高裁剪(顶)
                if (!height) {
                    _image.resize(tw, th);
                    Ratio.This = tw / th;
                    break;
                }
                th = oh * width / ow;
                _image = _image.resize(tw, th);
                Ratio.This = tw / th;
                if (th > height) {
                    _image = _image.crop(tw, height, x, y);
                    Ratio.This = tw / height;
                }
                break;
            case "W_HMaxCut_Middle"://固定宽，最大高裁剪(中)
                if (!height) {
                    _image.resize(tw, th);
                    Ratio.This = tw / th;
                    break;
                }
                th = oh * width / ow;
                _image = _image.resize(tw, th);
                Ratio.This = tw / th;
                if (th > height) {
                    y = (th - height) / 2;
                    _image = _image.crop(tw, height, x, y);
                    Ratio.This = tw / height;
                }
                break;
            case "H_WMaxCut"://固定高，最大宽裁剪(顶)
                if (!width) {
                    _image.resize(tw, th);
                    Ratio.This = tw / th;
                    break;
                }
                tw = ow * height / oh;
                _image = _image.resize(tw, th);
                Ratio.This = tw / th;
                if (tw > width) {
                    _image = _image.crop(width, th, x, y);
                    Ratio.This = width / th;
                }
                break;
            case "H_WMaxCut_Middle"://固定高，最大宽裁剪(顶)
                if (!width) {
                    _image.resize(tw, th);
                    Ratio.This = tw / th;
                    break;
                }
                tw = ow * height / oh;
                _image = _image.resize(tw, th);
                Ratio.This = tw / th;
                if (tw > width) {
                    x = (tw - width) / 2;
                    _image = _image.crop(width, th, x, y);
                    Ratio.This = width / th;
                }
                break;
        }
        _image.write(target, function (err) {
            if (err) {
                retValue.hasError = true;
                retValue.message = err.message;
                callback(retValue);
                return;
            }
            retValue.returnObject = Ratio;
            callback(retValue);
        });
    });
}