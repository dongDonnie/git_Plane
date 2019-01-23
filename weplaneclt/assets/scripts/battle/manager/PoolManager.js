var Defines = require('BattleDefines')

const PoolManager = cc.Class({

    statics: {
        instance: null,
        getInstance: function () {
            if (PoolManager.instance == null) {
                PoolManager.instance = new PoolManager();
            }
            return PoolManager.instance;
        },
        destroyInstance() {
            if (PoolManager.instance != null) {
                delete PoolManager.instance;
                PoolManager.instance = null;
            }
        }
    },

    properties: {
        bulletEntityPool: null,
        bulletObjectPool: null,
        monsterEntityPool: null,
        monsterObjectPool: null,
        productlinePool: null,
        buffEntityPool: null,
        buffObjectPool: null,
        sundriesEntityPool: null,
        sundriesObjectPool: null,
        executeEntityPool: null,
        executeObjectPool: null,
    },

    ctor: function () {
        this.bulletEntityPool = new cc.NodePool();
        this.bulletObjectPool = new cc.NodePool();
        this.monsterEntityPool = new cc.NodePool();
        this.monsterObjectPool = {};
        this.productlinePool = new cc.NodePool();
        this.buffEntityPool = new cc.NodePool();
        this.buffObjectPool = {};
        this.sundriesEntityPool = new cc.NodePool();
        this.sundriesObjectPool = new cc.NodePool();
        this.executeEntityPool = new cc.NodePool();
        this.executeObjectPool = {};
    },

    getProductLine: function () {
        let rlt = this.productlinePool.get();

        if (rlt) {
            rlt.reset(false);
        }

        return rlt;
    },

    putProductLine: function (type, line) {
        this.productlinePool.put(line);
    },

    getEntity: function (type) {
        let rlt = null;
        switch (type) {
            case Defines.PoolType.BULLET:
                rlt = this.bulletEntityPool.get();
                break;
            case Defines.PoolType.MONSTER:
                rlt = this.monsterEntityPool.get();
                break;
            case Defines.PoolType.BUFF:
                rlt = this.buffEntityPool.get();
                break;
            case Defines.PoolType.EXECUTE:
                rlt = this.executeEntityPool.get();
                break;
            case Defines.PoolType.SUNDRIES:
                rlt = this.sundriesEntityPool.get();
                break;
        }

        if (rlt) {
            rlt.reset();
        }

        return rlt;
    },

    putEntity: function (type, entity) {
        switch (type) {
            case Defines.PoolType.BULLET:
                this.bulletEntityPool.put(entity);
                break;
            case Defines.PoolType.MONSTER:
                this.monsterEntityPool.put(entity);
                break;
            case Defines.PoolType.BUFF:
                this.buffEntityPool.put(entity);
                break;
            case Defines.PoolType.EXECUTE:
                this.executeEntityPool.put(entity);
                break;
            case Defines.PoolType.SUNDRIES:
                this.sundriesEntityPool.put(entity);
                break;
        }
    },

    getObject: function (type, name) {
        let rlt = null;
        switch (type) {
            case Defines.PoolType.BULLET:
                rlt = this.bulletObjectPool.get();
                break;
            case Defines.PoolType.MONSTER:
                if (typeof name !== 'undefined' && name != '') {
                    if (this.monsterObjectPool[name] != null && typeof this.monsterObjectPool[name] !== 'undefined') {
                        rlt = this.monsterObjectPool[name].get();
                    }
                }
                break;
            case Defines.PoolType.BUFF:
                if (typeof name !== 'undefined' && name != '') {
                    if (this.executeObjectPool[name] != null && typeof this.executeObjectPool[name] !== 'undefined') {
                        rlt = this.buffObjectPool[name].get();
                    }
                }
                break;
            case Defines.PoolType.EXECUTE:
                if (typeof name !== 'undefined' && name != '') {
                    if (this.executeObjectPool[name] != null && typeof this.executeObjectPool[name] !== 'undefined') {
                        rlt = this.executeObjectPool[name].get();
                    }
                }
                break;
            case Defines.PoolType.SUNDRIES:
                rlt = this.sundriesObjectPool.get();
                break;
        }
        return rlt;
    },

    putObject: function (type, object, name) {
        switch (type) {
            case Defines.PoolType.BULLET:
                this.bulletObjectPool.put(object);
                break;
            case Defines.PoolType.MONSTER:
                if (typeof name !== 'undefined' && name != '') {
                    if (typeof this.monsterObjectPool[name] === 'undefined' || this.monsterObjectPool[name] == null) {
                        this.monsterObjectPool[name] = new cc.NodePool();
                    }
                    this.monsterObjectPool[name].put(object);
                }
                break;
            case Defines.PoolType.BUFF:
                if (typeof name !== 'undefined' && name != '') {
                    if (typeof this.buffObjectPool[name] === 'undefined' || this.buffObjectPool[name] == null) {
                        this.buffObjectPool[name] = new cc.NodePool();
                    }
                    this.buffObjectPool[name].put(object);
                }
                break;
            case Defines.PoolType.EXECUTE:
                if (typeof name !== 'undefined' && name != '') {
                    if (typeof this.executeObjectPool[name] === 'undefined' || this.executeObjectPool[name] == null) {
                        this.executeObjectPool[name] = new cc.NodePool();
                    }
                    this.executeObjectPool[name].put(object);
                }
                break;
            case Defines.PoolType.SUNDRIES:
                this.sundriesObjectPool.put(object);
                break;
        }
    },

})