define(function(require,exports){

    var s = {}, objStr,goodsId,goodsStr;

    var goods_cache = JSON.parse(localStorage.getItem("PRAISE")) || {};
    var goods_value = $("#container .product-item input");
    goods_value.each(function(){
        var _t = $(this);
        if(goods_cache[_t.val()] != undefined && goods_cache[_t.val()].split(',')[0] != 0) {
            _t.parents(".product-item").find(".action_heart").addClass("hSelect");
        }
    });

    $('.list').delegate('.heartBtn','click',function(){
        goodsStr = $(this).parent(".product-item").find(".goods-link").attr('href');
        goodsId = goodsStr.match(/\d+/g)[0];
        var t = $(this);
        if(localStorage.getItem("PRAISE")){
            s = JSON.parse(localStorage.getItem("PRAISE"));
            if(s[goodsId] != undefined && s[goodsId].split(',')[0] == "1"){
                checkStorage("0");
                t.find('.action_heart').removeClass('hSelect');
                if(classType == 'favorites') t.parents('.product-item').hide();
            }else{
                t.find('.action_heart').addClass('hSelect');
                $.ajax({
                    type: 'GET',
                    url: '/product/follow/'+ goodsId +'',
                    success:function(){
                        checkStorage("1");
                        //t.find('.action_heart').addClass('hSelect');
                    }
                });
            }
        }else{
            checkStorage("1");
        }
        function checkStorage(b){
            s[goodsId] = b + ',' + typeName;
            objStr=JSON.stringify(s);
            localStorage.setItem("PRAISE", objStr);
            $(this).find('.action_heart').addClass('hSelect');
        }
    });

    if(classType == 'favorites') $('head').append('<style>.product-item .heartBtn{display:block;}</style>');
});
