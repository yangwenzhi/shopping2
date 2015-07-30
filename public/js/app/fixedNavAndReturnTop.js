define(function(){

    var fixedNavAndReturnTop = {

        fixedNav:function(){
            var _self = $(".nav");
            var disT = _self.offset().top;
            var _selfH = _self.height();
            var _selfW = _self.width();

            $(window).on('scroll',function(){
                var scrollT = $(window).scrollTop();
                if(scrollT > disT){
                    _self.css({
                        "position":"fixed",
                        "width":_selfW,
                        "top":_selfH,
                        "left":"50%",
                        "margin-left":-_selfW/2,
                        "background-color":"#434343",
                        "z-index":"9999"
                    });
                }else{
                    _self.css({
                        "position":"inherit",
                        "margin-left":"auto",
                        "background-color":"none"
                    });
                }
            })
        },
        returnTop:function(){
            var _self = $(".returnTop");
            var winH = $(window).height();

            $(window).on('scroll',function(){
                var scrollT = $(window).scrollTop();
                
                scrollT > winH ? _self.show():_self.hide();
            });
            _self.on('click',function(){
                $('body,html').animate({scrollTop:0}, 300);
            });
        }
    };

    return fixedNavAndReturnTop;
});
