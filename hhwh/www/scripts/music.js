$(function() {
	let player = document.getElementById('voice');
	let rootUr1 = 'https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/uump3/120070116001.mp3';
	let rootUr2 = 'https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/uump3/120100103001.mp3';
	let rootUr3 = 'https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/uump3/120100188001.mp3';
	let rootUr4 = 'https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/uump3/120070106001.mp3';
	let rootUr5 = 'https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/uump3/150150005001.mp3';
	let rootUr6 = 'https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/uump3/120090046002.mp3';

	$("#an1_1").on('click', function() {
		document.getElementById("mcbg").style.backgroundImage =
			"url(https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/appimg/klsw307x307.png)";
		document.getElementById("mcbt").style.backgroundImage = "url(images/pause.png)";
		player.src = rootUr1;
		player.play();
	});
	$("#an1_2").on('click', function() {
		document.getElementById("mcbg").style.backgroundImage =
			"url(https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/appimg/etqwbk1307x307.png)";
		document.getElementById("mcbt").style.backgroundImage = "url(images/pause.png)";
		player.src = rootUr2;
		player.play();
	});
	$("#an2_1").on('click', function() {
		document.getElementById("mcbg").style.backgroundImage =
			"url(https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/appimg/gunboot-kids307x307.png)";
		document.getElementById("mcbt").style.backgroundImage = "url(images/pause.png)";
		player.src = rootUr3;
		player.play();
	});
	$("#an2_2").on('click', function() {
		document.getElementById("mcbg").style.backgroundImage =
			"url(https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/appimg/Bedtime-Story307x307.png)";
		document.getElementById("mcbt").style.backgroundImage = "url(images/pause.png)";
		player.src = rootUr4;
		player.play();
	});
	$("#an3_1").on('click', function() {
		document.getElementById("mcbg").style.backgroundImage =
			"url(https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/appimg/mcdyylyzeg307x307.png)";
		document.getElementById("mcbt").style.backgroundImage = "url(images/pause.png)";
		player.src = rootUr5;
		player.play();
	});
	$("#an3_2").on('click', function() {
		document.getElementById("mcbg").style.backgroundImage =
			"url(https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/appimg/Fun-Kids-Monsters307x307.png)";
		document.getElementById("mcbt").style.backgroundImage = "url(images/pause.png)";
		player.src = rootUr6;
		player.play();
	});
});


$(function() {
	//播放完毕
	$('#voice').on('ended', function() {
		console.log("音频已播放完成");
		$('.loader-container').css('width', '100%');
		$('.mcbt').css({
			'background': 'url(images/pause.png) no-repeat center bottom',
			'background-size': 'cover'
		});
	})
	//播放器控制
	var audio = document.getElementById('voice');
	audio.volume = .100;
	$('.mcbt').click(function() {
		event.stopPropagation(); //防止冒泡:阻止目标元素的事件冒泡到父级元素
		if (audio.paused) { //如果当前是暂停状态
			$('.mcbt').css({
				'background': 'url(images/pause.png) no-repeat center bottom',
				'background-size': 'cover'
			});
			audio.play(); //播放
			/*rotate()*/
			return;
		} else { //当前是播放状态
			$('.mcbt').css({
				'background': 'url(images/start.png) no-repeat center bottom',
				'background-size': 'cover'
			});
			audio.pause(); //暂停
		}
	});

	//获取时长
	//loadedmetadata事件为音频/视频文件加载完数据后触发
	// duration 获取音频的时长，单位为s
	// transTime为封装好的一个函数，目的是将秒转换为几分几秒的格式
	$('#voice').on("loadedmetadata", function() {
		// alert(audio.duration)
		$('#audioTime').text(transTime(this.duration));
	});
	//监听音频播放时间并更新进度条
	audio.addEventListener('timeupdate', updateProgress, false);
})
//转换音频时长分/秒显示
function transTime(time) {
	var duration = parseInt(time);
	var minute = parseInt(duration / 60);
	var sec = duration % 60 + '';
	var isM0 = ':';
	if (minute == 0) {
		minute = '00';
	} else if (minute < 10) {
		minute = '0' + minute;
	}
	if (sec.length == 1) {
		sec = '0' + sec;
	}
	return minute + isM0 + sec
}
//更新进度条
function updateProgress() {
	var audio = document.getElementsByTagName('audio')[0]; //js获取的方式
	var value = Math.round((Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100); //当前时间/总长 再乘以一个100变成百分数
	$('.loader-container').css('width', value * 0.907 + '%'); //0.907 ：进度条div的宽度除以背景img的宽度，如果他们俩的长度一样，就直接value就可以。
	$('.played-time').html(transTime(audio.currentTime));
}
/*
	var rotateVal = 0 // 旋转角度
				var InterVal // 定时器
				window.onload = function () {
					// 网页加载完成后即运行rotate函数
					rotate()
					// 鼠标悬浮在图片上时，停止旋转，即清除定时器
					document.getElementById('mcbt').onmousemove = function () {
						clearInterval(InterVal)
					}
					// 鼠标离开图片时，继续旋转，即继续运行定时器
					
				}
			
				// 设置定时器
				function rotate () {
					InterVal = setInterval(function () {
						var img = document.getElementById('mcbg')
						rotateVal += 1
						// 设置旋转属性(顺时针)
						img.style.transform = 'rotate(' + rotateVal + 'deg)'
						// 设置旋转属性(逆时针)
						//img.style.transform = 'rotate(-' + rotateVal + 'deg)'
						// 设置旋转时的动画  匀速0.1s
						img.style.transition = '0.1s linear'
					}, 15)
				}
				*/
