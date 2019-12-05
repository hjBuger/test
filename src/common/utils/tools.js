let vm = new Vue();
let baseUrl = vm.$planServerUrl;

class WaitRequest {
    get(path, params = {}) {
        return this.createRequest(path, params, 'get');
    }

    post(path, params = {}) {
        return this.createRequest(path, params, 'post');
    }

    put(path, params = {}) {
        return this.createRequest(path, params, 'put');
    }

    delete(path, params = {}) {
        return this.createRequest(path, params, 'delete');
    }

    createRequest(path, params, method = 'get'){
        //检测是否存在http/https,不存在则用baseUrl拼接
        let hasHttp = /http|https/.test(path);
        let url = hasHttp ? path : baseUrl + path;

        //获取协议
        let agreement = url.match(/(http|https):\/\//g)[0];

        //1、获取除了协议之外的路径，并去掉前后空格；2、将多斜杠///转化为单斜杠/；3、将前后单斜杠/转为''
        let handlePath = url.replace(/(^\s*(http|https):\/\/|\s+$)/g,'').replace(/(\/)+/g,'/').replace(/^(\/)+|(\/)+$/g,'');

        //将处理后的路径和协议拼接成处理后的url
        let handleUrl = agreement + handlePath;

        return new Promise((resolve, reject) => {
            vm['$' + method](handleUrl, params, res => resolve(res), err => reject(err));
        })
    }
}