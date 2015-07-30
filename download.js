var path = require('path');
var fs = require('fs');
var httpHelper = require('./util/httpHelper');
var arguments = require('minimist')(process.argv.slice(2));
var path_url='http://www.jiggybonga.com/hot/goods/';

function createHtml(i, end){
    if(i < end) {
        return;
    }
    else {
        var path_local = path.join(__dirname, 'assets', i + '.tmp');
        httpHelper.get(path_url + i, 10000, function(err, data){    
            if(err){
                console.log(err);
            }
            fs.writeFile(path_local, data, {encoding:'utf8'}, function(err){
                console.log('success download http://www.jiggybonga.com/hot/goods/' + i);
            });
        }, 'utf8');
        return createHtml(i-1, end);
    }
};

if(arguments.s === undefined || arguments.n === undefined) {
    console.log(arguments);
    console.log('input:node download.js -s xxx -n xxx');
}
else{
    var start = parseInt(arguments.s) || 2006;
    var number = parseInt(arguments.n) || 10;
    createHtml(start + number, start);
}
