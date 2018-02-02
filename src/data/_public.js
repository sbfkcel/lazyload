module.exports = {
    config:{
        isMobile:false,
        isFullScreen:false,
        showIosIcon:false
    },
    title:'Lazyload Demo',
    depict:`Loaded images of lazy loading components.<br/>Compatible with IE7 + browser.<br/>Allow custom loading style.`,
    github:'https://sbfkcel.github.io/lazyload/',
    code1:{
        html:`
<!--html-->
<img class="img" data-src="http://xxx/img1.jpg" data-cover="http://xxx/img1-cover.jpg">
<img class="img" data-src="http://xxx/img2.jpg" data-cover="http://xxx/img2-cover.jpg">
<img class="img" data-src="http://xxx/img3.jpg" data-cover="http://xxx/img3-cover.jpg">

<!--and-->
<div class="imgBg" data-src="http://xxx/img4.jpg" data-cover="http://xxx/img4-cover.jpg"></div>
<div class="imgBg" data-src="http://xxx/img5.jpg" data-cover="http://xxx/img5-cover.jpg"></div>
<div class="imgBg" data-src="http://xxx/img6.jpg" data-cover="http://xxx/img6-cover.jpg"></div>`,
        js:`
//javascript
var eList = [];
o.push.apply(o, document.getElementsByClassName('img'));
o.push.apply(o, document.getElementsByClassName('imgBg'));

var lazy = new Lazyload({
    obj:eList,          //elements
    range:200         //Extra range
});

lazy.init();`
    },
    imgList0:[
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621687.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621683.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621681.jpg"
    ],
    coverList0:[
        "",
        "",
        ""
    ],
    imgList1:[
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621700.jpg",
        //"https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621698.jpg",
        "http://i.17173cdn.com/2fhnvk/YWxqaGBf/cms3/VaNtWRbmebdlBCq.gif",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621687.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621683.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621681.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621678.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621675.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621672.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621670.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621665.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621663.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-621658.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-608492.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-610745.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-614179.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-609432.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-614476.jpg",
        "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-610513.jpg"
    ],
    coverList1:[
        "",
        "http://i.17173cdn.com/2fhnvk/YWxqaGBf/cms3/JEOMkQbmebdirhB.jpg!a-3-540x.jpg",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ]
};