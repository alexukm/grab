import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Box, HStack, VStack, Text, Button} from 'native-base';
import RemixIcon from 'react-native-remix-icon';
import {userCancelOrder, userOrderPage} from "../com/evotech/common/http/BizHttpUtil";
import {format} from "date-fns";

const styles1 = StyleSheet.create({
    buttonStyle: {
        backgroundColor: 'white', // 设置按钮的背景颜色
        borderRadius: 0, // 设置按钮的边框圆角
        padding: 10, // 设置按钮的内边距
    },
    textStyle: {
        color: 'black', // 设置文本颜色
        fontSize: 16, // 设置文本大小
        fontWeight: 'bold', // 设置文本粗细
    },
});
const OrderBox = ({order, navigation}) => {
    const {departureAddress, destinationAddress, departureTime, price, orderState, orderId, Reason} = order;
    const statusColors = {
        'Pending': '#CCCC00',
        'Awaiting': '#0099FF',
        'Cancelled': '#FF0000',
        'Arrived': '#00CC00',
        'InTransit': '#FF9900',
    };

    const handlePress = () => {
        navigation.navigate('SimpleOrderDetails', {
            screen: 'SimpleOrderDetailScreen',
            params: {
                orderId: orderId,
                Departure: departureAddress,
                Destination: destinationAddress,
                Time: departureTime,
                Price: price,
                Status: orderState,
                // 需要添加其他参数，看OrderDetailScreen需要什么参数
            },
        });
    };
    const cancelOrder = (orderId, reason) => {
        const cancelOrderParam = {
            orderId: orderId,
            cancelReason: reason,
            cancelDateTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        }

        userCancelOrder(cancelOrderParam)
            .then(data => {
                if (data.code === 200) {
                    alert("Cancelled Order Success")
                    //TODO 刷新页面
                } else {
                    console.log(data.message);
                    alert("Cancel Order failed,Please try again later!")
                }
            }).catch(error => {
            console.log(error);
            alert("system error: " + error.message)
        })
    };
    return (
        <TouchableOpacity onPress={handlePress}>
            <Box bg="white" shadow={2} rounded="lg" p={4} my={2}>
                <Text color={statusColors[orderState]} alignSelf='flex-end'>{orderState}</Text>
                <VStack space={4}>
                    <HStack space={2} alignItems="center">
                        <RemixIcon name="map-pin-line" size={20} color="blue"/>
                        <Text>Departure: {departureAddress}</Text>
                    </HStack>
                    <HStack space={2} alignItems="center">
                        <RemixIcon name="map-pin-line" size={20} color="red"/>
                        <Text>Destination: {destinationAddress}</Text>
                    </HStack>
                    <HStack space={2} alignItems="center">
                        <RemixIcon name="calendar-check-line" size={20} color="black"/>
                        <Text>Time: {departureTime}</Text>
                    </HStack>
                    <HStack space={2} alignItems="center">
                        <RemixIcon name="wallet-3-line" size={20} color="black"/>
                        <Text>Price: {price}</Text>
                    </HStack>
                    <Box position="absolute" bottom={0} right={0}>
                        <Button style={styles1.buttonStyle} onPress={() => {
                            cancelOrder(orderId, Reason);
                        }}>
                            <Text style={styles1.textStyle}>test</Text>
                        </Button>
                    </Box>
                </VStack>
            </Box>
        </TouchableOpacity>
    );
};

const pageSize = 10;


const OrderListScreen = ({navigation}) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(()=>{
        fetchMoreOrders().then();
    },[])

    const queryOrderList = async (pageSize, page) => {
        const queryOrderListParam = {
            pageSize: pageSize,
            page: page,
        }
        return userOrderPage(queryOrderListParam)
            .then(data => {
                if (data.code === 200) {
                    return data.data;
                } else {
                    console.log(data.message);
                    return [];
                }
            }).catch(error => {
                console.log(error);
                return [];
            })
    }

    const fetchMoreOrders = async () => {
        if (loading) {
            return;
        }

        setLoading(true);
        console.log("page:---------------" + page);
        const orderList = await queryOrderList(pageSize, page);
        setOrders((oldData) => [...oldData, ...orderList.content]);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
    };

    const renderItem = ({item}) => {
        console.log(JSON.stringify(item))
        return <OrderBox key={item.id} order={item} navigation={navigation}/>;
    };

    return (
        <FlatList
            contentContainerStyle={styles.container}
            data={orders}
            renderItem={renderItem}
            onEndReached={fetchMoreOrders}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
                <Box bg="white" shadow={2} rounded="lg" p={4} my={2} style={{marginTop: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>Order List</Text>
                    <Text>This page displays a list of all orders with their status.</Text>
                </Box>
            }
            ListFooterComponent={<Box height={20}/>}
            keyExtractor={item => item.id}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
    },
});

export default OrderListScreen;
