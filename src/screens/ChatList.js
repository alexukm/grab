import React  from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import { useSelector} from "react-redux";
import {selectChatList} from "../com/evotech/common/redux/chatSlice";


export default function ChatList({navigation}) {
    const chatList = useSelector(selectChatList);

    const openChat = (item) => {
        navigation.navigate('ChatRoom', {
            receiverName: item.title,
            receiverUserCode: item.userCode,
        });
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Chats</Text>
            </View>
            <FlatList
                data={Object.values(chatList)}
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
