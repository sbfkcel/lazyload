# Lazyload

- Loaded images of lazy loading components.
- Compatible with IE7 + browser.
- Allow custom loading style.

## use

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
let Lazyload = require('./dist/Lazyload');
```

2.3 initialization
```javascript
//Get elements
var eList = [];
o.push.apply(o, document.getElementsByClassName('img'));
o.push.apply(o, document.getElementsByClassName('imgBg'));

//Create Lazy
var lazy = new Lazyload({
    obj:eList,          //elements
    range:200           //Extra range
});

//Init
lazy.init();
```

## Demo

- 
- 

## License
MIT