var key="AIzaSyCz4Zl_MIXMjZNfeG14te0xyagE-GW4PjY"
var dataUrl="https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=PLTsu_zOBeI3788ttxT6XJp_0t5k_tuJYn&key="+key+"&maxResults=50";

var listData=[];
var page=0;

var timeOut;
var finishLoad=false;

getNewData(dataUrl);

function getNewData(_dataUrl){
    $.get(_dataUrl, function(_data) {
        getVideoId(_data,_data.nextPageToken);
    });    
}
function getVideoId(_listData,_pageToken){

    $.each(_listData.items,function(i,item){

        var videoData={index:'',title:''.titleLink,id:'',thumbnail:'',time:'',view:'讀取中',like:'讀取中',dislike:'讀取中',dislikePercentage:'',public:false};

        videoData.index=page*50+i;
        videoData.title=item.snippet.title;
        videoData.id=item.contentDetails.videoId;
        videoData.time=item.contentDetails.videoPublishedAt;

        videoData.titleLink=
                '<a href="https://youtu.be/'+videoData.id+
                '" target="_blank" style="color:black;">'+videoData.title+'</a>';

        if(item.status.privacyStatus=="public"){
            videoData.public=true;

            videoData.thumbnail=
                '<a href="https://youtu.be/'+videoData.id+
                '" target="_blank"><img class="video_thumbnail" src="'+item.snippet.thumbnails.high.url+'" alt="YT直播縮圖"></a>';
        }

        listData.push(videoData);
    });
            
    if(_pageToken!=null){
        page++;
        getNewData(dataUrl+"&pageToken="+_pageToken)
    }else{
        //console.log(listData);
        page=0;
        getVideoData();
        timeOut=setInterval(getVideoData,1000*1.55);
    }
}
function getVideoData (){

    var length = (page+1)*5;
    if(length>listData.length-1){
        length=listData.length;
    }
    for(var i= page*5;i<length;i++){
        if(listData[i].public){
            getVideoCount(i,listData[i].id)
        }else{
            listData[i].view="NaN";
            listData[i].like="NaN";
            listData[i].dislike="NaN";
        } 
    }

    page++;//console.log(page*5)
    if(page*5>listData.length){
        console.log('YYDS')
        console.log(listData)
        finishLoad=true;
        clearInterval(timeOut);
    }
}

function getVideoCount(index,_id){
    /*$.get("https://www.googleapis.com/youtube/v3/videos?id="+_id+"&key="+key+"&part=snippet,statistics", function(_data) {
        listData[index].view=_data.items[0].statistics.viewCount;
        listData[index].like=_data.items[0].statistics.likeCount;
    });*/
            
    /*$.get("https://returnyoutubedislikeapi.com/votes?videoId="+_id, function(_data) {
        listData[index].dislike=_data.dislikes;
    });*/
    $.ajax({
        type: "get",
        url: "https://returnyoutubedislikeapi.com/votes?videoId="+_id,
        data: "data",
        dataType: "json",
        success: function (response) {
            listData[index].view=response.viewCount;
            listData[index].like=response.likes;
            listData[index].dislike=response.dislikes;
            var dislikePercentage=Math.round(listData[index].dislike/(listData[index].like+listData[index].dislike)*1000)/10;
            listData[index].dislikePercentage=dislikePercentage;
        },
        error:function(){
            console.log(listData[index].title);
        }
    });
}
