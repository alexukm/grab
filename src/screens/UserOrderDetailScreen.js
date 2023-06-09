import React, {useState, useEffect, useRef} from 'react';
import {NativeBaseProvider, Box, VStack, HStack, Button, Text, Avatar, Input, Image} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import {View, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import Geocoder from 'react-native-geocoding';
import RemixIcon from 'react-native-remix-icon';
import {
    userOrderInfo,
    userReviewOrder,
    userCancelOrder,
    driverOrderInfo,
    driverGetPasserCode, passerGetDriverCode
} from "../com/evotech/common/http/BizHttpUtil";
import {OrderStateEnum} from "../com/evotech/common/constant/BizEnums";
import {tr} from "date-fns/locale";
import {Rating} from 'react-native-ratings';
import RBSheet from "react-native-raw-bottom-sheet";
import {format} from "date-fns";
import {googleMapsApiKey} from "../com/evotech/common/apiKey/mapsApiKey";
import {userCancelSubscribe} from "../com/evotech/common/websocket/UserChatWebsocket";
import {showDialog, showToast} from "../com/evotech/common/alert/toastHelper";


Geocoder.init(googleMapsApiKey);

const UserOrderDetailScreen = ({route, navigation}) => {
    const {
        Departure,
        Destination,
        Time,
        Price,
        Status,
        orderDetailInfo,
        DepartureCoords,
        DestinationCoords
    } = route.params;
    const [existDriverInfo, setExistDriverInfo] = useState(false);

    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");

    const refRBSheet = useRef();  // 引用RBSheet

    const reviewRef = useRef('');

    const refRBSheetPayment = useRef();  // 引用RBSheet for PaymentInfoBox
    const refRBSheetReview = useRef();  // 引用RBSheet for ReviewBox

    const cancelReasonRef = useRef('');

    const handleCancel = () => {
        refRBSheet.current.open();
    };

    const handleConfirmCancel = () => {
        const cancelOrderParam = {
            orderId: orderDetailInfo.orderId,
            cancelReason: cancelReasonRef.current.trim() === "" ? 'No Reason' : cancelReasonRef.current,
            cancelDateTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };

        userCancelOrder(cancelOrderParam)
            .then(data => {
                if (data.code === 200) {
                    showToast('SUCCESS', 'Success', 'Cancelled Order Successfully');
                    userCancelSubscribe().then()
                    navigation.goBack(); // After canceling the order, return to the previous screen.
                } else {
                    console.log(data.message);
                    showDialog('WARNING', 'Failed', 'Cancel Order failed, Please try again later!');
                }
            }).catch(error => {
            console.log(error);
            showDialog('DANGER', 'Error', 'System error: ' + error.message);
        });
        refRBSheet.current.close();
    };

// 这是返回按钮的组件
    const BackButton = () => (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                position: 'absolute', // 使用绝对定位
                top: 20, // 顶部距离
                left: 20, // 左边距离
                zIndex: 1, // z-index 属性设定了元素的堆叠顺序
            }}
        >
            <RemixIcon name="arrow-left-circle-line" size={35} color="black"/>
        </TouchableOpacity>
    );


    useEffect(() => {
        setExistDriverInfo(orderDetailInfo.driverOrderId !== '');
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        map: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height * 0.55, // 让地图占据40%的屏幕
        },
        box: {
            padding: 5,
            marginTop: 10,
        },
        driverInfo: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        fullScreen: {
            height: Dimensions.get('window').height * 0.45, // 让box占据60%的屏幕
        },
        licensePlateText: {
            fontSize: 20, // 1.5 times the usual size, adjust as needed
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            right: -93,
        },
    });

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

    const openChatRoom = () => {
        const params = {
            orderId: orderDetailInfo.driverOrderId,
        }
        console.log(orderDetailInfo.driverOrderId);
        passerGetDriverCode(params)
            .then(data => {
                if (data.code !== 200) {
                    showDialog('WARNING', 'Warning', data.message);
                    return;
                }
                navigation.navigate('ChatRoom', {
                    receiverName: data.data.userName,
                    receiverUserCode: data.data.userCode,
                    orderStatus: Status,
                });
            }).catch(err => {
            console.error(err.message);
            showDialog('DANGER', 'Error', 'Get user info failed, please try again later!');
        });
    }
    const fetchDataAndUpdateParams = () => {
        const queryParam = {
            orderId: orderDetailInfo.orderId
        }
        userOrderInfo(queryParam)
            .then(data => {
                if (data.code === 200) {
                    navigation.setParams({
                        Departure: Departure,
                        Destination: Destination,
                        Time: data.data.actualDepartureTime,
                        Price: Price,
                        Status: data.data.orderState,
                        orderDetailInfo: data.data,
                        userOrderId: orderDetailInfo.orderId,
                        DepartureCoords: DepartureCoords,
                        DestinationCoords: DestinationCoords
                    });
                } else {
                    showDialog('DANGER', 'Error', 'Error', data.message);
                }
            });
    }

    const reviewOrder = (satisfaction, reviewContent) => {

        const param = {
            orderId: orderDetailInfo.orderId,
            reviewContent: reviewContent,
            satisfaction: satisfaction,
            reviewTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        }
        userReviewOrder(param).then(data => {
            if (data.code !== 200) {
                showDialog('WARNING', 'Error', 'Submit review failed,please try again later!');
            } else {
                fetchDataAndUpdateParams();
            }
        }).catch(err => {
            console.error(err.message);
            showDialog('DANGER', 'Error', 'Submit review failed,please try again later!');
        });
    }

    const ReviewBox = () => (
        <InfoBox title="Comment your driver">
            <VStack space={4} alignItems="stretch">
                <Rating
                    type='star'
                    ratingCount={5}
                    imageSize={40}
                    // fractions={1}
                    startingValue={5}
                    onFinishRating={(rating) => console.log('Rating is ' + rating)}
                />
                <Input
                    placeholder="Write your review here..."
                    multiline
                    onChangeText={value => reviewRef.current = value}
                />
                <Button onPress={() => reviewOrder(5, "太棒了")}>
                    Submit
                </Button>
            </VStack>
        </InfoBox>
    );

    const InfoBox = ({status, children}) => (
        <VStack>
            {status && (
                <Box bg={status.color} p={2} width="100%">
                    <Text>Status: {status.text}</Text>
                </Box>
            )}
            <Box bg="white" shadow={2} p={4}>
                <VStack space={4} mt={1.2}>
                    {children}
                </VStack>
            </Box>
        </VStack>
    );
    const OrderInfoBox = () => {
        let statusColor;
        switch (Status) {
            case OrderStateEnum.AWAITING:
                statusColor = '#0000FF'; // blue
                break;
            case OrderStateEnum.PENDING:
                statusColor = '#FFFF00'; // yellow
                break;
            case OrderStateEnum.IN_TRANSIT:
                statusColor = '#008000'; // green
                break;
            case OrderStateEnum.DELIVERED:
                statusColor = '#800080'; // purple
                break;
            case OrderStateEnum.CANCELLED:
                statusColor = '#808080'; // gray
                break;
            default:
                statusColor = '#808080'; // default to gray
        }
        return (
            <InfoBox status={{color: statusColor, text: Status}}>
                <VStack space={4}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <Text
                                fontSize="sm">{Time} · {orderDetailInfo.passengersNumber} {orderDetailInfo.passengersNumber > 1 ? "Passengers" : "Passenger"}</Text>
                            {(Status === OrderStateEnum.AWAITING || Status === OrderStateEnum.PENDING) && (
                                <TouchableOpacity onPress={handleCancel}>
                                    <Text fontSize="sm" style={{color: 'blue', fontWeight: 'bold'}}>Cancel Order?</Text>
                                </TouchableOpacity>
                            )}
                            <RBSheet
                                ref={refRBSheet}
                                height={200}
                                closeOnDragDown={true}
                                closeOnPressMask={true}
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
                                    <View style={{padding: 10}}>
                                        <Text style={{fontSize: 18, marginBottom: 10}}>Do you want to cancel the
                                            order?</Text>
                                        <Input
                                            mt={4}  // Add margin to the top
                                            mb={4}  // Add margin to the bottom
                                            placeholder="Reason for cancellation (OPTIONAL)"
                                            onChangeText={text => cancelReasonRef.current = text}
                                            // value={cancelReason}
                                        />
                                        <Button onPress={handleConfirmCancel}>
                                            <Text style={styles1.textStyle}>Confirm Cancel</Text>
                                        </Button>
                                    </View>
                                </View>
                            </RBSheet>
                        </View>
                        <View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => refRBSheetPayment.current.open()}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text fontSize="xl" fontWeight="bold">RM {Price}</Text>
                                        <Text fontSize="xs"> {'>'} </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <HStack space={2} alignItems="center" style={{flexWrap: 'wrap'}}>
                        <RemixIcon name="checkbox-blank-circle-fill" size={15} color="blue"/>
                        <Text style={{flex: 1}}>{Departure}</Text>
                    </HStack>
                    <HStack space={2} alignItems="center" style={{flexWrap: 'wrap'}}>
                        <RemixIcon name="checkbox-blank-circle-fill" size={15} color="orange"/>
                        <Text style={{flex: 1}}>{Destination}</Text>
                    </HStack>
                </VStack>
            </InfoBox>
        );
    };
    const PaymentInfoBox = () => (
        <InfoBox>
            <VStack space={4} alignItems="stretch">
                <HStack>
                    <Text>Order No: {orderDetailInfo.orderId}</Text>
                </HStack>
                <HStack>
                    <Text>Payment No: {orderDetailInfo.payNo}</Text>
                </HStack>
                <HStack>
                    <Text>Payment Method: {orderDetailInfo.paymentType}</Text>
                </HStack>
                <HStack>
                    <Text>Payment Amount: {orderDetailInfo.price}</Text>
                </HStack>
                <HStack>
                    <Text>Payment Status: {orderDetailInfo.orderState}</Text>
                </HStack>
            </VStack>
        </InfoBox>
    );

    const DriverInfoBox = ({showBack, status}) => (
        <InfoBox title="Driver Information" showBack={showBack}>
            <VStack space={4} alignItems="stretch">
                <HStack justifyContent='space-between' alignItems='center'>
                    <VStack>
                        <Avatar
                            size="lg"
                            source={{
                                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                            }}
                        />
                        <Text>Driver: {orderDetailInfo.userName}</Text>
                    </VStack>
                    <View style={{alignItems: 'flex-end'}}>
                        {/*<Text style={{...styles.licensePlateText, lineHeight: 30}}>License Plate: {orderDetailInfo.licensePlate}</Text>*/}
                        {/*<Text>Car Model: {orderDetailInfo.carBrand}</Text>*/}
                        <Text style={{...styles.licensePlateText, lineHeight: 30}}>UKM 6869</Text>
                        <Text>GRAY - PROTON SAGA (GRAY)</Text>
                    </View>
                </HStack>
                {status !== OrderStateEnum.DELIVERED ? (
                    <HStack space={2}>
                        <Button
                            bg="#f0f0f0"
                            onPress={() => openChatRoom()}
                            variant="ghost"
                            style={{height: 40, justifyContent: 'center', flex: 8}} // 添加自定义样式
                        >
                            <HStack space={2}>
                                <RemixIcon name="message-3-line" size={24} color="black"/>
                                <Text>Chat</Text>
                            </HStack>
                        </Button>
                        <Button
                            bg="#e0e0e0"
                            onPress={() => console.log('Call Driver')}
                            variant="ghost"
                            style={{height: 40, justifyContent: 'center', flex: 2}} // 添加自定义样式
                        >
                            <HStack space={2}>
                                <RemixIcon name="phone-line" size={24} color="black"/>
                            </HStack>
                        </Button>
                    </HStack>
                ) : (
                    <Button
                        bg="#f0f0f0"
                        onPress={() => refRBSheetReview.current.open()}
                        variant="ghost"
                        style={{height: 40, justifyContent: 'center', flex: 1}}
                    >
                        <HStack space={2}>
                            <RemixIcon name="star-line" size={24} color="black"/>
                            <Text>Rate</Text>
                        </HStack>
                    </Button>
                )}
            </VStack>
        </InfoBox>
    );


    const MapComponent = () => (
        <>
            <MapView
                style={styles.map}
                region={{
                    latitude: (DepartureCoords.lat + DestinationCoords.lat) / 2,
                    longitude: (DepartureCoords.lng + DestinationCoords.lng) / 2,
                    latitudeDelta: Math.abs(DepartureCoords.lat - DestinationCoords.lat) * 2 * 0.65,
                    longitudeDelta: Math.abs(DepartureCoords.lng - DestinationCoords.lng) * 2 * 0.65,
                }}
            >
                <Marker pinColor="blue" coordinate={{latitude: DepartureCoords.lat, longitude: DepartureCoords.lng}}/>
                <Marker coordinate={{latitude: DestinationCoords.lat, longitude: DestinationCoords.lng}}/>
            </MapView>
        </>
    );

    const renderContentBasedOnStatus = () => {
        switch (Status) {
            //待接单AWAITING
            case OrderStateEnum.AWAITING:
                return (
                    <ScrollView style={styles.fullScreen}>
                        {DepartureCoords && DestinationCoords && <MapComponent/>}
                        <OrderInfoBox showStatus={true}/>
                        <RBSheet
                            ref={refRBSheetPayment}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.28} // 设置RBSheet占据50%的屏幕高度
                        >
                            <PaymentInfoBox/>
                        </RBSheet>
                    </ScrollView>
                );
            //待出行
            case OrderStateEnum.PENDING:
                return (
                    <ScrollView style={styles.fullScreen}>
                        {DepartureCoords && DestinationCoords && <MapComponent/>}
                        <OrderInfoBox showStatus={true}/>
                        {existDriverInfo && <DriverInfoBox showBack={existDriverInfo}/>}
                        <RBSheet
                            ref={refRBSheetPayment}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.28} // 设置RBSheet占据50%的屏幕高度
                        >
                            <PaymentInfoBox/>
                        </RBSheet>
                    </ScrollView>
                );
            //旅途中
            case OrderStateEnum.IN_TRANSIT:
                return (
                    <>
                        {DepartureCoords && DestinationCoords && (
                            <ScrollView style={styles.fullScreen}>
                                <MapComponent/>
                                <OrderInfoBox showStatus={false}/>
                                {existDriverInfo && <DriverInfoBox showBack={existDriverInfo}/>}
                            </ScrollView>
                        )}
                    </>
                );
            // 已送达
            case OrderStateEnum.DELIVERED:
                return (
                    <ScrollView style={styles.fullScreen}>
                        <OrderInfoBox showStatus={true}/>
                        <DriverInfoBox showBack={true} status={Status}/>
                        <RBSheet
                            ref={refRBSheetPayment} // 修改这里使用了refRBSheetPayment
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.28}
                        >
                            <PaymentInfoBox/>
                        </RBSheet>
                        <RBSheet
                            ref={refRBSheetReview} // 添加了一个新的RBSheet
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.3}
                        >
                            <ReviewBox/>
                        </RBSheet>
                    </ScrollView>
                );

            //已取消
            case OrderStateEnum.CANCELLED:
                return (
                    <ScrollView style={styles.fullScreen}>
                        <OrderInfoBox showStatus={true}/>
                        {/*{existDriverInfo && <DriverInfoBox showBack={existDriverInfo}/>}*/}
                        <RBSheet
                            ref={refRBSheetPayment}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.28} // 设置RBSheet占据50%的屏幕高度
                        >
                            <PaymentInfoBox/>
                        </RBSheet>
                    </ScrollView>
                );
            case OrderStateEnum.COMPLETED:
                return (
                    <ScrollView style={styles.fullScreen}>
                        <OrderInfoBox showStatus={true}/>
                        {/*{existDriverInfo && <DriverInfoBox showBack={true} status={Status}/>}*/}
                        <RBSheet
                            ref={refRBSheetPayment}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.28} // 设置RBSheet占据50%的屏幕高度
                        >
                            <PaymentInfoBox/>
                        </RBSheet>
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <BackButton/>
                {renderContentBasedOnStatus()}
            </View>
        </NativeBaseProvider>
    );
};

export default UserOrderDetailScreen;
