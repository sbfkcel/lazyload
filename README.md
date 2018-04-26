# Lazyload

[![npm version](https://badge.fury.io/js/image-lazyload.svg)](https://badge.fury.io/js/image-lazyload)

- Loaded images of lazy loading components.
- Compatible with IE7 + browser.
- Allow custom loading style.

## Use

2.1 Html

- html set the `data-src` property.
- `data-cover` is not necessary

```html
<img class="img" data-src="http://xxx/img1.jpg" data-cover="http://xxx/img1-cover.jpg">
<img class="img" data-src="http://xxx/img2.jpg" data-cover="http://xxx/img2-cover.jpg">
<img class="img" data-src="http://xxx/img3.jpg" data-cover="http://xxx/img3-cover.jpg">
 
<div class="imgBg" data-src="http://xxx/img4.jpg" data-cover="http://xxx/img4-cover.jpg"></div>
<div class="imgBg" data-src="http://xxx/img5.jpg" data-cover="http://xxx/img5-cover.jpg"></div>
<div class="imgBg" data-src="http://xxx/img6.jpg" data-cover="http://xxx/img6-cover.jpg"></div>
```

2.2 Import `./dist/Lazyload.js` file to the page

```html
<script src="http://xxx/dist/Lazyload.js"></script>
```

or
```javascript
let Lazyload = require('./dist/Lazyload.js');
```

2.3 Initialization
```javascript
//Get elements
var eList = [];
eList.push.apply(eList, document.getElementsByClassName('img'));
eList.push.apply(eList, document.getElementsByClassName('imgBg'));

//Create Lazy
var lazy = new Lazyload({
    obj:eList,          //elements
    range:200           //Extra range
});

// //custom tips
// lazy.tips = function(obj){
//     var e = obj.o,                    //element
//         schedule = obj.schedule;      //load schedule
//     console.log(e,schedule);
// };

//Init
lazy.init();
```

## Npm

```bash
npm install image-lazyload
```

```javascript
import Lazyload from 'image-lazyload'

let imgs = document.getElementsByClassName('img'),
    lazy  = new Lazyload({
        obj:imgs,
        range:200
    });

lazy.init();
```


## Demo

- [Lazyload Demo - default](https://sbfkcel.github.io/lazyload/)
- [Lazyload Demo - custom tips](https://sbfkcel.github.io/lazyload/demo.html)

## License
MIT
