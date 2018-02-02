const path = require('path');

let publicPath = path.join(__dirname,'_public'),        //公共数据路径
    publicData = fws.require(publicPath),               //公共数据
    pageData = {                                        //页面数据
        body:"Hello",
        code:{
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
eList.push.apply(eList, document.getElementsByClassName('img'));
eList.push.apply(eList, document.getElementsByClassName('imgBg'));

var lazy = new Lazyload({
    obj:eList,                                //elements
    range:200                               //Extra range
});

//custom tips
lazy.tips = function(obj){
    var e = obj.o,                          //element
        schedule = obj.schedule;      //load schedule
};

lazy.init();`
        },
    };

//将公共数据写到入页面数据中
for(let i in publicData){
    pageData[i] = publicData[i];
};
module.exports = pageData;