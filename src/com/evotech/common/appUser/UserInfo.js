import {getValue, setKeyValue} from "./LocalStorageUtil";

const userInfoKey = 'userInfo';

export class UserInfo {
    constructor(token, userType, userPhone, identifier) {
        this.token = token;
        this.userType = userType;
        this.userPhone = userPhone;
        this.identifier = identifier;

    }

    saveWithLocal() {
        const userInfoJson = JSON.stringify(this);
        setKeyValue(userInfoKey, userInfoJson).then(() => {
            console.log(this.userPhone + ": user info set successfully")
        }).catch(err => {
            console.log(this.userPhone + ": user info set failed")
        });
    }
}
export async function getUserInfoWithLocal() {
    const userInfoJson = await getValue(userInfoKey);
    return JSON.parse(userInfoJson);
}
export function buildUserInfo(token, userType, userPhone, identifier) {
    return new UserInfo(token, userType, userPhone, identifier);
}
