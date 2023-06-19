import React, {useEffect, useState, useRef, useCallback} from 'react';
import {StyleSheet, FlatList, TouchableOpacity, RefreshControl, View} from 'react-native';
import {Box, HStack, VStack, Text, Button, Input} from 'native-base';
import RBSheet from "react-native-raw-bottom-sheet";
import RemixIcon from 'react-native-remix-icon';
import {userCancelOrder, userOrderInfo, userOrderPage} from "../com/evotech/common/http/BizHttpUtil";
import {format} from "date-fns";
import {OrderStateEnum} from "../com/evotech/common/constant/BizEnums";
import {useFocusEffect} from '@react-navigation/native';


const styles1 = StyleSheet.create({
    buttonStyle: {
        backgroundColor: 'white',
        borderRadius: 0,
        padding: 10,
    },
    textStyle: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const OrderBox = React.memo(({order, navigation, openSheet}) => {
    const {
        departureAddress,
        destinationAddress,
        departureTime,
        price,
        orderState,
        orderId,
        departureLatitude,
        departureLongitude,
        destinationLatitude,
        destinationLongitude,
        cancelButtonShow = (OrderStateEnum.AWAITING === orderState || orderState === OrderStateEnum.PENDING)
    } = order;
    // const [cancelButtonShow, setCancelButtonShow] = useState(false);

    // setCancelButtonShow(OrderStateEnum.AWAITING === orderState || orderState === OrderStateEnum.PENDING);
    const statusColors = {
        'Pending': '#CCCC00',
        'Awaiting': '#0099FF',
        'Cancelled': '#FF0000',
        'Delivered': '#00CC00',
        'InTransit': '#FF9900',
    };

    const handlePress = () => {
        const queryParam = {
            orderId: orderId,
        }
        userOrderInfo(queryParam)
            .then(data => {
                if (data.code === 200) {
                    navigation.navigate('SimpleOrderDetails', {
                        screen: 'SimpleOrderDetailScreen',
                        params: {
                            orderDetailInfo: data.data,
                            Departure: departureAddress,
                            Destination: destinationAddress,
                            DepartureCoords: {
                                "lat": departureLatitude,
                                "lng": departureLongitude
                            },
                            DestinationCoords: {
                                "lat": destinationLatitude,
                                "lng": destinationLongitude
                            },
                            Time: departureTime,
                            Price: price,
                            Status: orderState,
                            // 需要添加其他参数，看OrderDetailScreen需要什么参数
                        },
                    });
                } else {
                    alert(data.message);
                }
            }).catch(error => {
            console.log("order info query failed " + error.message);
            alert("order details query failed ,please try again later!")
        });
    };

    const handleCancel = () => {
        openSheet(orderId);
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
                    {cancelButtonShow && <Box position="absolute" bottom={0} right={0}>
                        <Button style={styles1.buttonStyle} onPress={handleCancel}>
                            <Text style={styles1.textStyle}>Cancel Order</Text>
                        </Button>
                    </Box>}
                </VStack>
            </Box>
        </TouchableOpacity>
    );
});

const pageSize = 10;

const OrderListScreen = ({navigation}) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const refRBSheet = useRef();

    useFocusEffect(
        React.useCallback(() => {
            handleRefresh();
        }, [])
    );

    const openSheet = useCallback((orderId) => {
        setCancelOrderId(orderId);
        refRBSheet.current.open();
    }, []);

    const closeSheet = () => {
        refRBSheet.current.close();
    };

    const handleConfirmCancel = () => {
        const cancelOrderParam = {
            orderId: cancelOrderId,
            cancelReason: cancelReason,
            cancelDateTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };

        userCancelOrder(cancelOrderParam)
            .then(data => {
                if (data.code === 200) {
                    alert("Cancelled Order Success");
                    handleRefresh(); //取消订单并刷新页面
                } else {
                    console.log(data.message);
                    alert("Cancel Order failed, Please try again later!")
                }
            }).catch(error => {
            console.log(error);
            alert("system error: " + error.message)
        });

        closeSheet();
    };

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        const orderList = await queryOrderList(pageSize, 1);
        setOrders(orderList.content);
        setPage(2);
        setRefreshing(false);
    }, []);

    const queryOrderList = async (pageSize, page) => {
        const queryOrderListParam = {
            pageSize: pageSize,
            page: page,
        };
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
    };

    const fetchMoreOrders = useCallback(async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        const orderList = await queryOrderList(pageSize, page);
        if (orderList.length > 0) {
            setOrders((oldData) => [...oldData, ...orderList.content]);
            setPage((prevPage) => prevPage + 1);
        }
        setLoading(false);
    }, [loading, page]);

    const renderItem = useCallback(({item}) => <OrderBox key={item.id} order={item} navigation={navigation}
                                                         openSheet={openSheet}/>, [navigation, openSheet]);


    return (
        <>
            <FlatList
                contentContainerStyle={styles.container}
                data={orders}
                renderItem={renderItem}
                onEndReached={fetchMoreOrders}
                onEndReachedThreshold={0.5}
                windowSize={20}
                initialNumToRender={10}
                maxToRenderPerBatch={20}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                ListHeaderComponent={
                    <Box bg="white" shadow={2} rounded="lg" p={4} my={2} style={{marginTop: 10}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Order List</Text>
                        <Text>This page displays a list of all orders with their status.</Text>
                    </Box>
                }
                ListFooterComponent={<Box height={20}/>}
                keyExtractor={item => item.id}
            />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                }}
            >
                <View style={styles.container}>
                    <Text style={{fontSize: 18, marginBottom: 10}}>Do you want to cancel the order?</Text>
                    <Input
                        placeholder="Reason for cancellation"
                        onChangeText={text => setCancelReason(text)}
                        value={cancelReason}
                    />
                    <Button onPress={handleConfirmCancel}>
                        <Text style={styles1.textStyle}>Confirm Cancel</Text>
                    </Button>
                </View>
            </RBSheet>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
    },
});

export default OrderListScreen;
