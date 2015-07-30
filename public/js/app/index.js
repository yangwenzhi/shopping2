/*
index
*/

define(function(require, exports) {
	var $ = require("jquery");
	var data = require("ajaxData");
	var tabs = require("tabs");
	var ajaxDo = require("ajaxDo");
	var praise = require("praise");
	var fixedNavAndReturnTop = require("fixedNavAndReturnTop");
	
	//classType
	//nation
	data.ajaxLoadData('#container','jsoncallback','/api/data/product/list/'+classType+'/');

	//$(".E-widget").each(function(){tabs.getAttr(this)});

	ajaxDo.init();
	fixedNavAndReturnTop.fixedNav();
	fixedNavAndReturnTop.returnTop();

	/*if($(".ads-lazyload").length){
        $(".ads-lazyload").each(function(){
            ajaxDo.ads_lazyload(this);
        });
    };*/

	var xingcloud = require("xingcloud");



});
