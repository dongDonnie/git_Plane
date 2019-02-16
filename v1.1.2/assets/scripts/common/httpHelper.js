 
 var HttpHelper = module.exports;
 /**
     * get请求
     * @param {string} url 
     * @param {function} callback 
     */
    HttpHelper.httpGet = function(url, callback) {
        console.log("open url:", url);
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status == 200) {
                console.log("onreadystatechange事件:", xhr);
                let respone = xhr.responseText;
                let rsp = JSON.parse(respone);
                callback(rsp);
            } else if (xhr.readyState === 4 && xhr.status == 401) {
                callback({status:401});
            } else {
                //callback(-1);
            }
        };
        xhr.send();
    },

    /**
     * post请求
     * @param {string} url 
     * @param {object} params 
     * @param {function} callback 
     */
    HttpHelper.httpPost = function(url, params, callback) {
        // cc.myGame.gameUi.onShowLockScreen();
        console.log("open url:", url);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        // xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with, Content-Type');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        //xhr.timeout = 5000;// 8 seconds for timeout
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status == 200) {
                console.log("onreadystatechange事件", xhr);
                let respone = xhr.responseText;
                let rsp = JSON.parse(respone);
                // cc.myGame.gameUi.onHideLockScreen();
                callback(rsp);
            } else {
                // callback(-1);
            }
        };
        //var formData = new FormData();
        let newParam = "";
        for (let i in params){
            console.log("key:", i, ", value:", params[i]);
            //formData.append(i, params[i]);
            newParam = newParam + i;
            newParam = newParam + "=" + params[i];
            newParam = newParam + "&";
        }
        // formData.append("_f","wyw");
        newParam = newParam.substr(0, newParam.length - 1);

        console.log("send data:", newParam);
        xhr.send(newParam);
    }
