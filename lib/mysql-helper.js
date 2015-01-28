var mysql = require('mysql'),
    async = require('async');

var ReturnValue = require('./return-value');

var poolCluster = null;

var Mysql_Helper = module.exports = {
    /////////////////////////////////
    //初始化
    /////////////////////////////////
    Init: function (dblist) {
        if (poolCluster != undefined) {
            return Mysql_Helper;
        }
        poolCluster = mysql.createPoolCluster();
        for (var i = 0; i < dblist.length; i++) {
            poolCluster.add(dblist[i].name, dblist[i]);
        }
        return Mysql_Helper;
    },
    Conn: function (group, callback) {
        poolCluster.getConnection(group, function (err, conn) {
            var retValue = ReturnValue.New();
            if (err) {
                //记录日志
                console.log('连接DB出错[' + group + ']');
                console.log(err.message);
                retValue.hasError = true;
                retValue.errorCode = 'Conn Error';
                callback(retValue);
                return;
            }
            retValue.returnObject = conn;
            callback(retValue);
        });
    },
    /////////////////////////////////
    //查询列表
    /////////////////////////////////
    ExecuteTable: function (db, sql, parm, callback) {
        Mysql_Helper.Conn(db, function (retValue) {
            if (retValue.hasError) {
                callback(retValue);
                return;
            }
            var conn = retValue.returnObject;
            conn.query(sql, parm, function (err, rows) {
                retValue.Reset();
                if (err) {
                    //记录日志
                    console.log('查询出错[' + sql + '] 错误信息[' + err + ']');
                    console.log(err.message);
                    retValue.hasError = true;
                    callback(retValue);
                    return;
                }
                if (!(rows instanceof Array)) {
                    retValue.hasError = true;
                    callback(retValue);
                    return;
                }
                retValue.returnObject = rows;
                callback(retValue);
            });
            conn.release();
        });
    },
    /////////////////////////////////
    //查询行
    /////////////////////////////////
    ExecuteRow: function (db, sql, parm, callback) {
        Mysql_Helper.ExecuteTable(db, sql, parm, function (retValue) {
            if (!retValue.hasError) {
                if (retValue.returnObject.length <= 0) {
                    retValue.returnObject = null;
                } else {
                    retValue.returnObject = retValue.returnObject[0];
                }
            }
            callback(retValue);
        });
    },
    /////////////////////////////////
    //执行，返回受影响的行
    /////////////////////////////////
    ExecuteNonQuery: function (dbconn, sql, parm, callback) {
        var conn, tran = false;
        async.series([function (callback) {
            if ((typeof dbconn != 'string') || (dbconn.constructor != String)) {
                tran = true;
                conn = dbconn;
                callback(null);
                return;
            }
            Mysql_Helper.Conn(dbconn, function (retValue) {
                if (retValue.hasError) {
                    callback(retValue);
                    return;
                }
                conn = retValue.returnObject;
                callback(null);
            });
        }], function (err) {
            if (err) {
                callback(err);
                return;
            }
            conn.query(sql, parm, function (err, rows) {
                var retValue = ReturnValue.New();
                if (err) {
                    //记录日志
                    console.log('查询出错[' + sql + ']');
                    console.log(err.message);
                    retValue.hasError = true;
                    callback(retValue);
                    return;
                }
                if (rows instanceof Array) {
                    retValue.hasError = true;
                    callback(retValue);
                    return;
                }
                retValue.returnObject = rows.affectedRows;
                retValue.PutValue("insertId", rows.insertId);
                callback(retValue);
            });
            if (!tran) {
                conn.release();
            }
        });
    },
    /////////////////////////////////
    //分页
    /////////////////////////////////
    Page: function (db, parm, callback) {
        Mysql_Helper.PageList(db, parm, function (retValue) {
            if (!parm.GetPageInfo || retValue.hasError) {
                callback(retValue);
                return;
            }
            Mysql_Helper.PageInfo(db, parm, function (retValue_PageInfo) {
                retValue.PutValue("PageInfo", retValue_PageInfo.returnObject);
                callback(retValue);
            });
        });
    },
    /////////////////////////////////
    //分页，列表
    /////////////////////////////////
    PageList: function (db, parm, callback) {
        var sql = "SELECT " + parm.ColumnList
            + " FROM " + parm.TableList
            + ((parm.Condition && parm.Condition != "") ? (" WHERE " + parm.Condition) : "")
            + ((parm.OrderName != undefined && parm.OrderName != "") ? (" ORDER BY " + Mysql_Helper.ToDBStr(parm.OrderName)) : "")
            + " LIMIT " + parm.Start + ", " + parm.Length;
        Mysql_Helper.ExecuteTable(db, sql, null, callback);
    },
    /////////////////////////////////
    //分页，页数据
    /////////////////////////////////
    PageInfo: function (db, parm, callback) {
        var sql = "SELECT COUNT(" + Mysql_Helper.ToDBStr(parm.ColumnPK) + ") AS `RecordCount`, MAX(" + Mysql_Helper.ToDBStr(parm.ColumnMAX) + ") AS `MaxCode` FROM " + parm.TableList
            + ((parm.Condition && parm.Condition != "") ? (" WHERE " + parm.Condition) : "");
        Mysql_Helper.ExecuteRow(db, sql, null, function (retValue) {
            if (retValue.hasError) {
                retValue.hasError = false;
                retValue.returnObject = {
                    RecordCount: 0,
                    MaxCode: ""
                };
            }
            callback(retValue);
        });
    },
    /////////////////////////////////
    //分页，参数
    /////////////////////////////////
    PageParm: function () {
        this.GetPageInfo = true;
        this.ColumnPK = "";
        this.ColumnMAX = "";
        this.ColumnList = "";
        this.TableList = "";
        this.Condition = "";
        this.OrderName = "";
        this.Start = 1;
        this.Length = 0;
    },
    /////////////////////////////////
    //添加条件
    /////////////////////////////////
    AddToWhereSQL: function (whereSQL, addSQL, opSQL) {
        if (whereSQL.trim().length <= 0) {
            whereSQL = " (" + addSQL + ") ";
        } else {
            whereSQL += " " + opSQL + " (" + addSQL + ") ";
        }
        return whereSQL.trim();
    },
    /////////////////////////////////
    //ToDBStr
    /////////////////////////////////
    ToDBStr: function ToDBStr(str) {
        return (str ? str : "").toString().replace("'", "''");
    },
    /////////////////////////////////
    //事务开启
    /////////////////////////////////
    TranOpen: function (db, callback) {
        Mysql_Helper.Conn(db, function (retValue) {
            if (retValue.hasError) {
                callback(retValue);
                return;
            }
            retValue.returnObject.beginTransaction(function (err) {
                if (err) {
                    retValue.Reset();
                    retValue.hasError = true;
                    retValue.message = err.message;
                    callback(retValue);
                    return;
                }
                callback(retValue);
            });
        });
    },
    /////////////////////////////////
    //事务回滚
    /////////////////////////////////
    TranRollback: function (conn, callback) {
        if (!conn) {
            callback();
            return;
        }
        conn.rollback(function () {
            conn.release();
            callback();
        });
    },
    /////////////////////////////////
    //事务提交
    /////////////////////////////////
    TranCommit: function (conn, callback) {
        var retValue = ReturnValue.New();
        if (!conn) {
            retValue.hasError = true;
            retValue.message = "空连接不能提交事务";
            callback(retValue);
            return;
        }
        conn.commit(function (err) {
            if (err) {
                retValue.hasError = true;
                retValue.message = err.message;
                Mysql_Helper.TranRollback(conn, function () {
                    callback(retValue);
                });
                return;
            }
            conn.release();
            callback(retValue);
        });
    }

};