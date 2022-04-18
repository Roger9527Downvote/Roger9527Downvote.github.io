var key="AIzaSyCz4Zl_MIXMjZNfeG14te0xyagE-GW4PjY"
channelId='UCiEm9noegBIb-AzjqpxKffA'
var dataUrl='';

var listData=[];var page=0;

var timeOut;

getChannel();

function getChannel(){
    $.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id='+channelId+'&key='+key, function(_data) {
        dataUrl='https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId='+_data.items[0].contentDetails.relatedPlaylists.uploads+'&key='+key+'&maxResults=50'
        getNewData(dataUrl);
    })
    
}
function getNewData(_dataUrl){
    $.get(_dataUrl, function(_data) {
        //console.log(_data)
        getVideoId(_data,_data.nextPageToken);
    });    
}
function getVideoId(_listData,_pageToken){

    $.each(_listData.items,function(i,item){

        var videoData={index:'',title:''.titleLink,id:'',thumbnail:'',time:'',view:'讀取中',like:'讀取中',dislike:'讀取中',dislikePercentage:'計算中',public:false};

        videoData.index=page*50+i;
        videoData.title=item.snippet.title;
        videoData.id=item.contentDetails.videoId;
        videoData.time=item.contentDetails.videoPublishedAt;
        videoData.link='https://youtu.be/'+videoData.id;

        if(item.status.privacyStatus=="public"){
            videoData.public=true;
            videoData.thumbnail=item.snippet.thumbnails.high.url;
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
        timeOut=setInterval(getVideoData,1000*0.65);
    }
}
function getVideoData (){

    var length = (page+1)*2;
    if(length>listData.length-1){
        length=listData.length;
    }
    for(var i= page*2;i<length;i++){
        if(listData[i].public){
            getVideoCount(i,listData[i].id)
        }else{
            listData[i].view="NaN";
            listData[i].like="NaN";
            listData[i].dislike="NaN";
        }
        vm.load++;
    }

    page++;//console.log(page*2)
    if(page*2>listData.length){
        vm.finish=true;
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
            listData[index].view='錯誤';
            listData[index].like='錯誤';
            listData[index].dislike='錯誤';
            var dislikePercentage='錯誤';
            listData[index].dislikePercentage=dislikePercentage;
            console.log(listData[index].title);
        }
    });
}