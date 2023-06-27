// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { VStack, Box, NativeBaseProvider } from "native-base";
//
// import User from "./src/screens/UserLogin";
// import Driver from "./src/screens/DriverLogin";
// import Home from "./src/screens/Home";
// import UserSignUp from "./src/screens/UserRegisterForm";
// import DriverSignUp from "./src/screens/DriverRegisterForm";
// import DriverRegisterImage from "./src/screens/DriverRegisterImage";
// const Stack = createStackNavigator();
// export default function App() {
//   return (
//       <NativeBaseProvider>
//         <Box flex={1} px={0} py={0}>
//           <NavigationContainer>
//             <Stack.Navigator
//                 initialRouteName="Home"
//                 screenOptions={{
//                   headerStyle: { backgroundColor: '#FFF' },
//                   cardStyle: { backgroundColor: 'transparent' }
//                 }}
//             >
//               <Stack.Screen name="Home" component={Home} />
//               <Stack.Screen name="User" component={User} />
//               <Stack.Screen name="Driver" component={Driver} />
//               <Stack.Screen name="UserSignUp" component={UserSignUp} />
//               <Stack.Screen name="DriverSignUp" component={DriverSignUp} />
//               <Stack.Screen name="DriverRegisterImage" component={DriverRegisterImage} />
//
//             </Stack.Navigator>
//           </NavigationContainer>
//         </Box>
//       </NativeBaseProvider>
//   );
// }
//
//
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import UserBottomTabNavigator from "./src/screens/UserBottomTabNavigator";
// import DriveBottomTabNavigator from "./src/screens/DriveBottomTabNavigator";
import DriverBottomTabNavigator from "./src/screens/DriverBottomTabNavigator";
import store from "./src/com/evotech/common/redux/store"
import {Provider} from 'react-redux';
import {TextEncoder, TextDecoder} from 'text-encoding';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


const App = () => {
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <Provider store={store}>
                    <DriverBottomTabNavigator/>
                </Provider>
            </NavigationContainer>
        </NativeBaseProvider>
    );
};

export default App;

