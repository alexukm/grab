import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import RemixIcon from 'react-native-remix-icon';

import DriverHomeScreen from './DriverHomeScreen';
import DriverAcceptListScreen from './DriverAcceptListScreen';
import DriverMessageScreen from "./DriverMessageScreen";
import DriverAccountScreen  from "./DriverAccountScreen";
import DriverOrderListScreen from './DriverOrderListScreen';  // 这是新导入的
import DriverAcceptDetailScreen from "./DriverAcceptDetailScreen";
import SimpleOrderDetailScreen from "./SimpleOrderDetailScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const DriverBottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
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

                    return <RemixIcon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'orange',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: styles.tabBarStyle,
                tabBarItemStyle: styles.tabBarItemStyle,
                tabBarLabelStyle: styles.tabBarLabelStyle,
            })}
        >
            <Tab.Screen name="Home" component={DriverHomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Orders" component={DriverAcceptListScreen} />
            <Tab.Screen name="Messages" component={DriverMessageScreen} />
            <Tab.Screen name="Account" component={DriverAccountScreen} />
        </Tab.Navigator>
    );
};

const DriverMainNavigator = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Tabs" component={DriverBottomTabNavigator} />
        <HomeStack.Screen name="DriverOrderListScreen" component={DriverOrderListScreen} />
        <HomeStack.Screen name="DriverAcceptDetailScreen" component={DriverAcceptDetailStackScreen} options={{ headerShown: false }} />
    </HomeStack.Navigator>
);

const DriverAcceptDetailStackScreen = () => (
    <DriverAcceptDetailScreen.Navigator>
        <SimpleOrderDetailStack.Screen name="DriverAcceptDetailScreen" component={DriverAcceptDetailScreen} />
    </DriverAcceptDetailScreen.Navigator>
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
