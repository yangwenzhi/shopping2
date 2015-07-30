/*行云统计组件*/
(function() {
    if (!window.XA) {
        XA = { /*自适应http,https*/
            _url: '//xa.xingcloud.com/v4/',
            /* action队列*/
            _actions: [],
            /*update队列*/
            _updates: [],
            /*运行中状态*/
            _sending: false,
            init: function(option) {
                if (!option.app) {
                    throw new Error('App is required.');
                }
                XA._app = option.app;
                XA._uid = option.uid || "random";
            },
            setUid: function(uid) {
                XA._uid = uid;
            },
            action: function() {
                for (var i = 0, l = arguments.length; i < l; i++) {
                    XA._actions.push(arguments[i]);
                }
                XA._asyncSend();
            },
            update: function() {
                for (var i = 0, l = arguments.length; i < l; i++) {
                    XA._updates.push(arguments[i]);
                }
                XA._asyncSend();
            },
            /**
                异步执行,会自动合并相邻请求，节约带宽
            */
            _asyncSend: function() {
                setTimeout(function() {
                    var rest = XA._url + XA._app + '/' + XA._uid + '?',
                        item = null,
                        strItem = '',
                        index = 0,
                        length = XA._updates.length + XA._actions.length;
                    if (length == 0 || XA._sending) {
                        return;
                    }
                    XA._sending = true;
                    while (item = XA._updates.shift()) {
                        strItem = 'update' + index+++'=' + encodeURIComponent(item) + '&';
                        if (rest.length + strItem.length >= 1980) {
                            XA._updates.unshift(item);
                            break;
                        } else {
                            rest = rest + strItem;
                        }
                    }
                    index = 0;
                    while (item = XA._actions.shift()) {
                        strItem = 'action' + index+++'=' + encodeURIComponent(item) + '&';
                        if (rest.length + strItem.length >= 1980) {
                            XA._actions.unshift(item);
                            break;
                        } else {
                            rest = rest + strItem;
                        }
                    }(new Image()).src = rest + '_ts=' + new Date().getTime();
                    if (XA._updates.length + XA._actions.length > 0) {
                        XA._asyncSend();
                    }
                    XA._sending = false;
                }, 0);
            }
        }
    }
})();
(function() {
    var browser = "other";
    var browserVersion = "unknown";
    var os = "other";
    var osVersion = "unknown";
    var ua = window.navigator.userAgent;
    var ver = window.navigator.appVersion;
    var matches = null;
    if (matches = ua.match(/OPR\/([0-9.]+)/i)) {
        browser = "opera";
        browserVersion = matches[1];
    } else if (matches = ua.match(/opera\/([0-9.]+)/i)) {
        browser = "opera";
        browserVersion = matches[1];
    }else if (matches = ua.match(/firefox\/([0-9.]+)/i)) {
        browser = "firefox";
        browserVersion = matches[1];
    } else if (matches = ua.match(/chrome\/([0-9.]+)/i)) {
        browser = "chrome";
        browserVersion = matches[1];
    } else if (ua.match(/\s+safari\/[0-9.]+/i) && (matches = ua.match(/\s+version\/([0-9.]+)/i))) {
        browser = "safari";
        browserVersion = matches[1];
    } else if (ua.match(/trident/i) && (matches = ua.match(/[^\w]msie\s+([0-9.]+)/i))) {
        browser = "ie";
        browserVersion = matches[1];
    } else if (ua.match(/trident/i) && (matches = ua.match(/[^\w]rv:([0-9.]+)/i))) {
        browser = "ie";
        browserVersion = matches[1];
    };
    var clientStrings = [{
        s: 'Windows 3.11',
        r: /Win16/
    }, {
        s: 'Windows 95',
        r: /(Windows 95|Win95|Windows_95)/
    }, {
        s: 'Windows ME',
        r: /(Win 9x 4.90|Windows ME)/
    }, {
        s: 'Windows 98',
        r: /(Windows 98|Win98)/
    }, {
        s: 'Windows CE',
        r: /Windows CE/
    }, {
        s: 'Windows 2000',
        r: /(Windows NT 5.0|Windows 2000)/
    }, {
        s: 'Windows XP',
        r: /(Windows NT 5.1|Windows XP)/
    }, {
        s: 'Windows Server 2003',
        r: /Windows NT 5.2/
    }, {
        s: 'Windows Vista',
        r: /Windows NT 6.0/
    }, {
        s: 'Windows 7',
        r: /(Windows 7|Windows NT 6.1)/
    }, {
        s: 'Windows 8.1',
        r: /(Windows 8.1|Windows NT 6.3)/
    }, {
        s: 'Windows 8',
        r: /(Windows 8|Windows NT 6.2)/
    }, {
        s: 'Windows NT 4.0',
        r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
    }, {
        s: 'Windows ME',
        r: /Windows ME/
    }, {
        s: 'Android',
        r: /Android/
    }, {
        s: 'Open BSD',
        r: /OpenBSD/
    }, {
        s: 'Sun OS',
        r: /SunOS/
    }, {
        s: 'Linux',
        r: /(Linux|X11)/
    }, {
        s: 'iOS',
        r: /(iPhone|iPad|iPod)/
    }, {
        s: 'Mac OS X',
        r: /Mac OS X/
    }, {
        s: 'Mac OS',
        r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
    }, {
        s: 'QNX',
        r: /QNX/
    }, {
        s: 'UNIX',
        r: /UNIX/
    }, {
        s: 'BeOS',
        r: /BeOS/
    }, {
        s: 'OS/2',
        r: /OS\/2/
    }, {
        s: 'Search Bot',
        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
    }];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(ua)) {
            os = cs.s;
            break;
        }
    };
    if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
    };
    switch (os) {
    case 'Mac OS X':
        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(ua)[1];
        break;
    case 'Android':
        osVersion = /Android ([\.\_\d]+)/.exec(ua)[1];
        break;
    case 'iOS':
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(ver);
        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
        break;
    };
    window.loginfo = window.loginfo || {};
    window.loginfo.browser = browser;
    window.loginfo.browserVersion = browserVersion;
    window.loginfo.os = os;
    window.loginfo.osVersion = osVersion;
})(); /*初始化行云统计*/
(function() { /*从url中获取文件名*/

    function getFileName(url) {
        var url = url || window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/') + 1);
        return filename;
    } /*解析domain作为appid*/

    function getAppId() {

        var matches = window.location.host.match(/([^\.]+).(com|net|me|org)/);

        if (matches != null) {
            return matches[1];
        } else {
            return null;
        }
    } /*如果获取不到uid，退出统计*/
    if (!XA) return; /*get appid */
    var appid = null;
    if (window.bong && bong.appid) {
        appid = bong.appid;
    } else {
        appid = getAppId();
    }
    /*如果无法从配置文件或者domain中获取appid，则退出统计初始化*/
    if (!appid) return;
    
    $(document).ready(function() {
        XA.init({
            app: appid,
            uid: $.cookie('uid') || 'default'
        });
        var matches = window.location.href.match(/[&?]type=([^&]+)/);
        if (matches && matches[1]) {
            XA.action('visit.' + matches[1]);
        } else {
            XA.action('visit.notype');
        }

        if (window.bong && bong.pageName) {
            XA.update('platform,' + bong.pageName);
        } else {
            XA.update('platform,default_index');
        };
        XA.update('language,' + nation);
        XA.update('browser,' + window.loginfo.browser);
        XA.update('browserVersion,' + window.loginfo.browserVersion);
        XA.update('os,' + window.loginfo.os);
        XA.update('osVersion,' + window.loginfo.osVersion);
    }); /*点击统计*/
    $(document).on('click', function(e) {
        var me = $(e.target);
        if (me.prop('tagName').toUpperCase() != 'A' && me.parents('a').length <= 0) {
            return;
        }
        var base = ['pay', 'click']; /*获取页面名称*/
        if (window.bong && bong.pageName) {
            base.push(bong.pageName.replace('.', '_'));
        } else {
            var filename = getFileName('') || 'index_html';
            base.push(filename.replace('.', '_'));
        } /*get monkey*/
        var monkey = me.parents("[monkey]").attr('monkey') || 'other';
        base.push(monkey.replace('.', '_')); /*get click type*/
        var link = me.prop('tagName').toUpperCase() == 'A' ? me : $(me.parents('a')[0]);
        var tp = link.attr('ad-type') || 'normal';
        base.push(tp.replace('.', '_'));
        var value = link.attr('ad-val') || '0';
        window.XA && XA.action(base.join('.') + ',' + value); /*console.debug(base.join('.'));*/

    });

})();
