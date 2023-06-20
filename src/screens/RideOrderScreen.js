import React, {useState, useEffect, useRef} from 'react';
import {PermissionsAndroid, Dimensions, Image, Pressable, View, Alert} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Box, Button, HStack, Input, NativeBaseProvider, Text, VStack, Modal} from 'native-base';
import RemixIcon from 'react-native-remix-icon';
import DatePicker from 'react-native-date-picker';
import Geocoder from 'react-native-geocoding';
import MapView, {Polyline} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {
    orderPriceCheck,
    userOrderCheck,
    userSubmitOrder
} from "../com/evotech/common/http/BizHttpUtil";
import {format} from 'date-fns';
import {googleMapsApiKey} from "../com/evotech/common/apiKey/mapsApiKey";
import apiService from "../com/evotech/common/apiKey/apiService";

// 初始化Geocoder库，这个库用于处理地址和地理坐标的相互转化
Geocoder.init(googleMapsApiKey);

const RideOrderScreen = () => {
    // open, date, passengerCount等都是应用状态，可以在应用中使用和修改
    const [date, setDate] = useState(null);
    const [open, setOpen] = useState(false);
    const [passengerCount, setPassengerCount] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [departure, setDeparture] = useState('');
    const [departureAddress, setDepartureAddress] = useState('');
    const [destination, setDestination] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [remarks, setRemarks] = useState('');

    // 更多的状态，主要与地图、路线和建议的显示有关
    const [isSuccessScreen, setIsSuccessScreen] = useState(false);
    const [pickupWaiting, setPickupWaiting] = useState("Waiting for pick up");

    //save departure location
    const [departureSuggestions, setDepartureSuggestions] = useState([]);
    const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);

    //save destination location
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

    const [isDepartureSelected, setIsDepartureSelected] = useState(false);
    const [isDestinationSelected, setIsDestinationSelected] = useState(false);

    //跳转目的地地图
    // 目的地经纬度
    const [destinationCoords, setDestinationCoords] = useState(null);

    //存储这个坐标数组
    const [coords, setCoords] = useState([]);

    const [estimatedDistance, setEstimatedDistance] = useState(null);
    const [estimatedDistanceOrder, setEstimatedDistanceOrder] = useState(null);
    const [estimatedDuration, setEstimatedDuration] = useState(null);
    const [estimatedDurationOrder, setEstimatedDurationOrder] = useState(null);
    const [orderPrice, setOrderPrice] = useState(null);

    const navigation = useNavigation();

    // 使用React的useRef创建一个引用，可以用它来访问MapView组件
    const mapRef = useRef(null);

    const [departureCoords, setDepartureCoords] = useState(null);

    // 从Google API获取地址建议
    const updateAddressSuggestions = async (input, setSuggestions) => {
        const predictions = await apiService.getAutocomplete(input);
        setSuggestions(predictions);
    };

    // 分别用于获取出发地和目的地的建议
    const fetchDepartureSuggestions = async (input) => {
        if (!showDepartureSuggestions) {
            const predictions = await apiService.getAutocomplete(input);
            setDepartureSuggestions(predictions);
        }
    };

    const fetchDestinationSuggestions = async (input) => {
        if (!showDestinationSuggestions) {
            const predictions = await apiService.getAutocomplete(input);
            setDestinationSuggestions(predictions);
        }
    };

    //获取经纬度，并将地图焦点移动到新的位置
    const moveToLocation = async (placeId) => {
        try {
            const location = await apiService.getLocationDetails(placeId);
            mapRef.current.animateToRegion({
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: 0.005,  // smaller value for a more zoomed in view
                longitudeDelta: 0.005,  // smaller value for a more zoomed in view
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect在组件渲染后执行，用于在用户输入出发地和目的地时获取地址建议
    useEffect(() => {
        if (!isDepartureSelected && departure.length > 2) {
            fetchDepartureSuggestions(departure);
            setShowDepartureSuggestions(true);
        } else {
            setShowDepartureSuggestions(false);
            setDepartureSuggestions([]); // 清空建议列表
        }
    }, [departure]);

    useEffect(() => {
        if (!isDestinationSelected && destination.length > 2) {
            fetchDestinationSuggestions(destination);
            setShowDestinationSuggestions(true);
        } else {
            setShowDestinationSuggestions(false);
            setDestinationSuggestions([]); // 清空建议列表
        }
    }, [destination]);

    // 这个函数获取当前地理位置，并将地图中心移动到这个位置
    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(async info => {
            const {latitude, longitude} = info.coords;
            setDeparture(`lat: ${latitude}, lng: ${longitude}`);

            try {
                const response = await Geocoder.from(latitude, longitude);
                const address = response.results[0].formatted_address;
                setDeparture(address);

                // 定位到地图上的经纬度位置
                mapRef.current.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            } catch (error) {
                console.error(error);
            }
        });
    };
    // 这个函数请求地理位置权限
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "This app needs access to your location",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getCurrentLocation();
            } else {
                console.log("Location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // 在组件渲染后请求地理位置权限
    useEffect(() => {
        requestLocationPermission();
    }, []);

    // 这个函数处理打开日期选择器的逻辑
    const handleOpenDatePicker = () => {
        setOpen(true);
    };

    const navigateHome = () => {
        navigation.navigate('Tabs', {screen: 'Home'});
    };

    //格式化日期
    const formatDate = (date) => {
        const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
        const timeOptions = {hour: '2-digit', minute: '2-digit', hour12: true};

        const dateString = date.toLocaleDateString('en-GB', options); // formats to day/month/year
        const timeString = date.toLocaleTimeString('en-US', timeOptions); // formats to hour:minute AM/PM

        return `${dateString} ${timeString}`;
    };
    const allowOrder = () => {
        userOrderCheck()
            .then(data => {
                if (data.code === 600) {
                    Alert.alert(
                        "WARN!",
                        data.message,
                        [
                            {
                                text: "Cancel", onPress: () => {
                                    console.log("Cancel Pressed");
                                    setIsBookingConfirmed(false);
                                }
                            },
                            {
                                text: "OK", onPress: () => {
                                    console.log("OK Pressed");
                                    handleNextStep();
                                }
                            }
                        ]
                    );
                } else {
                    handleNextStep();
                }
            }).catch(err => {
            console.log("user order check fail" + err.message);
            alert("System error,Please try again later!");
        });

    }
    const fillAddress = (addressArray, prefix, orderSubmitParam) => {
        const len = addressArray.length;
        console.log(addressArray);
        if (len > 0) {
            orderSubmitParam[`${prefix}Country`] = addressArray[len - 1].value;
        }
        if (len > 1) {
            orderSubmitParam[`${prefix}State`] = addressArray[len - 2].value;
        }
        if (len === 3) {
            orderSubmitParam[`${prefix}Address`] = addressArray[len - 3].value;
        } else if (len > 3) {
            orderSubmitParam[`${prefix}City`] = addressArray[len - 3].value;
            let address = "";
            for (let i = len - 4; i >= 0; i--) {
                address += addressArray[i].value + " ";
            }
            orderSubmitParam[`${prefix}Address`] = address;
        }
    };

    const fillDepAddress = (orderSubmitParam) => {
        fillAddress(departureAddress, 'departure', orderSubmitParam);
    };

    const fillDescAddress = (orderSubmitParam) => {
        fillAddress(destinationAddress, 'destination', orderSubmitParam);
    };


    const submitOrder = () => {
        const orderSubmitParam = {
            'distance': estimatedDistanceOrder, // 距离
            'expectedTravelTime': estimatedDurationOrder, // 行程预计时间
            'plannedDepartureTime': format(date, 'yyyy-MM-dd HH:mm:ss'), // 计划出发时间
            'travelMode': "Private", // 乘车模式 Private 独享
            'passengersNumber': passengerCount,
            'estimatedFare': orderPrice,
            'remark': remarks, //用户备注
            'paymentType': "Cash", // TODO 用户付款方式 "Cash", "现金" "E-wallet","电子钱包"
            'departureCountry': "",//出发地国家
            'departureState': "",// 出发地州属
            'departureCity': "",//出发地城市
            'departureAddress': "", //出发地详细地址
            'destinationCountry': "", //目的地国家
            'destinationState': "", // 目的地州属
            'destinationCity': "", // 目的地城市
            'destinationAddress': "", // 目的地详细地址
            'departureLatitude': departureCoords.latitude, //出发地纬度
            'departureLongitude': departureCoords.longitude, //出发地经度
            'destinationLatitude': destinationCoords.latitude, //目的地纬度
            'destinationLongitude': destinationCoords.longitude //目的地经度
        }

        fillDepAddress(orderSubmitParam);
        fillDescAddress(orderSubmitParam);

        console.log(orderSubmitParam)

        userSubmitOrder(orderSubmitParam)
            .then(data => {
                if (data.code === 200) {
                    navigation.navigate('OrderDetailScreen', {
                        departure,
                        destination,
                        date: date.toISOString(), // 将日期转换为字符串
                        passengerCount,
                        pickupWaiting,
                        coords
                    });
                }else {
                    alert("Submit failed" + data.message);
                }
            }).catch((err) => {
            console.log(err);
            alert("Submit Order failed")
        });
    };
    // 处理下一步的逻辑，获取行程的距离和时间，如果已经确认预订，则跳转到订单详情页面
    const handleNextStep = () => {
        if (!departure || !destination || !date) {
            alert("Please fill in all fields!");
            return;
        }

        console.log(departure)
        console.log(destination)
        fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(departure)}&destination=${encodeURIComponent(destination)}&key=AIzaSyCTgmg64j-V2pGH2w6IgdLIofaafqWRwzc`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.routes.length) {
                    const legs = data.routes[0].legs[0];
                    console.log("google map api response: "+data.routes.length);
                    const distance = legs.distance.text;
                    const duration = legs.duration.text;

                    const distanceDouble = legs.distance.value / 1000
                    const distanceKm = Math.round(distanceDouble);
                    const durationTime = Math.round(legs.duration.value / 60);
                    // const durationTime =10.21


                    orderPriceCheck(durationTime, distanceKm)
                        .then(data => {
                            if (data.code === 200) {
                                setOrderPrice(data.data);

                                setEstimatedDistance(distance);
                                setEstimatedDuration(duration);

                                setEstimatedDistanceOrder(distanceDouble);
                                setEstimatedDurationOrder(durationTime);
                                const steps = legs.steps;

                                const newCoords = steps.reduce((acc, step) => {
                                    const startLoc = step.start_location;
                                    const endLoc = step.end_location;
                                    return acc.concat([
                                        {latitude: startLoc.lat, longitude: startLoc.lng},
                                        {latitude: endLoc.lat, longitude: endLoc.lng}
                                    ]);
                                }, []);
                                setCoords(newCoords);

                                const latitudeList = newCoords.map(coord => coord.latitude);
                                const longitudeList = newCoords.map(coord => coord.longitude);
                                const minLatitude = Math.min(...latitudeList);
                                const maxLatitude = Math.max(...latitudeList);
                                const minLongitude = Math.min(...longitudeList);
                                const maxLongitude = Math.max(...longitudeList);

                                mapRef.current.fitToCoordinates([{
                                    latitude: minLatitude,
                                    longitude: minLongitude
                                }, {latitude: maxLatitude, longitude: maxLongitude}], {
                                    edgePadding: {top: 30, right: 30, bottom: 30, left: 30},
                                    animated: true,
                                });
                                setIsBookingConfirmed(true);
                            } else {
                                console.log(data.message)
                                alert("Get price error, please try again later!")
                                // setIsBookingConfirmed(false);

                            }
                        }).catch(err => {
                        console.error(err);
                        setIsBookingConfirmed(false);
                        alert("Get price error, please try again later!")
                    })

                }
            });

    };

    // 处理返回的逻辑，根据当前的状态，取消预订或返回到主页
    const handleBack = () => {
        if (isSuccessScreen) {
            setIsSuccessScreen(false);
        } else if (isBookingConfirmed) {
            setIsBookingConfirmed(false);
        }
    };

    const handlePickupWaiting = () => {
        Alert.alert(
            'Do you want cancel your order?',
            '',
            [
                {text: 'No'},
                {text: 'Yes', onPress: () => setPickupWaiting('Cancel')}
            ]
        );
    };


    const styles = {
        container: {
            flex: 1,
        },
        map: {
            flex: 1,
        },
    };

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <MapView
                    ref={mapRef} //用于保存对地图的引用
                    style={{...styles.map, marginBottom: Dimensions.get('window').height / 2}}
                    initialRegion={{
                        latitude: 2.9435,
                        longitude: 101.7654,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Polyline
                        coordinates={coords}
                        strokeWidth={4}
                        strokeColor="red"
                    />
                </MapView>

                {!isSuccessScreen && !isBookingConfirmed && (
                    <Button variant="link" onPress={navigateHome} position="absolute" left={5} top={5}>
                        <RemixIcon name="arrow-left-circle-line" size={30} color="black"/>
                    </Button>
                )}

                {isSuccessScreen ? (
                    <Box
                        bg="white"
                        p={4}
                        w="100%"
                        h={Dimensions.get('window').height / 2}
                        position="absolute"
                        bottom={0}
                        borderTopRadius={10}
                    >
                        {/* Content for Success Screen */}
                        <VStack space={4} alignItems="stretch">
                            <HStack justifyContent="space-between" alignItems="center">
                                <Button variant="unstyled" onPress={handleBack}>
                                    <Text>Back</Text>
                                </Button>
                            </HStack>
                            <Text>Departure: {departure}</Text>
                            <Text>Destination: {destination}</Text>
                            <Text>Date and Time: {date ? formatDate(date) : ''}</Text>
                            <Text>Number of Passengers: {passengerCount}</Text>
                            <Button mt={4}>
                                {pickupWaiting}
                            </Button>
                            <Button mt={4} onPress={handlePickupWaiting}>
                                Cancel
                            </Button>
                        </VStack>
                    </Box>
                ) : isBookingConfirmed ? (
                    <Box
                        bg="white"
                        p={4}
                        w="100%"
                        h={Dimensions.get('window').height / 2}
                        position="absolute"
                        bottom={0}
                        borderTopRadius={10}
                    >
                        {/* Content for confirmed booking */}
                        <VStack space={4} alignItems="stretch">
                            <HStack justifyContent="space-between" alignItems="center">
                                <Button variant="unstyled" onPress={handleBack}>
                                    <Text>Back</Text>
                                </Button>
                                <Text>The estimated distance is: {estimatedDistance}</Text>
                            </HStack>
                            <HStack justifyContent="space-between" alignItems="center">
                                <Image
                                    source={{
                                        uri: 'https://cdn.pixabay.com/photo/2013/07/13/12/47/car-160343_1280.png',
                                    }}
                                    style={{width: 100, height: 100}}
                                />
                                <Text>{estimatedDuration}</Text>
                                <Text>MYR {orderPrice}</Text>
                            </HStack>
                            <Input
                                placeholder="Remarks (Optional)"
                                value={remarks}
                                onChangeText={setRemarks}
                            />
                            <Button mt={4} onPress={submitOrder}>
                                Done
                            </Button>
                        </VStack>
                    </Box>
                ) : (
                    <Box
                        bg="white"
                        p={4}
                        w="100%"
                        h={Dimensions.get('window').height / 2}
                        position="absolute"
                        bottom={0}
                        borderTopRadius={10}
                    >
                        {/* Content for input */}
                        <VStack space={4} alignItems="stretch">
                            <HStack space={2} alignItems="center">
                                <RemixIcon name="map-pin-line" size={20}/>
                                <Input
                                    flex={1}
                                    placeholder="Departure"
                                    value={departure}
                                    onChangeText={(text) => {
                                        setIsDepartureSelected(false);
                                        setDeparture(text);
                                        updateAddressSuggestions(text, setDepartureSuggestions);
                                    }}
                                />
                            </HStack>
                            {showDepartureSuggestions && departureSuggestions.slice(0, 5).map((suggestion) => (
                                <Text
                                    key={suggestion.place_id}
                                    onPress={async () => {
                                        setIsDepartureSelected(true);
                                        let addressParts = suggestion.description.split(','); // Split the address into parts
                                        let shortAddress = addressParts.slice(0, 2).join(','); // Join the first two parts
                                        setDeparture(shortAddress); // 然后更新出发地的值
                                        setDepartureAddress(suggestion.terms); // 然后更新出发地的值
                                        setShowDepartureSuggestions(false); // 先关闭推荐列表

                                        // 获取新的出发地的经纬度
                                        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(shortAddress)}&key=AIzaSyCTgmg64j-V2pGH2w6IgdLIofaafqWRwzc`);
                                        const data = await response.json();
                                        const location = data.results[0].geometry.location;
                                        setDepartureCoords({latitude: location.lat, longitude: location.lng}); // 这里保存新的出发地的经纬度

                                        moveToLocation(suggestion.place_id); // 这里添加代码使地图移动到新的出发地
                                    }}
                                >
                                    {suggestion.description}
                                </Text>
                            ))}
                            <HStack space={2} alignItems="center">
                                <RemixIcon name="flag-line" size={20}/>
                                <Input
                                    flex={1}
                                    placeholder="Destination"
                                    value={destination}
                                    onChangeText={(text) => {
                                        setIsDestinationSelected(false);
                                        setDestination(text);
                                        updateAddressSuggestions(text, setDestinationSuggestions);
                                    }}
                                />
                            </HStack>
                            {showDestinationSuggestions && destinationSuggestions.slice(0, 5).map((suggestion) => (
                                <Text
                                    key={suggestion.place_id}
                                    onPress={async () => {
                                        setIsDestinationSelected(true);
                                        let addressParts = suggestion.description.split(','); // Split the address into parts
                                        let shortAddress = addressParts.slice(0, 2).join(','); // Join the first two parts
                                        setDestination(shortAddress); // 更新目的地的值
                                        setDestinationAddress(suggestion.terms); // 更新目的地的值
                                        setShowDestinationSuggestions(false); // 先关闭推荐列表
                                        // 获取新的目的地的经纬度
                                        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(shortAddress)}&key=AIzaSyCTgmg64j-V2pGH2w6IgdLIofaafqWRwzc`);
                                        const data = await response.json();
                                        const location = data.results[0].geometry.location;
                                        setDestinationCoords({latitude: location.lat, longitude: location.lng});

                                        // 路径规划的逻辑已经移到 handleNextStep 函数中，这里不再需要
                                    }}
                                >
                                    {suggestion.description}
                                </Text>
                            ))}
                            <Pressable onPress={handleOpenDatePicker}
                                       style={{flexDirection: 'row', alignItems: 'center'}}>
                                <HStack space={2} alignItems="center">
                                    <RemixIcon name="calendar-2-fill" size={20} color="gray"/>
                                    <Box flex={1} borderWidth={1} borderColor="#ddd" borderRadius={4} p={2}>
                                        <Text flexShrink={1}>{date ? formatDate(date) : 'Select Time'}</Text>
                                    </Box>
                                </HStack>
                            </Pressable>
                            <Pressable onPress={() => setModalVisible(true)}
                                       style={{flexDirection: 'row', alignItems: 'center'}}>
                                <HStack space={2} alignItems="center">
                                    <RemixIcon name="group-line" size={20} color="gray"/>
                                    <Box flex={1} borderWidth={1} borderColor="#ddd" borderRadius={4} p={2}>
                                        <Text
                                            flexShrink={1}>{`${passengerCount} passenger${passengerCount > 1 ? 's' : ''}`}</Text>
                                    </Box>
                                </HStack>
                            </Pressable>
                            <Button
                                mt={4}
                                onPress={allowOrder}
                                style={{
                                    paddingVertical: 15,
                                    paddingHorizontal: 20,
                                    borderRadius: 10
                                }}
                            >
                                Next Step
                            </Button>
                            <DatePicker
                                modal
                                open={open}
                                date={date || new Date()}
                                minimumDate={new Date()}
                                onConfirm={(date) => {
                                    setOpen(false);
                                    setDate(date);
                                }}
                                onCancel={() => {
                                    setOpen(false);
                                }}
                            />
                            <Modal
                                isOpen={modalVisible}
                                onClose={() => setModalVisible(false)}
                                avoidKeyboard
                                justifyContent="flex-end"
                                bottom="4"
                            >
                                <Modal.Content
                                    maxWidth="100%"
                                    width={Dimensions.get('window').width}
                                    alignSelf="center"
                                >
                                    <Modal.CloseButton/>
                                    <Modal.Header>How many of you will go?</Modal.Header>
                                    <Modal.Body>
                                        <VStack space={4} alignItems="center">
                                            <HStack
                                                justifyContent="space-between"
                                                alignItems="center"
                                                width="100%"
                                            >
                                                <Button
                                                    onPress={() =>
                                                        setPassengerCount(
                                                            passengerCount > 1 ? passengerCount - 1 : 1
                                                        )
                                                    }
                                                >
                                                    -
                                                </Button>
                                                <Text fontSize="xl">{passengerCount}</Text>
                                                <Button
                                                    onPress={() => setPassengerCount(passengerCount + 1)}
                                                >
                                                    +
                                                </Button>
                                            </HStack>
                                        </VStack>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            flex="1"
                                            onPress={() => {
                                                setModalVisible(false);
                                            }}
                                        >
                                            Done
                                        </Button>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>
                        </VStack>
                    </Box>
                )}
            </View>
        </NativeBaseProvider>
    );
};

export default RideOrderScreen;
