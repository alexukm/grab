import React, {createContext, useContext, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {StyleSheet} from 'react-native';
import RemixIcon from 'react-native-remix-icon';

import DriverHomeScreen, {MyContext} from './DriverHomeScreen';
import DriverAcceptListScreen from './DriverAcceptListScreen';
import DriverMessageScreen from "./DriverMessageScreen";
import DriverAccountScreen from "./DriverAccountScreen";
import DriverOrderListScreen from './DriverOrderListScreen';  // 这是新导入的
import DriverAcceptDetailScreen from "./DriverAcceptDetailScreen";
import ChatList from "./ChatList";  // 修改为ChatList
import ChatRoom from "./ChatRoom";

const DriverAcceptDetailNavigator = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();


const DriverBottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({color, size}) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home-line';
                    } else if (route.name === 'Orders') {
                        iconName = 'user-received-fill';
                    } else if (route.name === 'Messages') {
                        iconName = 'message-2-line';
                    } else if (route.name === 'Account') {
                        iconName = 'account-circle-line';
                    }

                    return <RemixIcon name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: 'orange',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: styles.tabBarStyle,
                tabBarItemStyle: styles.tabBarItemStyle,
                tabBarLabelStyle: styles.tabBarLabelStyle,
            })}
        >
            <Tab.Screen name="Home" component={DriverHomeScreen} options={{headerShown: false}}/>
            <Tab.Screen name="Orders" component={DriverAcceptListScreen}/>
            {/*<Tab.Screen name="Messages" component={DriverMessageScreen} />*/}
            <Tab.Screen name="Messages" component={ChatList} options={{headerShown: false}}/>
            <Tab.Screen name="Account" component={DriverAccountScreen}/>
        </Tab.Navigator>


    );
};



const DriverMainNavigatorApp = (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
        <HomeStack.Screen name="Tabs" component={DriverBottomTabNavigator}/>
        <HomeStack.Screen name="DriverOrderListScreen" component={DriverOrderListScreen}
                          options={{headerShown: false}}/>
        <HomeStack.Screen name="DriverAcceptDetails" component={DriverAcceptDetailStackScreen}
                          options={{headerShown: false}}/>
        <HomeStack.Screen name="ChatRoom" component={ChatRoom} options={{headerShown: false}}/>
    </HomeStack.Navigator>
);
const DriverMainNavigator = () => {

    return (
        <HomeStack.Navigator screenOptions={{headerShown: false}}>
            <HomeStack.Screen name="Tabs" component={DriverBottomTabNavigator}/>
            <HomeStack.Screen name="DriverOrderListScreen" component={DriverOrderListScreen}
                              options={{headerShown: false}}/>
            <HomeStack.Screen name="DriverAcceptDetails" component={DriverAcceptDetailStackScreen}
                              options={{headerShown: false}}/>
            <HomeStack.Screen name="ChatRoom" component={ChatRoom} options={{headerShown: false}}/>
        </HomeStack.Navigator>
    );

};

const DriverAcceptDetailStackScreen = () => (
    <DriverAcceptDetailNavigator.Navigator>
        <DriverAcceptDetailNavigator.Screen name="DriverAcceptDetailScreen" component={DriverAcceptDetailScreen}
                                            options={{headerShown: false}}/>
    </DriverAcceptDetailNavigator.Navigator>
);

const styles = StyleSheet.create({
    tabBarStyle: {
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        position: 'absolute',
        height: 60,
    },
    tabBarItemStyle: {
        marginTop: 8,
    },
    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default DriverMainNavigator;
