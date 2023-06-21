import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DriverMessageScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>这是司机消息页面</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default DriverMessageScreen;
