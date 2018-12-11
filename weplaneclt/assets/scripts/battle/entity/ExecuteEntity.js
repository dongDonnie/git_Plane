const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const ResMapping = require("resmapping")
const BaseEntity = require('BaseEntity')

cc.Class({
    extends: BaseEntity,

    properties: {
        dmgMsg:null,
        hasAllScreenDamage:true,
        damageInterval:1,
    },

    ctor: function () {
        this.reset();
    },

    reset() {
        this._super();
        this.hasAllScreenDamage=true;
        this.damageInterval=0.016;
    },

    newObject() {
        this.baseObject = this.poolManager.getInstance().getObject(Defines.PoolType.EXECUTE, this.objectName);
        if (this.baseObject == null) {
            let prefab = GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/' + this.objectName);
            if (prefab != null) {
                this.baseObject = cc.instantiate(prefab);
            }
        }
        
        if (this.baseObject != null) {
            this.addChild(this.baseObject, 1);
            this.baseObject.getComponent("ExecuteObject").setEntity(this);
            this.baseObject.getComponent("ExecuteObject").animePlay(0);
        }else{
            return -1;
        }

        let item = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', this.objectID);
        if (!!item) {
            this.setScale(item.dScale);
        }
        let z = this._super();
        return z;
    },

    update(dt) {
        this._super(dt);
    },

    setAllScreenDamage:function(yes){
        this.hasAllScreenDamage=typeof yes !=='undefined'?yes:true;
    },
    getAllScreenDamage:function(){
        return this.hasAllScreenDamage;
    },

    setDamageInterval:function(interval){
        this.damageInterval=typeof interval!=='undefined'?interval:0.1;
    },
    getDamageInterval:function(){
        return this.damageInterval;
    },
    
});