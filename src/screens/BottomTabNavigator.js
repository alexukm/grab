import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import RemixIcon from 'react-native-remix-icon'; // 更改为RemixIcon

import HomeScreen from './HomeScreen';
import RideStatusScreen from './RideStatusScreen';
import MessagesScreen from './MessagesScreen';
import AccountScreen from './AccountScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home-line';
                    } else if (route.name === 'Ride Status') {
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
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Ride Status" component={RideStatusScreen} />
            <Tab.Screen name="Messages" component={MessagesScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
};

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

export default BottomTabNavigator;
