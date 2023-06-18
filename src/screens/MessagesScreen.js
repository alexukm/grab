// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
//
// const MessagesScreen = () => {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.text}>这是消息</Text>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     text: {
//         fontSize: 20,
//         fontWeight: 'bold',
//     },
// });
//
// export default MessagesScreen;
//
//


import React from 'react';
import {View, Text, FlatList, StyleSheet, Button, ScrollView} from 'react-native';
import {TouchableOpacity, Image} from 'react-native';
import {driverAcceptOrder} from "../com/evotech/common/http/BizHttpUtil";

const DriverOrderListScreen = () => {

    const acceptOrder = (orderId) => {
        const acceptParam = {
            userOrderId: 'passer202306181526408689',
        }
        driverAcceptOrder(acceptParam)
            .then(data => {
                if (data.code === 200) {
                    //成功的操作
                    console.log(data.code);
                } else {
                    //失败的操作
                    console.log(data.message);
                }

            }).catch(err => {
            //异常操作
            alert("Accept order error: " + err.message);
        })
    }

    const data = [
        {
            time: '10/06 at 12:56',
            start: 'KIZ UKM SELANGOR',
            destination: 'KLIA SEPANG MALAYSIA',
            price: 'MYR 500',
            note: 'This is a short note.',
            id: '1',
        },
        {
            time: '10/06 at 12:56',
            start: 'KIZ UKM SELANGOR',
            destination: 'KLIA SEPANG MALAYSIA',
            price: 'MYR 500',
            note: 'This is a long note that will be wrapped inside the ScrollView component.',
            id: '2',
        },
        {
            time: '10/06 at 12:56',
            start: 'KIZ UKM SELANGOR',
            destination: 'KLIA SEPANG MALAYSIA',
            price: 'MYR 500',
            note: 'This is a long note that will be wrapped inside the ScrollView component.',
            id: '2',
        },
        {
            time: '10/06 at 12:56',
            start: 'KIZ UKM SELANGOR',
            destination: 'KLIA SEPANG MALAYSIA',
            price: 'MYR 500',
            note: 'Null',
            id: '2',
        },
        {
            time: '10/06 at 12:56',
            start: 'KIZ UKM SELANGOR',
            destination: 'KLIA SEPANG MALAYSIA',
            price: 'MYR 500',
            note: '看见撒谎的雷克萨到了卡了大家埃里克森的距离喀什索拉卡离开洒家立刻撒旦老咔叽卡拉杀了开始就打卢克',
            id: '2',
        },
        // 添加更多的示例订单数据...
    ];
    const renderItem = ({item}) => (
        <View style={styles.itemContainer}>
            <View style={styles.orderInfoContainer}>
                <Text style={styles.timeText}>{item.time}</Text>
                <Text>{item.start}</Text>
                <Text>{item.destination}</Text>
                <Text style={styles.priceText}>{item.price}</Text>
            </View>
            <View style={styles.orderNoteContainer}>
                <ScrollView>
                    <Text>{item.note}</Text>
                </ScrollView>
            </View>
            <TouchableOpacity onPress={acceptOrder}>
                <Image source={require('../picture/accept.png')} style={styles.buttonImage}/>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={styles.divider}/>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    orderInfoContainer: {
        flex: 1,
    },
    orderNoteContainer: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 5,
        maxHeight: 100, // 设置订单备注容器的最大高度
    },
    divider: {
        height: 1,
        backgroundColor: 'gray',
    },
    buttonImage: {
        width: 50,
        height: 50,
    },
    timeText: {
        fontSize: 12, // 更改时间文本的字体大小
    },
    priceText: {
        fontWeight: 'bold', // 将价格文本设置为粗体
    },
});

export default DriverOrderListScreen;
