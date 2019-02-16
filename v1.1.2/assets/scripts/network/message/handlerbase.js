var requestService = require('requestservice')
// const DEFAULT_METHOD = "POST";
// const GET_METHOD = "GET";
// const httpHelper = require('httpHelper');

var HandlerBase = cc.Class({
    ctor: function() {
    },

    initHandler: function() {

    },

    unInitHandler: function() {

    },

    sendMsg: function(msgid, msg) {
        requestService.getInstance().addRequest(msgid, msg);
    },

    // request: function (url, data, successCallback, failCallback, method = DEFAULT_METHOD) {
    //     if (method == DEFAULT_METHOD){
    //         httpHelper.httpPost(url, data, function (res) {
    //             if (res === -1){
    //                 console.log("get fail data:", res);
    //                 console.log("request from " + url + " failed!");
    //                 if (failCallback) {
    //                     failCallback(res);
    //                 }
    //             }else{
    //                 // if (res.statusCode == 200) {
    //                     console.log("get success data:", res);
    //                     console.log("request from " + url + " success!");
    //                     if (successCallback) {
    //                         successCallback(res);
    //                     }
    //                 // }
    //             }
    //         })
    //     }else if (method == GET_METHOD){
            
    //         console.log("getgetgetget");
    //         httpHelper.httpGet(url, function (res) {
    //             console.log("get response:", res);
    //             if (res.status === 401){
    //                 console.log("get fail data:", res);
    //                 console.log("request from " + url + " failed!");
    //                 if (failCallback) {
    //                     failCallback(res);
    //                 }
    //             }else{
    //                 // if (res.statusCode == 200) {
    //                 console.log("get success data:", res);
    //                 console.log("request from " + url + " success!");
    //                 if (successCallback) {
    //                     successCallback(res);
    //                 }
    //                 // }
    //             }
    //         })
    //     }
    // },

});

module.exports = HandlerBase;
