import React, {useCallback, useState, useRef} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Linking, Platform} from 'react-native';
import {Box, HStack} from 'native-base';
import defaultClient from "../com/evotech/common/websocket/WebSocketClient";
import {defaultHeaders} from "../com/evotech/common/http/HttpUtil";
import {getUserToken} from "../com/evotech/common/appUser/UserConstant";
import {carpoolingOrdersQuery, driverAcceptOrder} from "../com/evotech/common/http/BizHttpUtil";
import {useFocusEffect} from "@react-navigation/native";
import {err} from "react-native-svg/lib/typescript/xml";


const DriverOrderListScreen = () => {
    const [rideOrders, setRideOrders] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [refreshing, setRefreshing] = useState(false);

    const [updateFlag, setUpdateFlag] = useState(false); // 添加这个状态

    const clientRef = useRef(); // 添加一个 ref 用来存储 client



    const queryOrders = (pageSize, page) => {
        const param = {
            "pageSize": pageSize,
            "page": page
            // "passengersNumber": 0,
            // "orderPlannedTime": "",
            // "departureLatitude": 0,
            // "departureLongitude": 0,
            // "destinationLatitude": 0,
            // "destinationLongitude": 0
        }
        return carpoolingOrdersQuery(param).then(data => {
            if (data.code === 200) {
                return data.data;
            } else {
                alert(data.message);
                return [];
            }
        }).catch(err => {
            alert('Query order failed');
            console.error(err.message);
            return [];
        })
    }


    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        const orderList = await queryOrders(pageSize, 1);
        setRideOrders(orderList.content);
        setPage(page + 1);
        setRefreshing(false);
    }, [pageSize, page]); // 更新依赖列表，包括pageSize和page。

    useFocusEffect(
        React.useCallback(() => {
            handleRefresh().then(() => {
            });

            setTimeout(async () => {
                const token = defaultHeaders.getAuthentication(await getUserToken());
                const client = defaultClient(token);

                clientRef.current = client; // 在 ref 中存储 client

                client.connect((frame) => {
                    console.log('Connecting successfully');
                    client.subscribe('/topic/refreshOrder', (body) => {
                        console.log('Driver Order List:' + body);
                        setRideOrders((old) => [body, ...old])
                        setUpdateFlag(!updateFlag); // 当数据更新时改变 updateFlag 的值
                    })
                }, (err) => {
                    // alert("Connection error,please try again later! ")
                    console.log('Connection error:' + JSON.stringify(err));
                }, (close) => {
                    // alert("Connection close")
                    console.log('Connection close:' + JSON.stringify(close));
                });

            }, 0)

            // 返回一个清理函数，它将在页面失焦时运行
            return () => {
                if (clientRef.current) {
                    clientRef.current.disconnect(() => {
                        console.log('Disconnected successfully');
                    }, (err) => {
                        console.error('Disconnect error:' + JSON.stringify(err));
                    });
                }
            };
        }, [])
    );


    const acceptOrder = (orderId) => {
        console.log('Accept Order:', orderId);
        const params = {
            userOrderId: orderId,
        }
        driverAcceptOrder(params).then(data => {
            if (data.code === 200) {
                alert("Accept Order Successful")
                handleRefresh(); //在这里添加代码，接受订单后刷新页面。
            } else {
                alert(data.message);
            }
        }).catch(err => {
            console.error(err.message);
            alert('Accept Order Failed');
        })
        //todo 刷新订单广场页
    };
    const renderItem = ({item}) => ((console.log(item) || true) &&
        <Box bg="white" shadow={2} rounded="lg" p={4} my={2}>
            <Text style={styles.timeText}>{item.plannedDepartureTime}</Text>
            <View style={styles.row}>
                <Text>Departure: {item.departureAddress}</Text>
                <TouchableWithoutFeedback onPress={() => {
                    const address = item.departureAddress;
                    const url = Platform.select({
                        ios: `http://maps.apple.com/?q=${address}`,
                        android: `geo:0,0?q=${address}`,
                    });
                    Linking.openURL(url);
                }}>
                    <Image source={require('../picture/navigation.png')} style={styles.iconStyle} />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.row}>
                <Text>Destination: {item.destinationAddress}</Text>
                <TouchableWithoutFeedback onPress={() => {
                    const address = item.destinationAddress;
                    const url = Platform.select({
                        ios: `http://maps.apple.com/?q=${address}`,
                        android: `geo:0,0?q=${address}`,
                    });
                    Linking.openURL(url);
                }}>
                    <Image source={require('../picture/navigation.png')} style={styles.iconStyle} />
                </TouchableWithoutFeedback>
            </View>
            <Text>
                Expected Earnings:
                <Text style={{fontWeight: 'bold'}}>RM {item.expectedEarnings}.00</Text>
            </Text>
            {item.remark && <Text>Comment: {item.remark}</Text>}
            <HStack justifyContent="flex-end">
                <TouchableOpacity onPress={() => acceptOrder(item.orderId)} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
            </HStack>
        </Box>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={rideOrders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => null}
                extraData={updateFlag} // 把 updateFlag 传递给 extraData
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 60, // 调整底部导航栏高度
    },
    timeText: {
        fontSize: 10,
        marginBottom: 5,
    },
    buttonContainer: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        width: 20,
        height: 20,
        marginLeft: 5,
        transform: [{ rotate: '30deg' }] // 这行会将图标旋转30度
    },
});

export default DriverOrderListScreen;
