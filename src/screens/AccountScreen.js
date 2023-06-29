import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import RemixIcon from 'react-native-remix-icon';

const options = [
    { name: '钱包' },
    { name: '退出' },
    { name: '切换为司机' },
];

const AccountScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWgelHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>ALEX UKM</Text>
            </View>
            {options.map((option, index) => (
                <TouchableOpacity key={index} style={styles.option}>
                    <Text style={styles.optionText}>{option.name}</Text>
                    <RemixIcon name="arrow-right-s-line" size={30} color="#000" />
                </TouchableOpacity>
            ))}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20,
    },
    name: {
        fontSize: 20,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 15,
    },
    optionText: {
        fontSize: 18,
    },
});

export default AccountScreen;
