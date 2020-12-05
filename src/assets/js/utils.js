class Utils {

    // 序列化参数
    queryString(o){
        let params = '';
        for (const key in o) {
            params += `${key}=${o[key]}&`;
        }

        // 去除最后一个&
        return params.slice(0,-1)
    }
}

export const utils = new  Utils