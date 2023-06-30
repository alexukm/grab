import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import RemixIcon from 'react-native-remix-icon';

import UserHomeScreen from './UserHomeScreen';
import OrderListScreen from "./OrderListScreen";
import AccountScreen from './AccountScreen';
import OrderDetailScreen from './OrderDetailScreen';
import RideOrderScreen from './RideOrderScreen';
import SimpleOrderDetailScreen from './SimpleOrderDetailScreen';
import ChatList from "./ChatList";


const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const OrderStack = createStackNavigator();
const SimpleOrderDetailStack = createStackNavigator();

const OrderStackScreen = () => (
    <OrderStack.Navigator screenOptions={{ headerShown: false }}>
        <OrderStack.Screen name="RideOrderScreen" component={RideOrderScreen} />
        <OrderStack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
    </OrderStack.Navigator>
);

const SimpleOrderDetailStackScreen = () => (
    <SimpleOrderDetailStack.Navigator screenOptions={{ headerShown: false }}>
        <SimpleOrderDetailStack.Screen name="SimpleOrderDetailScreen" component={SimpleOrderDetailScreen} />
    </SimpleOrderDetailStack.Navigator>
);

const UserBottomTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                    iconName = 'home-line';
                } else if (route.name === 'Activity') {
                    iconName = 'car-line';
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
            headerShown: false,
        })}
    >
        <Tab.Screen name="Home" component={UserHomeScreen} />
        <Tab.Screen name="Activity" component={OrderListScreen} />
        {/*<Tab.Screen name="Messages" component={MessagesScreen} />*/}
        <Tab.Screen name="Messages" component={ChatList}/>
        <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
);

const MainNavigator = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Tabs" component={UserBottomTabNavigator} />
        <HomeStack.Screen name="Orders" component={OrderStackScreen} />
        <HomeStack.Screen name="SimpleOrderDetails" component={SimpleOrderDetailStackScreen} />
    </HomeStack.Navigator>
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

export default MainNavigator;
