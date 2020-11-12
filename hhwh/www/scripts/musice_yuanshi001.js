+function(){
    class Musice{
        constructor(data){
            // let data = {
            //     musice:[
            //         {
            //             name: '青城山下白素贞',
            //             singer: '鞠婧祎',
            //             lrc:'./lrc/613760752.lrc'
            //             mp3: './music/1.mp3'
            //             img: './images/1.jpg'
            //         }
            //     ]
            // }
            let self = this;
            this._musice_data = data && data.list || [];
            this._audio = $('<audio height="0" width="0" src=""></audio> ');
            this._musice_name_box = $('#song_name');
            this._musice_singer_box = $('#goSinger span');
            this._musice_bg = $('.bg');
            this._musice_pic = $('#album_pic');

            this._musice_list = $('#musice_list');
            this._play = $('#play');
            this._play_prev_btn = $('#play_prev_btn');
            this._play_next_btn = $('#play_next_btn');
            this._speed_box = $('#progress');
            this._speed_bar = $('#play_on');
            this._speed_btn = $('#btn_pro');
            this._index = 0;
            this.startX = 0;
            this.startY = 0;

            this._in_play = false;

            $(".diyige").css("margin-left",($(window).width()/2)-10+"px");

            this.add_html();
            this.add_event();
            this.musice_switch();
            this._speed_time = setInterval(function(){
                self.timing()
            }, 1);
        }
        timing (){
            let zs = this._js_audio.duration,//音频总时长
                present = $("#currentTime"),//当前时长位置
                jpProgress = $("#play_loading"),//缓冲条
                dq = this._js_audio.currentTime,//当前播放时间
                always=$("#totalTime"),//总时长位置
                m,s,dm,ds,jd,hc,buffer;
            m = parseInt(zs/60);
            s = Math.floor(zs%60);
            always.html(m+":"+s);
            
            dm=parseInt(dq/60);
            ds=Math.floor(dq%60);
            present.html(dm+":"+ds);//但前播放时间显示
            
            jd = (dq/zs)*100;
            this._speed_bar.css('WebkitTransform', "translateX("+jd+"%)");//进度条
            
            buffer = this._js_audio.buffered;//缓冲帧
            hc=(buffer/zs)*100;
            jpProgress.css('WebkitTransform', "translateX("+hc+"%)");//缓冲条
        }
        add_html (){
            $('body').append(this._audio);
            this._js_audio = this._audio[0];
            this._musice_list.html('');
            for (var i = 0; i < this._musice_data.length ; i++) {
                let item = this._musice_data[i];
                this._musice_list.append('<a href="javascript:void(0);"><li>' + item.name + ' - <span>' + item.singer + '</span></li></a>');
            };
        }
        _add_event_listener(obj){
            let self = this;
            obj.on('touchstart', function(evt){self.touchSatrtFunc(evt)});
            obj.on('touchmove', function(evt){self.touchMoveFunc(evt)});
        }
        _speed_btn_add_touch(){
            let self = this;

            this._speed_btn.on('touchstart', function(evt){
                try
                {
                    self._speed_box_left = self._speed_box[0].offsetLeft+4;
                    clearInterval(self._speed_time);
                }
                catch (e) {
                    //alert('touchSatrtFunc：' + e.message);
                }
            });
            this._speed_btn.on('touchmove', function(evt){
                try
                {
                    let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
                        x = Number(touch.pageX), //页面触点X坐标
                        y = Number(touch.pageY); //页面触点Y坐标

                    self._modify_speed_length(x - self._speed_box_left);
                }
                catch (e) {
                    // alert('touchMoveFunc：' + e.message);
                }
            });
            this._speed_btn.on('touchend', function(evt){
                try
                {
                    let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
                        x = Number(touch.pageX), //页面触点X坐标
                        y = Number(touch.pageY); //页面触点Y坐标

                    self._modify_audio_length(x - self._speed_box_left);//修改音乐播放长度
                    self._speed_time = setInterval(function(){
                        self.timing()
                    }, 1);
                }
                catch (e) {
                    // alert('touchMoveFunc：' + e.message);
                }
            });
        }
        _modify_speed_length (startX){
            let sw = this._speed_box.width(),//获取滚动条的宽度
                djwz=(startX/sw)*100;

            this._speed_bar.css('-webkit-transform', "translateX("+djwz+"%)");//改变滚动条的宽度
        }
        _modify_audio_length (startX){
            let sw = this._speed_box.width(),//获取滚动条的宽度
                djwz=startX/sw,
                audio_totle_time = this._js_audio.duration,
                djdsj = djwz*audio_totle_time;
            this._js_audio.currentTime = djdsj;//设置点击播放后跳转的位置
            if(this._in_play){//正在播放的进行播放    
                this._js_audio.play();
            }
        }
        add_event(){
            let self = this;
            $(".diyige a").click(function(){
                self.tag_switch($(this).index());
            });
            //绑定事件 手势切换页面
            this._add_event_listener($('.flex_box'));
            this._add_event_listener($('.zuobian'));
            

            this._play.click(function(){
                if(!self._in_play){
                    self._set_play();
                }else{
                    self._set_pause();
                }
            });

            this._play_prev_btn.click(function(){
                self._index = self._index == 0 ? self._musice_data.length-1 : self._index-1;
                self.musice_switch();
                self._set_play();
            });

            this._play_next_btn.click(function(){
                self._index = self._index == self._musice_data.length-1 ? 0 : self._index+1;
                self.musice_switch();
                self._set_play();
            });

            this._js_audio.addEventListener('ended', function(){//播放完自定下一首
                self._play_next_btn.click();
            });

            //点击列表
            this._musice_list.find('a').click(function(){
                self._index = $(this).index();
                self.musice_switch();
                self._set_play(); 
            });

            //进度条滑动
            this._speed_btn_add_touch();
        }
        _set_play(){
            this._in_play = true;
            this._play.removeClass('btn_play').addClass('btn_pause');
            this._musice_pic.css('-webkit-animation-play-state', 'initial');
            this._js_audio.play();//执行播放
        }
        _set_pause(){
            this._in_play = false;
            this._play.removeClass('btn_pause').addClass('btn_play');
            this._musice_pic.css('-webkit-animation-play-state', 'paused');
            this._js_audio.pause();//执行播放
        }
        touchSatrtFunc(evt){
            try
            {
                //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
                let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
                    x = Number(touch.pageX), //页面触点X坐标
                    y = Number(touch.pageY); //页面触点Y坐标
                //记录触点初始位置
                this.startX = x;
                this.startY = y;

                //var text = 'TouchStart事件触发：（' + x + ', ' + y + '）';
                //document.getElementById("result").innerHTML = text;
            }
            catch (e) {
                //alert('touchSatrtFunc：' + e.message);
            }
        }
        touchMoveFunc(evt){
            try
            {
                let touch = evt.originalEvent.changedTouches[0], //获取第一个触点
                    x = Number(touch.pageX), //页面触点X坐标
                    y = Number(touch.pageY), //页面触点Y坐标
                    index = 0;

                //var text = 'TouchMove事件触发：（' + x + ', ' + y + '）';
                //判断滑动方向
                if(y - this.startY <12 && y - this.startY >-12  ){//上划不阻止滚动条
                     // evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
                }

                if (x - this.startX > 35) {//左划
                   index = 0;
                }else if(x - this.startX < -35){
                    index = 1;
                }
                this.tag_switch(index)
            }
            catch (e) {
                // alert('touchMoveFunc：' + e.message);
            }
        }
        tag_switch (index){
            if(index==0){
                $(".zuobian").css({"-webkit-transform":"translate3d(0, 0px, 0px)", "z-index": "1"});//移动
                $(".youbian").css({"-webkit-transform":"translate3d(100%, 0px, 0px)", "z-index":"0"});//移动
            }else{
                $(".zuobian").css({"-webkit-transform":"translate3d(-100%, 0px, 0px)", "z-index":"0"});//移动
                $(".youbian").css({"-webkit-transform":"translate3d(0, 0px, 0px)", "z-index":"1"});//移动
            }
            $(".diyige a").removeClass("kongzhi_2").end()
                    .eq(index).addClass("kongzhi_2");
        }
        musice_switch (){
            let this_data = this._musice_data[this._index];
            if(this_data){
                this._audio.attr('src', this_data['mp3']);
                this._musice_name_box.html(this_data.name);
                this._musice_singer_box.html(this_data.singer);

                this._musice_bg.css('backgroundImage', 'url(' + this_data['img'] + ')');
                this._musice_pic.attr('src', this_data['img']);

                this._musice_list.find('a').removeClass('danqian');
                this._musice_list.find('a').eq(this._index).addClass('danqian');
                this.get_music_lrc(this_data.lrc || '');
            }
        }
        get_music_lrc(fill){
            let self = this;
            if(fill){
                $.ajax({
                    url: fill,//json文件位置，文件名
                    type: "GET",//请求方式为get
                    dataType: "text", //返回数据格式为json
                    success: function(data) {//请求成功完成后要执行的方法 
                        console.log(data);
                        self.show_musice_lrc(data);
                    },
                    error: function(data){
                        console.log(data);
                    }
                });
            }else{
                this.show_musice_lrc('[00:01:01]该歌曲暂无歌词');
            }
        }
        show_musice_lrc(lrc){
            let self = this;
            //歌词同步
            //这个，存储调节的时间值
            //localStorage是HTML5的新东西
            //localStorage代表着实际歌词时间和lrc歌词时间差
            if(!localStorage.time)
            {
                localStorage.time=0;
            }
            // var musice_lrc="[ti:天下][ar:张杰][al:明天过后][00:01.77]天下[00:06.77]作词：周毅 作曲：刘吉宁[00:11.77]演唱：张杰[00:16.77][00:27.77]烽烟起 寻爱似浪淘沙[00:34.38]遇见她 如春水映梨花[00:41.18]挥剑断天涯 相思轻放下[00:48.00]梦中我 痴痴牵挂[00:53.74][00:55.04]顾不顾将相王侯[00:56.49]管不管万世千秋[00:58.15]求只求爱化解[00:59.94]这万丈红尘纷乱永无休[01:02.35]爱更爱天长地久[01:04.03]要更要似水温柔[01:05.67]谁在乎谁主春秋[01:07.23][01:08.00]一生有爱 何惧风飞沙[01:11.15]悲白发留不住芳华[01:14.90]去江山如画 换她笑面如花[01:18.17]抵过这一生空牵挂[01:21.23]心若无怨 爱恨也随她[01:24.52]天地大 情路永无涯[01:28.02]只为她 袖手天下[01:33.97][02:01.14]顾不顾将[02:03.26]管不管万世千秋[02:04.82]求只求爱化解[02:06.43]这万丈红尘纷乱永无休[02:08.99]爱更爱天长地久[02:10.60]要更要似水温柔[02:12.33]谁在乎谁主春秋[02:14.01][02:14.67]一生有爱 何惧风飞沙[02:17.81]悲白发留不住芳华[02:21.50]抛去江山如画 换她笑面如花[02:24.84]抵过这一生空牵挂[02:27.85]心若无怨 爱恨也随她[02:31.09]天地大 情路永无涯[02:34.58]只为她 袖手天下[02:40.23][02:41.14]一生有爱 何惧风飞沙[02:44.47]悲白发留不住芳华[02:48.14]抛去江山如画 换她笑面如花[02:51.44]抵过这一生空牵挂[02:54.45]心若无怨 爱恨也随她[02:57.77]天地大 情路永无涯[03:01.28]只为她 袖手天下[03:06.75][03:07.68]烽烟起 寻爱似浪淘沙[03:14.37]遇见她 如春水映梨花[03:21.14]挥剑断天涯 相思轻放下[03:27.93]梦中我 痴痴牵挂[03:35.18]美";
            //解析歌词，将时间和歌词分开
            //时间放到shijianshuzu中
            //歌词放到gecishuzu中
            //shijianshuzu[i]就是对应的时间值
            //gecishuzu[i]就是对应的歌词
            //lrc歌词在代码中直接用变量a存储了，可以改
            //这两个数组的长度就是lrc歌词中有多少个类似"[xx:xx.xx]歌词"这样的


            //如果lrc的内容是"[xx:xx.xx]歌词1[yy:yy.yy]歌词二"
            //那str这个数组长度是3
            //str[0]=""
            //str[1]="xx:xx.xx]歌词一"
            //str[2]="yy:yy.yy]歌词二"
            this.shijianshuzu = []; //歌词时间
            let show_lrc_interval = null,
                gecishuzu = [],    //歌词内容
                str = [];
            
            
            str = lrc.split("[");
            //因为str[0]="",所以跳过它
            for(var i=1;i<str.length;i++){
                //str[i]格式是00:11.22]我
                //shijian格式是00:11.22
                var shijian=str[i].split(']')[0];
                //geci格式是"我"
                var geci=str[i].split(']')[1];
                var fen=shijian.split(":")[0];
                var miao=shijian.split(":")[1];
                //xx:xx.xx 时间转换成总的秒数
                var sec=parseInt(fen)*60+parseInt(miao);
                //存时间
                this.shijianshuzu[i-1]=sec-localStorage.time;
                //存歌词
                gecishuzu[i-1]=geci;
            }
            //这段代码本来是用来显示所有歌词的，这里注释掉了，可以掠过不看
            var quanbugeci=document.getElementById("lyricDiv");
            quanbugeci.innerHTML = '';
            for(var i=0;i<this.shijianshuzu.length;i++){
                let gcp=document.createElement("p"),//创建p
                    idname="line_"+i;
                gcp.innerHTML=gecishuzu[i];//加歌词
                gcp.setAttribute("id",idname);//加id名
                quanbugeci.appendChild(gcp);//插入到后面
            }
            //上面是用来显示所有歌词的，不用看
            //定时器，隔1s更新下歌词的显示
            if (show_lrc_interval) clearInterval(show_lrc_interval);
            show_lrc_interval = setInterval(function(){
                self.updategeci();
            },1000);
        }
        getcurrent (){
            //将歌曲实际播放的时间，和我们自己的歌词的时间，进行比较，算出现在应该显示的歌词
            let i=0;
            //152,154存歌词和时间的时候
            //时间是由小到大的
            //当然实际的歌词不一定都是由小到大，还可能是两个时间重复的歌词就合并到一起，其他的情况都没做处理
            for(i=0;i<this.shijianshuzu.length;i++){
                //数和undefined比较，undefined要大些。
                if(this.shijianshuzu[i] >= this._js_audio.currentTime){
                    return i;
                }
            }
            return i-1;
        }
        updategeci (){
            let quanbugeci=document.getElementById("lyricDiv"),
                allp = quanbugeci.getElementsByTagName("p"),//所有的歌词p
                i = this.getcurrent(),//从get函数中传过来的
                lyricDiv = $("#lyricDiv"),
                shijia = 0;
            
            if (allp.length < 2) {//不存在歌词
                lyricDiv.css("-webkit-transform","translate3d(0px ,0px,0px)");
                return;
            }
            shijia = -(i-1)*24;
            for(let qt=0;qt<allp.length;qt++){
                allp[qt].className="";
            }
            allp[i-1].className="current";
            
            lyricDiv.css("-webkit-transform","translate3d(0px ,"+shijia+"px,0px)");
            //-webkit-transform: translate3d(0px, 24px, 0px);
            
        }
        
    }

    window.Musice = Musice;
}();
