exports.sort = sort;          // json按照key排序

////////////////////////////////////
// json按照key排序
////////////////////////////////////
function sort(object) {
    var sorted = {}, key;
    var keys = Object.keys(object);
    keys.sort();
    for (key = 0; key < keys.length; key++) {
        sorted[keys[key]] = object[keys[key]];
    }
    return sorted;
}