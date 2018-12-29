const Defines = require('BattleDefines')
const GlobalVar = require('globalvar')
const ResMapping = require("resmapping")
const BaseEntity = require('BaseEntity')
const BattleManager = require('BattleManager')

cc.Class({
    extends: BaseEntity,

    properties: {
        disappearAnime: false,
        disappearPos: cc.v3(0, 0),
        dmgMsg: null,
    },

    ctor: function () {
        this.reset();
    },

    reset() {
        this._super();
        this.disappearAnime = false;
        this.disappearPos = cc.v3(0, 0);
    },

    getPathName: function (path) {
        let index = path.lastIndexOf('.');
        let folderPath = "";
        if (index != -1) {
            folderPath = path.substring(0, index);
        } else {
            folderPath = path;
        }
        return folderPath;
    },

    newObject() {
        let item = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', this.objectID);
        if (!item) {
            return -1;
        }

        let needAnime = item.strName.indexOf(".");
        this.baseObject = this.poolManager.getInstance().getObject(Defines.PoolType.BULLET);
        if (this.baseObject == null) {
            this.baseObject = new cc.Node();
            let sp = this.baseObject.addComponent(cc.Sprite);
            let collider = this.baseObject.addComponent(cc.BoxCollider);
            if (needAnime == -1) {
                let anime = this.baseObject.addComponent(cc.Animation);
                let animeBulletList = [];
                for (let index = 1; index < 10; index += 2) {
                    let animeFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/animebullets/' + item.strName + '/' + item.strName + '_000' + index);
                    if (animeFrame != null) {
                        animeBulletList.push(animeFrame);
                    }
                }
                let clip = cc.AnimationClip.createWithSpriteFrames(animeBulletList, animeBulletList.length);
                clip.name = item.strName;
                clip.wrapMode = cc.WrapMode.Loop;
                anime.addClip(clip);
                let animState = anime.play(item.strName);
                animState.speed = 3;
                collider.size = cc.size(animeBulletList[0].getRect().width * 0.9, animeBulletList[0].getRect().height * 0.9);
            } else {
                let folderPath = this.getPathName(item.strName);
                sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/bullets/' + folderPath);
                collider.size = cc.size(this.baseObject.getContentSize().width * 0.9, this.baseObject.getContentSize().height * 0.9);
            }
        } else {
            if (needAnime == -1) {
                let anime = null;
                if (this.baseObject.getComponent(cc.Animation) == null) {
                    anime = this.baseObject.addComponent(cc.Animation);
                } else {
                    anime = this.baseObject.getComponent(cc.Animation);
                }
                let clips = anime.getClips();
                let index = -1;
                for (let key in clips) {
                    if (clips[key].name == item.strName) {
                        index = key;
                        break;
                    }
                }
                if (index != -1) {
                    let animState = anime.play(item.strName);
                    animState.speed = 3;
                } else {
                    let animeBulletList = [];
                    for (let index = 1; index < 10; index += 2) {
                        let animeFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/animebullets/' + item.strName + '/' + item.strName + '_000' + index);
                        if (animeFrame != null) {
                            animeBulletList.push(animeFrame);
                        }
                    }
                    let clip = cc.AnimationClip.createWithSpriteFrames(animeBulletList, animeBulletList.length);
                    clip.name = item.strName;
                    clip.wrapMode = cc.WrapMode.Loop;
                    anime.addClip(clip);
                    let animState = anime.play(item.strName);
                    animState.speed = 3;
                }
            } else {
                if (this.baseObject.getComponent(cc.Animation) != null) {
                    let anime = this.baseObject.getComponent(cc.Animation);
                    anime.stop();
                }
                let sp = this.baseObject.getComponent(cc.Sprite);
                let collider = this.baseObject.getComponent(cc.BoxCollider);
                let folderPath = this.getPathName(item.strName);
                sp.spriteFrame = GlobalVar.resManager().loadRes(ResMapping.ResType.SpriteFrame, 'cdnRes/bullets/' + folderPath);
                collider.size = cc.size(this.baseObject.getContentSize().width * 0.9, this.baseObject.getContentSize().height * 0.9);
            }
        }

        this.setScale(item.dScale);
        this.addChild(this.baseObject, 1);
        let z = this._super();

        return z;
    },

    deleteObject: function () {
        this._super();
        if (this.baseObject.getComponent(cc.Animation) != null) {
            let anime = this.baseObject.getComponent(cc.Animation);
            anime.stop();
        }
        if (this.disappearAnime) {
            this.setMovementType(-1);
            var self = this;
            if (this.objectType == Defines.ObjectType.OBJ_HERO_BULLET) {
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/HeroBulletHit', function (prefab) {
                    if (prefab != null) {
                        let hit = cc.instantiate(prefab);
                        BattleManager.getInstance().displayContainer.addChild(hit, Defines.Z.HEROBULLETHIT);
                        hit.runAction(cc.sequence(cc.delayTime(0.4), cc.removeSelf(true)));
                        hit.setPosition(self.disappearPos);
                    }
                });
            } else {
                GlobalVar.resManager().loadRes(ResMapping.ResType.Prefab, 'cdnRes/battlemodel/prefab/effect/MonsterBulletClear', function (prefab) {
                    if (prefab != null) {
                        let clear = cc.instantiate(prefab);
                        BattleManager.getInstance().displayContainer.addChild(clear, Defines.Z.MONSTERBULLETCLEAR);
                        clear.runAction(cc.sequence(cc.delayTime(0.6), cc.removeSelf(true)));
                        clear.setPosition(self.disappearPos);
                    }
                });
            }
        }
        this.zIndex = 0;
    },

    pauseAction() {
        if (this.baseObject != null) {
            if (this.baseObject.getComponent(cc.Animation) != null) {
                let anime = this.baseObject.getComponent(cc.Animation);
                anime.stop();
            }
        }
    },

    resumeAction() {
        if (this.baseObject != null) {
            let item = GlobalVar.tblApi.getDataBySingleKey('TblBattleBullet', this.objectID);
            if (this.baseObject.getComponent(cc.Animation) != null && item.strName.indexOf(".") == -1) {
                let anime = this.baseObject.getComponent(cc.Animation);
                let animState = anime.play(item.strName);
                animState.speed = 3;
            }
        }
    },
});