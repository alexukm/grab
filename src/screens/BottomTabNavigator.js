import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import RemixIcon from 'react-native-remix-icon';

import HomeScreen from './HomeScreen';
import RideStatusScreen from './RideStatusScreen';
import MessagesScreen from './MessagesScreen';
import AccountScreen from './AccountScreen';
import OrderDetailScreen from './OrderDetailScreen';
import RideOrderScreen from './RideOrderScreen';


const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

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
            <Tab.Screen name="HomeTab">
                {() => (
                    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                        <HomeStack.Screen name="Home" component={HomeScreen} />
                        <HomeStack.Screen
                            name="OrderDetailScreen"
                            component={OrderDetailScreen}
                            options={{ headerShown: true }}
                        />
                        <HomeStack.Screen
                            name="RideOrderScreen"
                            component={RideOrderScreen}
                            options={{ headerShown: true }}
                        />
                    </HomeStack.Navigator>
                )}
            </Tab.Screen>
            <Tab.Screen name="Activity" component={RideStatusScreen} />
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
