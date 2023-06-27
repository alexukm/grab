import React, {useContext, useEffect} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import uuid from "react-native-uuid";


export default function ChatList({navigation}) {

    const chats = [
        {
            id: '1',
            // sendUserCode: '',
            // userName: '',
            title: '聊天 1',
            message: 'Hello',
            time: '18:30',
            unread: 2,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWgelHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
        }
    ];

  /*  const repBody = null;

    map.put('sendUserCode', chats);
    const userCode = repBody.requestUserCode;

    const chatsContext = map.get(userCode);
    // 如果存在
    if (chatsContext) {
        //获取聊天内容
        const context = chatsContext.context;
        if (context) {
            //将当前的消息 追加到context
        } else {
            chatsContext.context = [];
        }

    } else {
        //第一次聊天
        // 构建chats
        map.put(userCode, chats);
    }*/

    //发布事件  聊天信息更新的事件

    // 订阅 更新聊天列表 和 聊天窗口信息

    const openChat = (item) => {
        navigation.navigate('ChatRoom', {
            startName: '',
            responseUserCode: '',
            context: '',
        });
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Chats</Text>
            </View>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={styles.chatItem}
                        onPress={() => openChat(item)}
                    >
                        <Image source={{uri: item.avatar}} style={styles.avatar}/>
                        <View style={styles.chatInfo}>
                            <Text style={styles.chatTitle}>{item.title}</Text>
                            <Text style={styles.chatMessage}>{item.message}</Text>
                        </View>
                        <View style={styles.chatMeta}>
                            <Text style={styles.chatTime}>{item.time}</Text>
                            {item.unread > 0 &&
                                <View style={styles.badge}><Text style={styles.badgeText}>{item.unread}</Text></View>}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        marginVertical: 20, // 增加顶部和底部的间距
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black', // 设置字体颜色为黑色
    },
    chatItem: {
        flexDirection: 'row',
        marginVertical: 10, // 调整垂直间距
        paddingBottom: 10, // 添加底部内边距
        alignItems: 'center',
        borderBottomWidth: 1, // 添加底部边框
        borderBottomColor: '#ccc', // 边框颜色为灰色
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    chatInfo: {
        flex: 1,
        marginLeft: 10,
    },
    chatTitle: {
        fontWeight: 'bold',
    },
    chatMessage: {
        color: 'grey',
    },
    chatMeta: {
        marginLeft: 10,
        alignItems: 'flex-end',
    },
    chatTime: {
        color: 'grey',
    },
    badge: {
        marginTop: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
    },
});
