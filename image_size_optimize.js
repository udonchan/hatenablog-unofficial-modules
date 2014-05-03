/*

* Image size optimizer for photo blog

to enable large image on entrys displays fill the screen as much as possible.

** usage

Note this code depends on the jQuery thus you must complete to 
activate jQuery before to load this code. The following code would 
be useful for adding ability of jQuery to your aplication.

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

In addition it would work if you put this code in fotter using blog design setting.

* 写真ブログ向けの画像サイズ最適化

大きな画像を可能な限りスクリーンいっぱいに表示できるようにする。

** 使い方

このコードはjQueryに依存しているので、このコードを読み込む前にjQueryを
有効にしなければならないことに注意されたい。以下のコードはアプリケーション上に
jQueryの機能を加えるのに便利である。

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

加えて、デザイン設定を用いてこのコード自身をフッタに追加することで動作するようになる。

*/

!function imageSizeOptimizer($){
    var TARGET_IMAGES_SELECTER_STRING = "div.entry-content p img";
    var ENTRY_INNER_SELECTER_STRING = "div.entry-inner";
    var $targetImages;
    var $entryInner;
    var $window = $(window);

    var getActualDimension = function(image) {
        var run, mem, w, h, key = "actual";
        // for Firefox, Safari, Google Chrome
        if ("naturalWidth" in image) {
            return {width: image.naturalWidth, height: image.naturalHeight};
        }
        if ("src" in image) { // HTMLImageElement
            if (image[key] && image[key].src === image.src){
                return  image[key];
            }
            if (document.uniqueID) { // for IE
                w = $(image).css("width");
                h = $(image).css("height");
            } else { // for Opera and Other
                // keep current style
                mem = {w: image.width, h: image.height}; 
                // remove attributes in the case that img-element has set width and height (for webkit browsers)
                $(this).removeAttr("width").removeAttr("height").css({width:"",  height:""});    
                w = image.width;
                h = image.height;
                image.width  = mem.w; // restore
                image.height = mem.h;
            }
            return image[key] = {width: w, height: h, src: image.src}; // bond
        }
        // HTMLCanvasElement
        return {width: image.width, height: image.height};
    }
    var imageSizeOptimize = function(targets){
        var maxWidth = $window.width();
        var maxHeight = Math.min($window.width(), $window.height());
        var innerWidth = $entryInner.width();
        Array.prototype.forEach.call(targets, function(imageElm){
            var tempImage = new Image();
            // process after complete to load image
            tempImage.onload = function(){
                var actualDimension = getActualDimension(tempImage);
                var ratio = actualDimension.width / actualDimension.height;
                var height = Math.min(maxHeight, actualDimension.height);
                var width = height * ratio;
                // in first, adjust image height
                if(width > maxWidth){
                    width = maxWidth;
                    height = width / ratio;
                }
                // if image width is larger than contents area, 
                // this code enables image to be displayed 
                // overflowing and centering.
                if(width > innerWidth){
                    $(imageElm).css("position", "relative")
                        .css("left", (innerWidth - width)/2)
                        .css("max-width", "none");
                } else {
                    $(imageElm).css("position", "static");
                }
                imageElm.width = width;
                imageElm.height = height;
            };
            tempImage.src = imageElm.src;
        });
    }
    $(document).ready(function(){
        $targetImages = $(TARGET_IMAGES_SELECTER_STRING);
        $entryInner = $(ENTRY_INNER_SELECTER_STRING);
        imageSizeOptimize($targetImages);
        /* in the case of window resized */
        var timer = false;
        $window.resize(function() {
            if (timer !== false) {
                clearTimeout(timer);
            }
            timer = setTimeout(function() {
                imageSizeOptimize($targetImages);
            }, 200);
        });
    });
}(jQuery);
