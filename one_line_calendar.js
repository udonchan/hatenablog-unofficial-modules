/*

* Calendar shown on a line widget

enable to appear calendar as a line in any position.

(eg. Tue Wed Thu
     01  02  03  ...)

** usage

Note that this code depends on jQuery, thus you must complete to 
activate jQuery before to load this code. The following code would 
be useful for adding ability of jQuery to your code.

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

Then you need specify the location where you want to display the calendar.
In order to do, it is necessary to add a block element setting id as "cal-box".
In addition it would work if you put this code in fotter using blog design setting.

* ライン上にカレンダーを表示するウィジェット

任意の位置にライン上にのカレンダーを表示可能とする。
(例： Tue Wed Thu
     01  02  03  ...)

** 使い方

このコードはjQueryに依存している為、このコードを読み込む前にjQueryを
有効にしなければならないことに注意されたい。以下のコードはコード上に
jQueryの機能を加えるのに便利である。

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

次に、カレンダーを表示したい場所を指定する必要がある。そのために、
idに「cal-box」を指定したブロック要素を追加する。加えて、ブログの
デザイン設定を用いてこのコード自身をフッタに追加することで動作するようになる。

*/

!function calenderWidget($){
    var CAL_DEFAULT_COLOR = "#000000";
    var CAL_SAT_COLOR = "#44abda";
    var CAL_SUN_COLOR = "#aa1204";

    var style_elm = document.createElement('style');
    style_elm.innerHTML = ['div#cal-box{',
                           [
                               'padding:0.3em 0',
                               'width:100%',
                               'text-align:center',
                               'white-space:nowrap',
                               'font-size:80%',
                           ].join(';'),
                          '}',
                           'div#cal-label{',
                           [
                               'display:inline-block',
                               'margin-right:1em',
                               'color:' + CAL_DEFAULT_COLOR,
                           ].join(';'),
                           '}',
                           'a.cal-block{',
                           [
                               'display:inline-block',
                               'width:'+ 2.4 + 'em',
                               'color:' + CAL_DEFAULT_COLOR,
                               'text-decoration:none',
                               'text-align:center'
                           ].join(';'),
                           '}',
                           'a.cal-block.disable{opacity: 0.2}',
                           'a.cal-block.active:hover{text-decoration:underline}',
                           'div.cal-day{',
                           [
                               'font-size:75%'
                           ].join(';'),
                           '}',
                           'div.cal-date{',
                           [
                           ].join(';'),
                           '}',
                           'a.cal-block.sat{',
                           [
                               "color:" + CAL_SAT_COLOR
                           ].join(';'),
                           "}",
                           'a.cal-block.sun{',
                           [
                               "color:" + CAL_SUN_COLOR
                           ].join(';'),
                           "}"
                          ].join('');
    var createMonthDaysArray = function(year, month){
        var days = [];
        var day_count = 1;
        while(true){
            var date = new Date(year, month, day_count++);
            if(date.getMonth() !== month){
                return days;
            }
            days.push(date);
        }
    };
    var zeroPad = function(val, length){
        if((val = val.toString()).length >= length){
            return val;
        }
        var pad_length = length - val.length;
        var list = Array.apply(null, Array(pad_length));
        var zero = function(){return 0};
        return list.map(zero).concat([val]).join('');
    };
    var d2Day = function(d){
        var days_list = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days_list[d];
    };
    var m2Month = function(m){
        var month_list = ['January', 'February', 'March', 'April', 'May', 
                          'June', 'July', 'August', 'September', 'October', 
                          'November', 'December'];
        return month_list[m];
    };
    var date2Elm = function(date){
        var pad_month = zeroPad(date.getMonth()+1, 2);
        var pad_date = zeroPad(date.getDate(),2);
        var href = '/' + ['entries', date.getFullYear(), pad_month, pad_date].join('/');
        var block_id = [date.getFullYear(), pad_month, pad_date].join('');
        var block_class = d2Day(date.getDay()).toLowerCase();
        return ['<a id="', block_id, '" class="cal-block ', block_class, '" href="', href, '">', 
                '<div class="cal-day">', d2Day(date.getDay()), '</div>', 
                '<div class="cal-date">', pad_date, '</div>', 
                '</a>'].join('');
    };
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    $.ajax(
        {type:'GET',
         url:'/' + ['archive', year, month+1].join('/'),
         success: function(html){
             var head_elm = document.getElementsByTagName('head')[0];
             head_elm.appendChild(style_elm);
             var actives = {};
             Array.prototype.forEach.call($('time', $.parseHTML(html)),function(elm){
                 actives[parseInt(elm.innerHTML.split(/-/)[2])] = true;
             });
             $(document).ready(function(){
                 var label = ['<div id="cal-label">', year.toString(), m2Month(month), '</div>'].join('');
                 var $cal_box = $('#cal-box');
                 if($cal_box.length === 0){return;}
                 $cal_box.html(label + createMonthDaysArray(year, month).map(date2Elm).join(''));;
                 Array.prototype.forEach.call($cal_box.find('a'),function(elm, count){
                     var date = count + 1;
                     var $elm = $(elm);
                     if(actives[date]){
                         $elm.addClass('active');
                     }else{
                         $elm.addClass('disable');
                         $elm.click(function(event){
                             event.preventDefault();
                         });
                     }
                 });
             });
         }
        });
}(jQuery);
