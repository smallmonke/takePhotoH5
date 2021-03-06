//人脸识别 20190710
var buffer,context;
var video = document.querySelector('#video');
var canvas = document.getElementById("canvas");
var videoWrap = document.getElementById("video-wrap");
var ratio = Math.min(window.devicePixelRatio || 1, 1); // 清除画布
var myConstraints = {
	// 优先调用前置摄像头
	video: {facingMode: 'user'}
}
var faceImg=0;
var cardImg = 0;
$(function () {
	 if(typeof FileReader == "undefined"){
                alert("您的浏览器不支持FileReader对象！");
            }
    showVideo();
});

//统一数据处理
function handleData(data,index,typeId) {
    if(data.backCode == 0){
        switch (index){
            case 1:
                localStorage.setItem('faceImg',data.bean.faceImg);
                layer.msg("识别成功！");
                $(".face-step li").eq(2).addClass('face-red');
                setTimeout(function(){
                    window.location.href = "testDetail.htm?empWeixin="+weixinId+"&testRefOwid="+testOwid;
                },1000);
                closeCamera();
        }
    }else{
        $(".reRec-load").hide();
        layer.msg(data.errorMess);
    }
}

//身份证上传
var reader = new FileReader();
$('.card-face_wrap').on('change','#upload',function(){//图片上传
    var that =$(this).parents(".card-face_wrap");
    var imgType = that.attr('val');
    //var AllowImgFileSize = 2100000; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
    var rd=new FileReader();  //创建文件读取对象
    var file=$(this)[0].files[0];
    //var imgSize = file.size;
    rd.readAsDataURL(file);  //读取类型为base64
    $(this).clone().replaceAll(file=this);
    rd.onload=function (ev) {
            //图片显示且上传
            var str = '<input id="upload"  class="weui-uploader__input" type="file" accept="image/*" multiple=""><img id="imgDetail" src='+this.result+' />';
            that.html(str);
            if(imgType==1){
                $(".face-step li").eq(0).addClass('face-red');
                cardImg = this.result;
            }else if(imgType==2){
                $(".face-step li").eq(1).addClass('face-red');
                faceImg = this.result;
            }
			//alert(imgType+(imgType==1))
            faceMatch();
    }

});



//拍照按钮的单击事件
$('#capture').click(function () {
    //绘制画面
    context.drawImage(video,0,0,video.offsetWidth * 1 ,video.offsetHeight * 1 );
    switch ($(this).find('a').text()){
        case '识别':
            $('#canvas').show();
            $('#video').hide();
            $(this).addClass("reRec").find('a').html('重新识别');
            $(".face-step li").eq(1).addClass('face-red');
            faceImg = 1;
            faceMatch();
            break;
        case '重新识别':
            $('#video').show();
            $('#canvas').hide();
            $(".face-step li").eq(1).removeClass('face-red');
            faceImg = 0;
            $('#video').show();
            $(".reRec-load").hide();
            $(this).removeClass("reRec").find('a').html('识别');
            break;
    }
})

//方法关闭摄像头
function closeCamera() {
    buffer && buffer.getTracks()[0].stop();
}


//人脸比对 已经识只需传人脸照
function faceMatch() {
	//alert(faceImg==0||cardImg==0);
    if(hasLogin&&hasLogin==1){
    }else{
        if(faceImg==0||cardImg==0){
            return;
        }
    }
	//alert("faceImg:"+faceImg);
	//alert("cardImg:"+cardImg);
	
	alert(3333);
    var paramThis = {
        "img1":(canvas.toDataURL('image/png')),
        "img2":cardImg,
        "empWeixin":weixinId
    }
    $('.reRec-load').show();
}



	/* function getUserMedia(constrains, success, error) {
		if (navigator.mediaDevices.getUserMedia) {
			console.log(1);
			//最新标准API
			navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
		} else if (navigator.webkitGetUserMedia) {
			console.log(2);
			//webkit内核浏览器
			navigator.webkitGetUserMedia(constrains).then(success).catch(error);
		} else if (navigator.mozGetUserMedia) {
			console.log(3);
			//Firefox浏览器
			navagator.mozGetUserMedia(constrains).then(success).catch(error);
		} else if (navigator.getUserMedia) {
			console.log(4);
			//旧版API
			navigator.getUserMedia(constrains).then(success).catch(error);
		}
	}
	 */

//显示拍照
function showVideo(){
    canvas.width = video.offsetWidth * ratio;
    canvas.height = 200;
    context = canvas.getContext("2d");
    if(navigator.getUserMedia){
        navigator.mediaDevices.getUserMedia(myConstraints).then((stream) => {
            video.srcObject = stream;
        buffer = stream;
        video.play()
    }, (error) => {
            //ios11 上传图片或者拍照
            $(".unDerIos11").show();
            $(".others").hide();
            console.error(error.name || error)
        })
    }else{
        $(".unDerIos11").show();
        $(".others").hide();
    }
}


