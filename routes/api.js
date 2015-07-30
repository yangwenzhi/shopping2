var urllib = require('url');
var DependencyDao = require('../dao/dependencydao')();
var cookie = require('../dao/cookie');
var fs = require('fs');
var path = require('path');
var link2id = require('../config/link2id.json');
var id2link = require('../config/id2link.json');

var apis = function(app){

    var nation2 = ['ru', 'es', 'pl', 'ae', 'tr', 'en']; //nation、nation2代表语言
    var dictionary_url = __dirname.replace(/\\/g,'/').replace('routes','') + 'config/dictionary.json';

    app.get('/:type', function(req, res){
        try{
            var type = req.params.type;
            var cookieHandle = cookie.getHandler(req, res);
            var nation = cookieHandle.get('nation') || req.headers['accept-language'].split(',')[0].split('-')[0];
            var uid = urllib.parse(req.url, true).query.uid || Math.floor(Math.random()*(new Date()).valueOf());
            if(!cookieHandle.get('uid')) {
                res.setHeader("Set-Cookie", ['uid=' + uid]);
            }
            if(nation2.indexOf(nation) == -1){
                nation = 'en';
            }
            var opt = {
                'start': 0,
                'parity_cate': link2id[type],
                'nation': nation,
                'pagesize': 10
            };
            if(type == 'favorites') {
                fs.readFile(dictionary_url, function (err, dict) {
                    res.render('index', { title: 'jiggybonga', type: type, id2link: id2link, typename: type, nation: nation, dictionary: JSON.parse(dict)[nation] });
                });
            }
            else {
                fs.readFile(dictionary_url, function (err, dict) {
                    DependencyDao.selectList(opt, function(data) {
                        res.render('index', { title: 'jiggybonga', type: link2id[type], id2link: id2link, typename: type, nation: nation, dictionary: JSON.parse(dict)[nation], data: data });
                    }, function(){
                        res.render('error');
                    });
                });
            }
            console.log('ip:'+getClientIp(req)+'----nation:' + nation);
            console.log(req.headers['accept-language']);
        }
        catch(err){
            console.log(err);
        }
    });

    function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    };

    app.get('/:type/goods/:id', function(req, res){
        
        var pathname = urllib.parse(req.url).pathname.split('/');
        var realPath = 'assets/' + pathname[pathname.length - 1] + '.tmp';
        var cookieHandle = cookie.getHandler(req, res);
        var uid = urllib.parse(req.url, true).query.uid || Math.floor(Math.random()*(new Date()).valueOf());
        if(!cookieHandle.get('uid')) {
            res.setHeader("Set-Cookie", ['uid=' + uid]);
        }
        path.exists(realPath, function (exists) {
            if (!exists) {
                try{
                    var id = req.params.id;
                    var reg = /^\d+$/g;
                    if(!reg.test(id)){
                        res.render('error');
                        return;
                    }
                    var nation = '';
                    if(req.headers['accept-language'] != undefined){
                        nation = cookieHandle.get('nation') || req.headers['accept-language'].split(',')[0].split('-')[0];
                    }
                    if(nation2.indexOf(nation) == -1){
                        nation = 'en';
                    }
                    var type = req.params.type;
                    var opt = {
                        'id': id
                    };
                    fs.readFile(dictionary_url, function (err, dict) {
                        DependencyDao.select(opt, function(data) {
                            res.render('detail', { title: 'jiggybonga', type: link2id[type], id2link: id2link, typename: type, id: id, nation: nation, data: data[0], dictionary: JSON.parse(dict)[nation] });
                        }, function(){
                            res.render('error');
                        });
                    });
                    console.log('ip:'+getClientIp(req)+'----nation:' + nation);
                    console.log(req.headers['accept-language']);
                }
                catch(err){
                    console.log(err);
                }
            } 
            else {
                fs.readFile(realPath, "binary", function(err, file) {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err);
                    } 
                    else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(file, 'binary');
                        res.end();
                    }
                });
            }
        });

    });

    //数据接口
    app.get('/api/data/product/list/:parity_cate/:start', function(req, res){
        try{
            var cookieHandle = cookie.getHandler(req, res);
            var nation = cookieHandle.get('nation') || req.headers['accept-language'].split(',')[0].split('-')[0];
            if(nation2.indexOf(nation) == -1){
                nation = 'en';
            }
            var reg = /^\d+$/g;
            if(!reg.test(req.params.start)){
                res.send(200, {status:0, message: 'parameter error' });
                return;
            }
            var opt = {
                'start': req.params.start,
                'parity_cate': req.params.parity_cate,
                'nation': nation,
                'pagesize': 10
            };
            var ids = urllib.parse(req.url, true).query.ids;
            if(ids) {
                opt.ids = ids.split(',');
            }
            DependencyDao.selectList(opt, function(data) {
                var params = urllib.parse(req.url, true);
                if (params.query && params.query.jsoncallback) {
                    var str =  params.query.jsoncallback + '(' + JSON.stringify(data) + ')'; //jsonp
                    res.end(str);
                }
                else {
                    res.end(JSON.stringify(data)); //普通的json
                }
            }, function(){
                res.render('error');
            });
        }
        catch(err){
            console.log(err);
        }
    });

    //数据接口 同类产品
    app.get('/api/data/product/same/list/:parity_cate/:start', function(req, res){
        try{
            var cookieHandle = cookie.getHandler(req, res);
            var nation = cookieHandle.get('nation') || req.headers['accept-language'].split(',')[0].split('-')[0];
            if(nation2.indexOf(nation) == -1){
                nation = 'en';
            }
            var reg = /^\d+$/g;
            if(!reg.test(req.params.start)){
                res.send(200, {status:0, message: 'parameter error' });
                return;
            }
            var opt = {
                'start': req.params.start,
                'parity_cate': req.params.parity_cate,
                'nation': nation,
                'pagesize': 10,
                'sameid': urllib.parse(req.url, true).query.same
            };
            DependencyDao.selectListSame(opt, function(data) {
                var params = urllib.parse(req.url, true);
                if (params.query && params.query.jsoncallback) {
                    var str =  params.query.jsoncallback + '(' + JSON.stringify(data) + ')'; //jsonp
                    res.end(str);
                }
                else {
                    res.end(JSON.stringify(data)); //普通的json
                }
            }, function(){
                res.render('error');
            });
        }
        catch(err){
            console.log(err);
        }
    });

    //数据接口 nav
    app.get('/api/data/nav/list/:num', function(req, res){
        try{
            var cookieHandle = cookie.getHandler(req, res);
            var nation = cookieHandle.get('nation') || req.headers['accept-language'].split(',')[0].split('-')[0];
            if(nation2.indexOf(nation) == -1){
                nation = 'en';
            }
            var reg = /^\d+$/g;
            if(!reg.test(req.params.num)){
                res.send(200, {status:0, message: 'parameter error' });
                return;
            }
            var opt = {
                'nation': nation,
                'number': req.params.num //num=0是全部
            };
            DependencyDao.selectNav(opt, function(data) {
                var params = urllib.parse(req.url, true);
                if (params.query && params.query.jsoncallback) {
                    var str =  params.query.jsoncallback + '(' + JSON.stringify(data) + ')'; //jsonp
                    res.end(str);
                }
                else {
                    res.end(JSON.stringify(data)); //普通的json
                }
            }, function(){
                res.render('error');
            });
        }
        catch(err){
            console.log(err);
        }
    });

    //数据接口 点赞
    app.get('/product/follow/:id', function(req, res){
        try{
            var id = req.params.id;
            var reg = /^\d+$/g;
            if(!reg.test(id)){
                res.send(200, {status:0, message: 'parameter error' });
                return;
            }
            var opt = {
                'id': id
            };
            DependencyDao.updata(opt, function(data) {
                res.send(200, {status:1 });
            }, function(){
                res.render('error');
            });
        }
        catch(err){
            console.log(err);
        }
    });

};

module.exports.apilist = apis;
