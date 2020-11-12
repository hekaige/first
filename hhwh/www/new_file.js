< script >


	$(document).ready(function() {



		function getQueryString(id) {
			var reg = new RegExp("(^|&)" + id + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURI(r[2]);
			return null;
		}
		var a = getQueryString("id");
		console.log(a);
		$.ajax({
			url: "http://118.31.45.118:8888/lvyou-ssm01/user/appfxsp?id=" + a + "", //某大佬提供的api希望一直有效
			dataType: "json", //数据格式
			type: "post", //请求方式
			async: false, //是否异步请求
			success: function(data) {
				console.log(data);
				console.log(data.img);
				//如果请求成功，返回数据。
				var item = "";
				var item = "";




				item += "  <source id='musik' src='https://leadjoy2019.oss-cn-hangzhou.aliyuncs.com/uump3/" + data.links +
					"' type='audio/mpeg'> ";
				item += " 您的浏览器不支持 audio 元素。";



				$("#voice").html(item);
			}
		})
	})



	</script>
