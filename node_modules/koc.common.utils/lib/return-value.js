module.exports.New = function () {
    return new ReturnValue();
};

function ReturnValue() {
    this.hasError = false;
    this.errorCode = '';
    this.message = '';
    this.returnObject = null;
    this.mapData = null;

    this.PutValue = function (key, value) {
        if (this.mapData == undefined) {
            this.mapData = new Object();
            this.mapData[key] = value;
        }
    };

    this.GetValue = function (key) {
        return (key in this.mapData) ? this.mapData[key] : null;
    };

    this.Reset = function () {
        this.hasError = false;
        this.errorCode = '';
        this.message = '';
        this.returnObject = null;
        this.mapData = null;
    };
}