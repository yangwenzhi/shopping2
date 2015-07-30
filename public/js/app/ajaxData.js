/*
ajax load data use Template inner for in and set waterful
*/

define(function(require, exports) {
 	
 	var doT = require("doT");
	var $ = require("jquery");

	var clearDir = null;
	var pagesize = 1;
	var flag = true;		

	function imgLazyLoad(obj){
		obj.each(function(){
			var oSrc=$(this).attr("_src"),
				me=$(this);
			me.attr("src",oSrc);
		})
	};

	function loadData(obj,url,jsonp){
		if(!flag) return;
		flag = false;
		$(".loading").show();
		$.ajax({
			dataType:"jsonp",
			url:url,
			jsonp:jsonp,
			success: function(data){
				if(data.length > 0){
					var oData=data.content?data.content:data;
					var temID = $(obj).attr('temId');
					for(var i = 0; i < oData.length; i++){
						var tmpl = $("#"+temID).html();
						var doTtmpl = doT.template(tmpl);
						minContainer(obj).append(doTtmpl(oData[i]));
					}
					pagesize += 1;
					flag = true;
				}
				$(".loading").hide();	
			},
			complete:function(){
				if($(obj).find("img").hasClass("lazyload")){
					var getMe=$(obj).find(".lazyload");
					imgLazyLoad(getMe);	
				}
			}
		});
	};

	Array.min=function(array){
	    return Math.min.apply(Math,array);
	};

	function minIndex(min, arr){
		for(var i = 0; i < arr.length; i++){
			if(min == arr[i]) return i;
		}
	}

	function minContainer(obj){
		var container = $(obj).find('.list');
		var arr = [container.eq(0).height(), container.eq(1).height(), container.eq(2).height()];
		var min = Array.min(arr);
		var index = minIndex(min, arr);
		return container.eq(index);
	}

	function Initialization(obj,jsonp,url){
		var ids_cache = JSON.parse(localStorage.getItem("PRAISE")) || {};
		var ids_array = [0];
		for (var id in ids_cache) {
			if(ids_cache[id].split(',')[0] == 1) ids_array.push(id.split(',')[0]);
		}
		$(window).on("scroll",function(){
			if($(window).height() + $(window).scrollTop() > $(document).height() - 200){
				if(clearDir) clearTimeout(clearDir);
				clearDir = setTimeout(function(){
					if(classType == 'favorites') loadData(obj,url+(pagesize-1)*10+'/?ids='+ids_array,jsonp);
					else if(typeof product_id != 'undefined') loadData(obj,url+(pagesize-1)*10+'/?same='+product_id,jsonp);
					else loadData(obj,url+pagesize*10+'/',jsonp);
				}, 200);
			}
		});
		if(classType == 'favorites') loadData(obj,url+'0/?ids='+ids_array,jsonp);
		if(typeof product_id != 'undefined') loadData(obj,url+'0/?same='+product_id,jsonp);
	};

	exports.ajaxLoadData = function(obj,jsonp,url) {
		return Initialization(obj,jsonp,url);
	};

});