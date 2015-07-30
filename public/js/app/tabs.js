/*tabs*/
define("tabs", ["jquery", "ajaxDo"], function($, ajax) {
	
	var clearDirTabs = null;
	return {
		getTabs:function(el,me,oType){
			var index=$(el).index(),
				pIndex=$(me).find('.E-tabs-list').eq(index),
				_this=this;
			$('.E-tabs-list', me).addClass('none');
			pIndex.removeClass("none");
			if(pIndex.hasClass('ajax-load')){
				if(pIndex.attr("data-trigger")){
					ajax.triggerShow(pIndex,pIndex.attr('temId'));
				}
			}else if(pIndex.find('.ajax-load').length>0){
				var ajaxData=pIndex.find('.ajax-load');
				for(var i=0;i<ajaxData.length;i++){
					if($(ajaxData[i]).attr("data-trigger")){
						ajax.triggerShow(ajaxData[i],$(ajaxData[i]).attr('temId'));
					}
				}
			}
			if(pIndex.find('.dom-load').length>0){
				var domData=pIndex.find('.dom-load');
				for(var i=0;i<domData.length;i++){
					if($(domData[i]).attr("data-trigger")){
						ajax.triggerShow(domData[i],$(domData[i]).attr('temId'));
					}
				}
			}	
			/*action ajax*/
			$('.E-tabs-title li', me).removeClass('select');
			if(oType=='clickEvent'){
				$('.E-tabs-title li a').attr('href','javascript:;');
			}
			$(el).addClass('select');
		},
		getAttr:function(me){
			var oType=$(me).attr('event-type'),
				_this=this;
			switch(oType){
				case "hoverEvent":
					$('.E-tabs-title li', me).on('mouseenter', function(e){
						var el =this;
						//_this.getTabs(el,me,oType);
						if(clearDirTabs) clearTimeout(clearDirTabs);
						clearDirTabs = setTimeout(function(){
							_this.getTabs(el,me,oType);
						}, 200);
						return false;
					});
					break;
				case "clickEvent":
					$('.E-tabs-title li', me).on('click', function(e){
						var el =this;
						var oEl=$(el);
						if($(this).hasClass('select')){
							if(oEl.children().data('url')){
								oEl.children().attr('href',oEl.children().data('url'));
							}
						} else{
							_this.getTabs(el,me,oType);
						}
					});
					$('.E-tabs-title li a').click(function(ev){
						if(!$(this).parent().hasClass('select')){
							ev.preventDefault();
						}
					});
					$('.widget-life-hd li a').click(function(ev){
						ev.preventDefault();
					});
					break;
			};

		}
	};

});