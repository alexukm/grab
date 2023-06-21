import {getValue, setKeyValue} from "./LocalStorageUtil";
import {defaultHeaders} from "../http/HttpUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserOrigin = {APP: 0}
export const UserPlatform = {Android: 1, IOS: 2,}

export const userType = {USER: 0, DRIVER: 1}

const CarType = {
    Sedan: 0,
    SUV: 1,
    Sports: 2,
    Van: 3,
    Convertible: 4
}

export const DriverImageType = {
    //自拍
    Selfie: 0,
    //车保信息
    Vehicle_Insurance: 1,
    //身份证 正面
    NRIC_FRONT: 2,
    //身份证 反面
    NRIC_BACK: 3,
    //护照
    Passport: 4,
    //驾照
    License: 5,
}

export function getUserID() {
    return "123";
}

export function getUserType() {
    return 0;
}

export function setUserToken(token) {
    setKeyValue(defaultHeaders.TOKEN, token);
}


export async function getUserToken() {
    return "Bearer 5b2b1073bdc9060e8560585eb7a65653";
    // return "Bearer c2bed56d816fe9500391a86212e548c6";
    // await getValue(defaultHeaders.TOKEN)
}
