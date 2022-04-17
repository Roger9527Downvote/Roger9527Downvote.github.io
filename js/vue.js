new Vue({
    el:'#app',
    data: {
        list:listData,
        finish:finishLoad,

        length:listData.length,
        load:page,

        a:0,
        b:99,
        
        listA:[
            {value:'time',item:'上傳時間'},
            {value:'like',item:'正讚量'},
            {value:'dislike',item:'倒讚量'},
            {value:'dislikePercent',item:'倒讚比例'},
        ],
        selectValA:'time',

        listB:[
            {value:0,item:'高到低'},
            {value:1,item:'低到高'},
        ],
        selectValB:0, 
    },
    methods:{
        selectA:function(){
            this.selectValA=$('#a').val();
            sortList(this.selectValA,this.selectValB);
        },
        selectB:function(){
            this.selectValB=$('#b').val();
            sortList(this.selectValA,this.selectValB);
        }
    },
})

function sortList(_a,_b){
    listData = listData.sort(function (a, b) {

        if(_a=='time'){
            if(_b==0){
                return a.index > b.index ? 1 : -1;
            }else{
                return a.index < b.index ? 1 : -1;
            }
        }else if(_a=='like'){
            if(_b==0){
                return a.like < b.like ? 1 : -1;
            }else{
                return a.like > b.like ? 1 : -1;
            }
        }else if(_a=='dislike'){
            if(_b==0){
                return a.dislike < b.dislike ? 1 : -1;
            }else{
                return a.dislike > b.dislike ? 1 : -1;
            }
        }else{
            if(_b==0){
                return a.dislikePercentage < b.dislikePercentage ? 1 : -1;
            }else{
                return a.dislikePercentage > b.dislikePercentage ? 1 : -1;
            }
        }
    });
}
