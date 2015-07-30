var mysql = require('mysql'),
    pool = require('./pool'),
    extend = require('../util').extend,
    EventEmitter = require('events').EventEmitter;

var dependencydao = (function(){

    function DependencyDao() {
        if (!(this instanceof DependencyDao))
            return new DependencyDao();
        EventEmitter.prototype.constructor.apply(this, arguments);
    };

    extend(DependencyDao, EventEmitter);

    DependencyDao.prototype.response = function(err, conn) {
        var self = this;
        if (err) {
            return function(sql, fn){
                console.log(err);
                conn && conn.release();
                self.emit('error', err);
                return;
            }
        } else {
            return function(sql, data, fn) {
                conn.query(sql, data, function(err, result) {
                    if (err) {
                        console.log(err);
                        conn && conn.release();
                        self.emit('error', err);
                        return;
                    }
                    conn && conn.release();
                    if (fn) {
                        fn(result);
                    } else {
                        self.emit('done', result);
                    }
                });
            };
        }
        return this;
    };

    DependencyDao.prototype.query = function(sql, data, fn, error) {
        var self = this;
        pool.getConnection(function(err, conn){
            if(err) {
                error();
                return;
            }
            self.response(err, conn)(sql, data, fn);
        });
        return this;
    };

    /**
     * @: 查询数据
     */
    DependencyDao.prototype.select = function (options, fn, err) {
        var sql = 'SELECT kg.id, kg.title, ks.img, kg.link, kg.currency, kg.price, kg.description, kg.favor, kg.linkid, ks.parity_cate FROM kp_links ks, kp_links_lang kg WHERE kg.linkid = ks.id AND kg.id=' + options.id;
        this.query(sql, [], fn, err);
    };

    /**
     * @: 查询数据 列表list
     */
    DependencyDao.prototype.selectList = function (options, fn, err) {
        var sql = 'SELECT kg.id, kg.title, ks.img, kg.link, kg.currency, kg.price, kg.description, kg.favor, kg.linkid, ks.parity_cate FROM kp_links ks, kp_links_lang kg WHERE ks.id=kg.linkid AND ';
        if(options.nation) {
            sql += ' kg.lang="' + options.nation + '" AND ';
        }
        if(options.parity_cate != 35 && options.parity_cate != 'favorites') {
            sql += ' ks.parity_cate="' + options.parity_cate + '" AND ';
        }
        if(options.ids) {
            sql += ' kg.id IN(' + options.ids + ') AND ';
        }
        sql += ' ks.is_effect = 1 ';
        if(options.parity_cate == 35) {
            var sqlstr = sql;
            sql = '(' + sql;
            sql += ' AND ks.parity_cate = 33 ORDER BY kg.favor DESC LIMIT 5) UNION (' + sqlstr;
            sql += ' AND ks.parity_cate = 34 ORDER BY kg.favor DESC LIMIT 5) UNION (' + sqlstr;
            sql += ' AND ks.parity_cate = 18 ORDER BY kg.favor DESC LIMIT 5) UNION (' + sqlstr;
            sql += ' AND ks.parity_cate = 20 ORDER BY kg.favor DESC LIMIT 5) UNION (' + sqlstr;
            sql += ' AND ks.parity_cate = 17 ORDER BY kg.favor DESC LIMIT 5) UNION (' + sqlstr;
            sql += ' AND ks.parity_cate = 16 ORDER BY kg.favor DESC LIMIT 5) UNION (' + sqlstr;
            sql += ' AND ks.parity_cate = 11 ORDER BY kg.favor DESC LIMIT 5) UNION (' + sqlstr;
            sql += ' AND ks.parity_cate = 19 ORDER BY kg.favor DESC LIMIT 5) UNION (' + sqlstr;
            sql += ' ORDER BY kg.favor DESC) ';
        }
        else {
            sql += ' ORDER BY kg.favor DESC ';
        }
        sql += ' limit ' + options.start + ',' + options.pagesize;
        this.query(sql, [], fn, err);
    };

    /**
     * @: 查询数据 列表list 同类产品
     */
    DependencyDao.prototype.selectListSame = function (options, fn, err) {
        var sql = 'SELECT kg.id, kg.title, ks.img, kg.link, kg.currency, kg.price, kg.description, kg.favor, kg.linkid, ks.parity_cate FROM kp_links ks, kp_links_lang kg WHERE ks.id=kg.linkid AND ';
        if(options.nation) {
            sql += ' kg.lang="' + options.nation + '" AND ';
        }
        if(options.parity_cate != 35 && options.parity_cate != 'favorites') {
            sql += ' ks.parity_cate="' + options.parity_cate + '" AND ';
        }
        if(options.sameid) {
            sql += ' kg.id <> "' + options.sameid + '" AND ';
        }
        sql += ' ks.is_effect = 1 ORDER BY kg.favor DESC limit ' + options.start + ',' + options.pagesize;
        this.query(sql, [], fn, err);
    };

    /**
     * @: 查询数据 nav
     */
    DependencyDao.prototype.selectNav = function (options, fn, err) {
        var sql = 'SELECT ka.cid, ka.' + options.nation + ' as language FROM kp_paritycate_lang ka, kp_paritycate_interface ki WHERE ki.network IN("aliexpress","kelkoo","ceneo","souq") AND ki.language="' + options.nation + '" AND ki.cid=ka.cid GROUP BY ki.cid ';
        if(options.number != 0) {
            sql += ' limit ' + options.number;
        }
        this.query(sql, [], fn, err);
    };

    /**
     * @: 更新数据
     */
    DependencyDao.prototype.updata = function (options, fn, err) {        
        var sql = "UPDATE `kp_links_lang` SET favor=favor+1 WHERE id="+options.id;
        this.query(sql, [], fn, err);
    };

    
    return DependencyDao;

})();

module.exports = dependencydao;
