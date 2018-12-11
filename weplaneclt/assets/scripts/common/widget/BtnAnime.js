cc.Class({
    extends: cc.Component,

    properties: {
        animeCallBack:{
            default:null,
            visible:false,
        }
    },

    onLoad(){

    },

    start () {

    },

    setCallBack(callback){
        if(!!callback){
            this.animeCallBack=callback;
        }
    },

    btnCallBack(name){
        if(name=='yellow'){
            if(this.animeCallBack!=null){
                this.animeCallBack();
            }
        }else if(name=='orange'){

        }
    }
});
