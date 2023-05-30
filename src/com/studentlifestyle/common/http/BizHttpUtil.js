import {HttpUtil, SupportContextType} from "./HttpUtil";

const request = new HttpUtil(5000, true);


const supportRequestMethod = {
    POST: 'POST',
    GET: 'GET'
}

const featureAndPath = {

    //用户登录
    USER_LOGIN: {method: supportRequestMethod.POST, path: '/v1/ums/api/user/login'},

    //用户注册
    USER_REGISTER: {method: supportRequestMethod.POST, path: '/v1/ums/api/user/register'},

    //用户登出
    USER_LOGOUT: {method: supportRequestMethod.POST, path: '/v1/ums/api/user/logOut'},

    //司机证件上传
    DRIVER_UPLOAD: {method: supportRequestMethod.POST, path: '/v1/ums/api/driver/upload'},

    // 司机信息补全
    DRIVER_SUPPLY_INFO: {method: supportRequestMethod.POST, path: '/v1/ums/api/driver/supplyInfo'},

    //司机注册
    DRIVER_REGISTER: {method: supportRequestMethod.POST, path: '/v1/ums/api/driver/register'},

    //司机登录
    DRIVER_LOGIN: {method: supportRequestMethod.POST, path: '/v1/ums/api/driver/login'},

    //司机注销
    DRIVER_LOGOUT: {method: supportRequestMethod.POST, path: '/v1/ums/api/driver/logOut'},

    //发送短信验证码
    SMS_SEND: {method: supportRequestMethod.GET, path: '/v1/sys/api/sms/send'},

    //刷新token
    ACCESS_TOKEN: {method: supportRequestMethod.POST, path: '/v1/auth/api/token/access_token'},

}

export function userRegistry(params = {}) {
    return request.post(featureAndPath.USER_REGISTER.path, SupportContextType.APPLICATION_JSON, {params: params})
}

export function driverRegister(params = {}) {
    return request.post(featureAndPath.DRIVER_REGISTER.path, SupportContextType.APPLICATION_JSON, {params: params})
}

export function userLogin(params = {}) {
    return request.post(featureAndPath.USER_LOGIN.path, SupportContextType.APPLICATION_JSON, {params: params})
}


export function smsSend(userPhone) {
    const params = {
        phoneNumber: userPhone
    }
    return request.get(featureAndPath.SMS_SEND.path, params)
}

export function driverLogout() {
    return request.post(featureAndPath.DRIVER_LOGOUT.path)
}

export function accessToken(params = {}) {
    return request.post(featureAndPath.ACCESS_TOKEN.path, SupportContextType.APPLICATION_JSON, {params: params})
}

// export function driverUpload(params = {}) {
//     const formData = new FormData();
//     const fileContent = [
//         "const message = 'Hello, World!';",
//         "",
//         "function greet() {",
//         "  console.log(message);",
//         "}",
//         "",
//         "greet();"
//     ];
//     formData.append('file', fileContent);
//     formData.append('uploadType', '0');
//     formData.append('userPhone', '13515265477');
//     return request.postFromData(featureAndPath.DRIVER_UPLOAD.path, SupportContextType.MULTIPART_FROM, formData)
// }

export function driverUpload(file,params) {
    // let formData = new FormData();
  const  formData = new FormData();
    formData.append('file', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: file
    });
    // const file1 = new File([file], "filename.jpeg");
    // formData.append('file', file1)
    const requestURL = featureAndPath.DRIVER_UPLOAD.path + `?uploadType=${params['uploadType']}&userPhone=${params['userPhone']}`;
    return request.postFromData(requestURL, SupportContextType.MULTIPART_FROM, {formData: formData});
}

export function driverLogin(params = {}) {
    return request.post(featureAndPath.DRIVER_LOGIN.path, SupportContextType.APPLICATION_JSON, {params: params})
}
