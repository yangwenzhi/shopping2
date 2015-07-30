/*
detail
*/

define(function(require, exports) {
	var $ = require("jquery");
	var data = require("ajaxData");
	var ajaxDo = require("ajaxDo");
	var praise = require("praise");
	var fixedNavAndReturnTop = require("fixedNavAndReturnTop");

	data.ajaxLoadData('#container','jsoncallback','/api/data/product/same/list/'+classType+'/');

	ajaxDo.init();

	fixedNavAndReturnTop.fixedNav();
	fixedNavAndReturnTop.returnTop();

	var xingcloud = require("xingcloud");
	
});
