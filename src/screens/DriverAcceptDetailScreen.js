import React, {useState, useEffect, useRef} from 'react';
import {NativeBaseProvider, Box, VStack, HStack, Button, Text, Avatar, Input, Image} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import {View, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import Geocoder from 'react-native-geocoding';
import RemixIcon from 'react-native-remix-icon';
import {userOrderInfo, userReviewOrder} from "../com/evotech/common/http/BizHttpUtil";
import {OrderStateEnum} from "../com/evotech/common/constant/BizEnums";
import { Rating } from 'react-native-ratings';
import RBSheet from "react-native-raw-bottom-sheet";
import {format} from "date-fns";


Geocoder.init('AIzaSyCTgmg64j-V2pGH2w6IgdLIofaafqWRwzc');

const DriverAcceptDetailScreen = ({route, navigation}) => {
    const {Departure, Destination, Time, Price, Status, orderDetailInfo,DepartureCoords,DestinationCoords} = route.params;
    const [existDriverInfo, setExistDriverInfo] = useState(false);

    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");

    const refRBSheet = useRef();  // 引用RBSheet

    const refRBSheetPayment = useRef();  // 引用RBSheet for PaymentInfoBox
    const refRBSheetReview = useRef();  // 引用RBSheet for ReviewBox


    useEffect(() => {
        setExistDriverInfo(orderDetailInfo.driverOrderId !== '');
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        map: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height * 0.35, // 让地图占据40%的屏幕
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
            height: Dimensions.get('window').height * 0.65, // 让box占据60%的屏幕
        },
        licensePlateText: {
            fontSize: 20, // 1.5 times the usual size, adjust as needed
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            right: -93,
        },
    });

    const reviewOrder = (satisfaction,reviewContent)=>{
        console.log("user review")
        console.log(orderDetailInfo.orderId)

        const param ={
            orderId: orderDetailInfo.orderId,
            reviewContent: reviewContent,
            satisfaction: satisfaction,
            reviewTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        }
        userReviewOrder(param).then(data=>{
            console.log(data)
            if (data.code !== 200) {
                alert("submit review failed,please try again later!");
            }
        }).catch(err=>{
            console.error(err.message);
            alert("submit review failed,please try again later!");
        });
    }

    const ReviewBox = () => (
        <InfoBox title="Comment your driver">
            <VStack space={4} alignItems="stretch">
                <Rating
                    // showRating
                    onFinishRating={value => setRating(value)}
                    style={{ paddingVertical: 10 }}
                />
                <Input
                    placeholder="Write your review here..."
                    multiline
                    onChangeText={value => setReview(value)}
                />
                <Button onPress={()=>reviewOrder(5,"太棒了")}>
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
                <VStack space={4} mt={3}>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text fontSize="sm">{Time}</Text>
                        </View>
                        <View>
                            <Text fontWeight="bold">RM {Price}.00</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text fontSize="xs">{orderDetailInfo.paymentType} </Text>
                                <TouchableOpacity onPress={() => refRBSheetPayment.current.open()}>
                                    <Image
                                        source={require('../picture/cash.png')}
                                        alt="cash"
                                        style={{width: 20, height: 15}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <HStack space={2} alignItems="center" style={{flexWrap: 'wrap'}}>
                        <RemixIcon name="map-pin-line" size={24} color="blue"/>
                        <Text style={{flex: 1}}>Departure: {Departure}</Text>
                    </HStack>
                    <HStack space={2} alignItems="center" style={{flexWrap: 'wrap'}}>
                        <RemixIcon name="map-pin-line" size={24} color="red"/>
                        <Text style={{flex: 1}}>Destination: {Destination}</Text>
                    </HStack>
                    <HStack space={2} alignItems="center">
                        <RemixIcon name="team-fill" size={24} color="black"/>
                        <Text>Passenger Number: {orderDetailInfo.passengersNumber}</Text>
                    </HStack>
                    {orderDetailInfo.orderCompletionTime && <HStack space={2} alignItems="center">
                        <RemixIcon name="team-fill" size={24} color="black"/>
                        <Text>Passenger Number: {orderDetailInfo.orderCompletionTime}</Text>
                    </HStack>}
                </VStack>
            </InfoBox>

        );
    };
    const PaymentInfoBox = () => (
        <InfoBox title="Payment Information">
            <VStack space={4} alignItems="stretch">
                <HStack>
                    <Text>Order No: {orderDetailInfo.driverOrderId}</Text>
                </HStack>
                <HStack>
                    <Text>Earnings: {orderDetailInfo.totalEarnings}</Text>
                </HStack>
                <HStack>
                    <Text>Settlement Status: {orderDetailInfo.settlementStatus}</Text>
                </HStack>
                {(orderDetailInfo.settlementFailureReason !== '') && <HStack>
                    <Text>Settlement Status: {orderDetailInfo.settlementFailureReason}</Text>
                </HStack>}
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
                        {/*<Text>Driver Name: {orderDetailInfo.userName}</Text>*/}
                        <Text>Ramalaan bin Abdur Rasheed</Text>
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
                            onPress={() => console.log('Chat with Driver')}
                            variant="ghost"
                            style={{ height: 40, justifyContent: 'center', flex: 8 }} // 添加自定义样式
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
                            style={{ height: 40, justifyContent: 'center', flex: 2 }} // 添加自定义样式
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
                        style={{ height: 40, justifyContent: 'center', flex: 1 }}
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
                    latitudeDelta: Math.abs(DepartureCoords.lat - DestinationCoords.lat) * 2 * 1.8,
                    longitudeDelta: Math.abs(DepartureCoords.lng - DestinationCoords.lng) * 2 * 1.8,
                }}
            >
                <Marker coordinate={{latitude: DepartureCoords.lat, longitude: DepartureCoords.lng}}/>
                <Marker coordinate={{latitude: DestinationCoords.lat, longitude: DestinationCoords.lng}}/>
            </MapView>
        </>
    );

    const renderContentBasedOnStatus = () => {
        switch (Status) {
            //待出行
            case OrderStateEnum.PENDING:
                return (
                    <ScrollView style={styles.fullScreen}>
                        {DepartureCoords && DestinationCoords && <MapComponent/>}
                        <OrderInfoBox showStatus={true}/>
                        <RBSheet
                            ref={refRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.5} // 设置RBSheet占据50%的屏幕高度
                        >
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
                            </ScrollView>
                        )}
                    </>
                );
            // 已送达
            case OrderStateEnum.DELIVERED:
                return (
                    <ScrollView style={styles.fullScreen}>
                        <OrderInfoBox showStatus={true}/>
                        <RBSheet
                            ref={refRBSheetPayment} // 修改这里使用了refRBSheetPayment
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.3}
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
                        {existDriverInfo && <DriverInfoBox showBack={existDriverInfo}/>}
                        <RBSheet
                            ref={refRBSheetPayment}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.3} // 设置RBSheet占据50%的屏幕高度
                        >
                        </RBSheet>
                    </ScrollView>
                );
            case OrderStateEnum.COMPLETED:
                return (
                    <ScrollView style={styles.fullScreen}>
                        <OrderInfoBox showStatus={true}/>
                        {/*{existDriverInfo && <DriverInfoBox showBack={true} status={Status}/>}*/}
                        <RBSheet
                            ref={refRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={Dimensions.get('window').height * 0.3} // 设置RBSheet占据50%的屏幕高度
                        >
                            <ReviewBox/>
                        </RBSheet>
                        <PaymentInfoBox/>
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                {renderContentBasedOnStatus()}
            </View>
        </NativeBaseProvider>
    );
};

export default DriverAcceptDetailScreen;
