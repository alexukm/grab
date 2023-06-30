import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import RemixIcon from 'react-native-remix-icon';

const options = [
    { name: '钱包' },
    { name: '分享' },
    { name: '切换为司机' },
    { name: '人工客服' },
    { name: '计价规则' },
    { name: '退出' },
];

const AccountScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../picture/acc_bg.png')} style={styles.background}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWgelHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>Alex UKM</Text>
                </View>
                <View style={styles.curveMask} />
            </ImageBackground>
            <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                    <TouchableOpacity key={index} style={styles.option}>
                        <Text style={styles.optionText}>{option.name}</Text>
                        <RemixIcon name="arrow-right-s-line" size={25} color="#000" />
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
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
        fontWeight: 'bold',
        color: '#ffffff',
    },
    optionsContainer: {
        flex: 2,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
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
        fontSize: 14,
    },
    curveMask: {
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width,
        height: 30, // Or the height of your curve
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
});

export default AccountScreen;
