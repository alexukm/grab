import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import RemixIcon from 'react-native-remix-icon';

import HomeScreen from './HomeScreen';
import OrderListScreen from "./OrderListScreen";
import MessagesScreen from './MessagesScreen';
import AccountScreen from './AccountScreen';
import OrderDetailScreen from './OrderDetailScreen';
import RideOrderScreen from './RideOrderScreen';
import SimpleOrderDetailScreen from './SimpleOrderDetailScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const OrderStack = createStackNavigator();  // 创建一个新的 StackNavigator
const SimpleOrderDetailStack = createStackNavigator();


// 创建 OrderStack
const OrderStackScreen = () => {
    return (
        <OrderStack.Navigator screenOptions={{ headerShown: false }}>
            <OrderStack.Screen name="RideOrderScreen" component={RideOrderScreen} />
            <OrderStack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
        </OrderStack.Navigator>
    );
};

const SimpleOrderDetailStackScreen = () => (
    <SimpleOrderDetailStack.Navigator>
        <SimpleOrderDetailStack.Screen name="SimpleOrderDetailScreen" component={SimpleOrderDetailScreen} />
    </SimpleOrderDetailStack.Navigator>
);

const BottomTabNavigator = () => {
    return (
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
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Activity" component={OrderListScreen} options={{ headerShown: false }}/>
            <Tab.Screen name="Messages" component={MessagesScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
};

const MainNavigator = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Tabs" component={BottomTabNavigator} />
        <HomeStack.Screen name="Orders" component={OrderStackScreen} options={{ headerShown: false }} />
        <HomeStack.Screen name="SimpleOrderDetails" component={SimpleOrderDetailStackScreen} options={{ headerShown: false }} />
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
