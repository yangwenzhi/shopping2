/*延时加载数据*/
define("ajaxDo", ["jquery", "storage", "doT"], function($, storage, doT) {
    
	var clearDir = null;
	return {
		imgLazyLoad:function(obj){
			obj.each(function(){
				var oSrc=$(this).attr("_src"),
					me=$(this);
				me.attr("src",oSrc);
			})
		},
		ajax_load:function(obj,temID){
			var url = $(obj).attr('data-url'),
				jsonp = $(obj).attr('data-jsonp'),
				cacheTime=parseInt($(obj).attr("data-cacheTime"))||0,
				temID = $(obj).attr('data-adsId') || temID,
				_this=this;
			$(obj).attr('loaded', 'loaded');
			var NowTime=parseInt(new Date().getTime()/1000);
			var storageKey=$(obj).attr("storageKey")||url;
			if(storage.support && cacheTime>0){
				if(storage.get(storageKey,'content')){
					$(obj).css("background","none");
					var oData=storage.get(storageKey,'content');
					oData=oData.content ?oData.content:oData;
					var tmpl = $("#"+temID).html();
					var doTtmpl = doT.template(tmpl);
					$(obj).append(doTtmpl(oData));
					if($(obj).find("img").hasClass("lazyload")){
						var getMe=$(obj).find(".lazyload");
						_this.imgLazyLoad(getMe);	
					}
					if(NowTime-storage.get(storageKey,'dataLine')>=cacheTime){
						$.ajax({
							dataType: "jsonp",
							url: url,
							jsonp : jsonp,
							success: function(data){							
								storage.set(storageKey,'content',data);
								storage.set(storageKey,'dataLine',NowTime);							
							}
						});	
					}
				}else{
					_this.loadAjaxData(obj,url,jsonp,NowTime,temID);
				}
			}else{
				_this.loadAjaxData(obj,url,jsonp,NowTime,temID);
			}		
		},
		img_load:function(obj){
			var _this = this;
			if($(obj).attr('loaded') == 'loaded') return;
			if($(obj).find("img").hasClass("lazyload")){
				var getMe=$(obj).find(".lazyload");
				_this.imgLazyLoad(getMe);
				$(obj).attr('loaded', 'loaded');	
			}
		},
		dom_load:function(obj,temID,oData){
			var tmpl = $("#"+temID).html();
			var doTtmpl = doT.template(tmpl);
			$(obj).html(doTtmpl(oData));
			$(obj).css("background","none");
		},
		ads_load:function(obj,adsID){
			var tmpl = $("#"+adsID).html();
			var doTtmpl = doT.template(tmpl);
			$(obj).html(doTtmpl());
			$(obj).css("background","none");
			$(obj).attr('loaded', 'loaded');
		},
		ads_lazyload:function(obj, _callback){
			var adsID = $(obj).attr("adsId");
			var tmpl = $("#"+adsID).html();
			var doTtmpl = doT.template(tmpl);
			$(obj).html(doTtmpl());
			if(_callback) _callback.call(this.ads_lazyload, obj);
		},
		loadAjaxData:function(obj,url,jsonp,NowTime,temID){
			var _this=this;
			var storageKey=$(obj).attr("storageKey")||url;
			$.ajax({
				dataType:"jsonp",
				url:url,
				jsonp:jsonp,
				success: function(data){
					if(data){
						var oData=data.content?data.content:data;
						var tmpl = $("#"+temID).html();
						var doTtmpl = doT.template(tmpl);
						$(obj).append(doTtmpl(oData));
						$(obj).css("background","none");
					}
					if(storage.support){					
						storage.set(storageKey,'content',data);
						storage.set(storageKey,'dataLine',NowTime);										
					};			
				},
				complete:function(){
					if($(obj).find("img").hasClass("lazyload")){
						var getMe=$(obj).find(".lazyload");
						_this.imgLazyLoad(getMe);	
					}	
				}
			});
		},
		triggerShow:function(obj,temID){
			if(!$(obj).attr('loaded')){
				this.ajax_load(obj,temID);
				if("undefined" != typeof $(obj).attr("data-name")) {
					var name = $(obj).attr('data-name');
					if(typeof datas == 'undefined') {
						this.dom_load($(obj),temID,'');
					}
					else {
						this.dom_load($(obj),temID,datas[name]);
					}
				}
				$(obj).attr('loaded', 'loaded');
			}
		},
		requireSetData:function(json,obj,temID){
			var trigger = $(obj).attr('data-trigger');
			var tH=json.oH+json.oT+100;
			var sLoad=$(obj).attr("loaded");
			var id=$(obj).attr("id");
			var _this=this;
			if(!trigger && tH>json.oM && !sLoad){
				if("undefined" != typeof $(obj).attr("adsId")) {
					var name = $(obj).attr('adsId');
					_this.ads_load($(obj),name);
				}
				else{
					_this.ajax_load($(obj),temID);
					if("undefined" != typeof $(obj).attr("data-name")) {
						var name = $(obj).attr('data-name');
						if(typeof datas == 'undefined') {
							_this.dom_load($(obj),$(obj).attr('temId'),'');
						}
						else {
							_this.dom_load($(obj),$(obj).attr('temId'),datas[name]);
						}
					}
				}
				if(temID == 'imglazyArguments'){
					_this.img_load(obj);
				}
			}
		},
		setLazyLoadData:function(){
			var h=$(window).height(),
				t=$(window).scrollTop(),
				_this=this;
			$('.ajax-load').each(function(index){
				var me = this,
					mT=$(me).offset().top,
					temId = $(me).attr('temId');
				_this.requireSetData({oH:h,oT:t,oM:mT},me,temId);
			});
			$('.dom-load').each(function(index){
				var me = this,
					mT=$(me).offset().top,
					temId = $(me).attr('temId');
				_this.requireSetData({oH:h,oT:t,oM:mT},me,temId);
			});
			$('.ads-load').each(function(index){
				var me = this,
					mT=$(me).offset().top,
					temId = $(me).attr('adsId');
				_this.requireSetData({oH:h,oT:t,oM:mT},me,temId);
			});
			$('.img-load').each(function(index){
				var me = this,
					mT=$(me).offset().top;
				_this.requireSetData({oH:h,oT:t,oM:mT},me,'imglazyArguments');
			});
		},
		init:function(){
			var _this=this;
			$(window).on("scroll",function(){
				if(clearDir) clearTimeout(clearDir);
				clearDir = setTimeout(function(){
					_this.setLazyLoadData();
				}, 200);
			});
			$(window).on("resize",function(){
				_this.setLazyLoadData();
			});
			_this.setLazyLoadData();
		}
	};

});