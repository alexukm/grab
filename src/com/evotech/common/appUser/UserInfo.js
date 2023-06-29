import {getValue, setKeyValue} from "./LocalStorageUtil";
import {getUserID, userType} from "./UserConstant";
import {accessToken} from "../http/BizHttpUtil";

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

    isDriver() {
        return this.userType === userType.DRIVER;
    }

    isUser() {
        return this.userType === userType.USER;
    }

}

export async function getUserInfoWithLocal() {
    const userInfoJson = await getValue(userInfoKey);
    const userInfo = JSON.parse(userInfoJson);
    return new UserInfo(userInfo.token, userInfo.userType, userInfo.userPhone, userInfo.identifier)
}

export function buildUserInfo(token, userType, userPhone) {
    return new UserInfo(token, userType, userPhone, getUserID());
}

export async function userSkipLogin(setInitialRoute, tokenCheck) {
    const userInfo = await getUserInfoWithLocal()
    console.log(userInfo)
    if (!isAccessToken(userInfo)) {
        console.log("校验用户信息完整性失败")
        return setInitialRoute("Home");
    }
    console.log("校验用户信息2")
    return await tokenCheck(userInfo);
}

async function tokenCheck(userInfo, setInitialRoute) {
    const checkTokenParam = {
        userPhone: userInfo.userPhone,
    };
    return await accessToken(checkTokenParam).then(data => {
        return skipOp(userInfo, setInitialRoute, data.code === 200);
    }).catch(err => {
        console.error("access Token failed:" + err.message)
        console.error(err)
        return "Home";
    });
}

function skipOp(userInfo, setInitialRoute, skipLogin) {
    const userSkip = (skipLogin) => {
        return skipLogin ? "User" : "UserLogin";
    }
    const driverSkip = (skipLogin) => {
        return skipLogin ? "Driver" : "DriverLogin";
    }
    return userInfo.isUser() ? userSkip(skipLogin) : driverSkip(skipLogin);
}

function isAccessToken(userInfo) {
    return userInfo && userInfo.token && userInfo.userPhone && (userInfo.userType === userType.USER || userInfo.userType === userType.DRIVER);
}
