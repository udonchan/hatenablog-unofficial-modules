/*

* Change the date format for Hantena Blog

display of date on the each entry to be more cute.
(eg. 2014-04-27 -> Sun Apr 27, 2014)
Currently, the output format is hard coded and no flexibility

** usage

It would work if you put this code in fotter using blog design setting.

* はてなBlogの日付の書式を変更する 

各エントリの日付の表示が可愛くなる。
(例： 2014-04-27 -> Sun Apr 27, 2014)
現状、書式はハードコーディングされており固定である。

** 使い方

ブログのデザイン設定を用いてこのコードをフッタに追加することで動作する。

*/

!function dateFormat(){
    var m2b = function(month){
        var m = parseInt(month);
        var ary_b = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 
                     'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return isNaN(m) || m < 1 || 12 < m  ? month : ary_b[m-1];
    };
    var ymd2D = function(y, m, d){
        var ary_D = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var y = parseInt(y);
        var m = parseInt(m);
        var d = parseInt(d);
        return isNaN(y) || isNaN(m) || isNaN(d) ? "" : ary_D[new Date(y,m-1,d).getDay()];
    }
    var dateFormat = function(elm){
        var timeElm = elm.getElementsByTagName('time')[0];
        var year = timeElm.getElementsByClassName('date-year')[0].innerHTML;
        var month = timeElm.getElementsByClassName('date-month')[0].innerHTML;
        var day = timeElm.getElementsByClassName('date-day')[0].innerHTML;
        timeElm.innerHTML = [[ymd2D(year, month, day), m2b(month), day].join(' '), year].join(', ');
    };
    var dateElements = document.getElementsByClassName('date');
    Array.prototype.forEach.call(dateElements, dateFormat);
}();
