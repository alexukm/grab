import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeBaseProvider, Box} from 'native-base';
import {getUserToken,  setUserToken} from "./src/com/evotech/common/appUser/UserConstant";
import UserBottomTabNavigator from "./src/screens/UserBottomTabNavigator";
import DriverBottomTabNavigator from "./src/screens/DriverBottomTabNavigator";
import store from "./src/com/evotech/common/redux/store";
import {Provider} from 'react-redux';
import Home from "./src/screens/Home";
import UserLogin from "./src/screens/UserLogin";
import DriverLogin from "./src/screens/DriverLogin";
import UserSignUp from "./src/screens/UserRegisterForm";
import DriverSignUp from "./src/screens/DriverRegisterForm";
import DriverRegisterImage from "./src/screens/DriverRegisterImage";
import {TextEncoder, TextDecoder} from 'text-encoding';
import {accessToken} from "./src/com/evotech/common/http/BizHttpUtil";
import {getUserInfoWithLocal, userSkipLogin} from "./src/com/evotech/common/appUser/UserInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const Stack = createStackNavigator();

const App = () => {
    const [initialRoute, setInitialRoute] = useState(null);

    const skipOp = (userInfo, skipLogin) => {
        const userSkip = (skipLogin) => {
            return skipLogin ? setInitialRoute("User") : setInitialRoute("UserLogin");
        }
        const driverSkip = (skipLogin) => {
            return skipLogin ? setInitialRoute("Driver") : setInitialRoute("DriverLogin");
        }
        return userInfo.isUser() ? userSkip(skipLogin) : driverSkip(skipLogin);
    }

    const tokenCheck = async (userInfo) => {
        const checkTokenParam = {
            userPhone: userInfo.userPhone,
        };
        await accessToken(checkTokenParam)
            .then(data => {
                setUserToken(data.data)
                skipOp(userInfo, data.code === 200);
            })
            .catch(err => {
                console.error("access Token failed:" + err.message)
                console.error(err)
                return setInitialRoute("Home");
            });
    }
    useEffect(() => {
        // AsyncStorage.clear();
        const checkTokenAndUserType = async () => {
            await userSkipLogin(setInitialRoute, (userInfo) => tokenCheck(userInfo));
        };
        checkTokenAndUserType().then(r => {
        });
    }, []);

    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <Provider store={store}>
                    {initialRoute && <Stack.Navigator
                        initialRouteName={initialRoute}
                        screenOptions={{
                            headerStyle: {backgroundColor: '#FFF'},
                            cardStyle: {backgroundColor: 'transparent'},
                            headerShown: false // 这里添加这行代码
                        }}
                    >
                        <Stack.Screen name="Home" component={Home}/>
                        <Stack.Screen name="User" component={UserBottomTabNavigator}/>
                        <Stack.Screen name="Driver" component={DriverBottomTabNavigator}/>
                        <Stack.Screen name="UserLogin" component={UserLogin}/>
                        <Stack.Screen name="DriverLogin" component={DriverLogin}/>
                        <Stack.Screen name="UserSignUp" component={UserSignUp}/>
                        <Stack.Screen name="DriverSignUp" component={DriverSignUp}/>
                        <Stack.Screen name="DriverRegisterImage" component={DriverRegisterImage}/>
                    </Stack.Navigator>}
                </Provider>
            </NavigationContainer>
        </NativeBaseProvider>
    );
};

export default App;
