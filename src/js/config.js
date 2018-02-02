seajs.config({
    //文件编码
    charset: 'utf-8',
    //基础路径
    base: './',
    //路径配置
    paths: {
        'feUtil': '//$$localhost/staticfile/',
        'seajs': '//$$localhost/staticfile/seajs/3.0.0',
        'js': window.cdnPath ? window.cdnPath + 'js' : 'js'
    },
    //别名配置
    alias: {
        'seajs-css': 'seajs/seajs-css',
        'seajs-text': 'seajs/seajs-text',
        'jquery': 'feUtil/jquery/1.7.2/jquery',
        'login': 'feUtil/gdcLogin/1.0/login',
        'swfobject': 'feUtil/swfobject/2.3.2/swfobject',
        'png': 'feUtil/DD_belatedPNG/0.0.8a/DD_belatedPNG',
        'json2': 'feUtil/json2/20150503/json2'
    },
    //预加载项
    preload: [
        'seajs-css',
        'seajs-text',
        window.JSON ? '' : 'json2'
    ]
});
