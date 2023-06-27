import React, {useEffect} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Box, AspectRatio, Button, Center, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';

// import PushNotification from 'react-native-push-notification';


const UserHomeScreen = () => {
    const navigation = useNavigation();

    const subscriptionOrderAccept = () => {
        setTimeout(async () => {
            const token = defaultHeaders.getAuthentication(await getUserToken());
            const client = defaultClient(token);

            client.connect((frame) => {
                console.log('Connecting successfully');
                client.subscribe('/user/topic/orderAccept', (body) => {
                    // console.log(body)
                    // todo  调用系统通知
                    // PushNotification.orderSuccessNotification({
                    //     /* Android Only Properties */
                    //     channelId: "Driver picked your order up!", // (required) channelId, if the channel does not exist, notification will not trigger.
                    //     /* iOS and Android properties */
                    //     title: "Your order", // (optional)
                    //     message: "Your order accepted", // (required)
                    //     // playSound: true, // (optional) default: true
                    //     // soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
                    //     // number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
                    // });
                    alert("Your order accepted")
                })
            }, (err) => {
                // alert("Connection error,please try again later! ")
                console.log('Connection error:' + JSON.stringify(err));
            }, (close) => {
                // alert("Connection close")
                console.log('Connection close:' + JSON.stringify(close));
            });

        }, 0)
    }

    useEffect(() => {
        subscriptionOrderAccept()
    }, []);

    const handlePress = (screen) => {
        if (screen === 'RideOrderScreen') {
            navigation.navigate('Orders', {screen: 'RideOrderScreen'});
        } else if (screen === 'OrderDetailScreen') {
            navigation.navigate('Orders', {screen: 'OrderDetailScreen'});
        } else {
            navigation.navigate(screen);
        }
    };

    const Card = ({imageUri, title, description}) => (
        <Box
            bg="white"
            style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
        >
            <AspectRatio w="100%" ratio={16 / 9}>
                <Image source={{uri: imageUri}} style={{flex: 1}}/>
            </AspectRatio>
            <Center
                bg="white"
                position="absolute"
                bottom="0"
                left="20%"
                right="20%"
                _text={{color: "black", fontWeight: "700", fontSize: "md"}}
                px="3"
                py="1.5"
                style={{justifyContent: 'flex-end'}} // 将内容对齐到下方
            >
                <Text>
                    {title}
                </Text>
                <Text fontWeight="500">
                    {description}
                </Text>
            </Center>
        </Box>
    );
    const CardWithoutDescription = ({imageUri}) => (
        <View style={{height: 200}}>
            <Box
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                backgroundColor="gray.50"
            >
                <AspectRatio w="100%" ratio={2 / 3}>
                    <Image source={{uri: imageUri}} style={{flex: 1}}/>
                </AspectRatio>
            </Box>
        </View>
    );

    return (

        <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
            <View style={{
                width: '100%',
                height: 120,
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row',
                paddingLeft: 20
            }}>
                <Image source={{uri: "https://i.ibb.co/84stgjq/uber-technologies-new-20218114.jpg"}}
                       style={{width: 100, height: 100}}/>
            </View>

            <View style={{height: "40%", width: "100%"}}>
                <Swiper showsButtons={false}>
                    <Box>
                        <Card imageUri="https://images.pexels.com/photos/5507250/pexels-photo-5507250.jpeg"
                              title="Advertisement 1" description="Advertisement 2 Description"/>
                    </Box>
                    <Box>
                        <Card
                            imageUri="https://images.pexels.com/photos/16091030/pexels-photo-16091030.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            title="Advertisement 2" description="Advertisement 2 Description"/>
                    </Box>
                    <Box>
                        <Card
                            imageUri="https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            title="Advertisement 3" description="Advertisement 3 Description"/>
                    </Box>
                </Swiper>
            </View>

            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 5,
                paddingHorizontal: 5
            }}>
                <TouchableOpacity onPress={() => handlePress('RideOrderScreen')} style={{width: "47%"}}>
                    <Box>
                        <CardWithoutDescription
                            imageUri="https://images.pexels.com/photos/4701604/pexels-photo-4701604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
                    </Box>
                    <Button onPress={() => handlePress('RideOrderScreen')} style={{backgroundColor: '#3498db'}}>Go to
                        Ride</Button>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('ServiceScreen')} style={{width: "47%"}}>
                    <Box>
                        <CardWithoutDescription
                            imageUri="https://images.pexels.com/photos/518244/pexels-photo-518244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
                    </Box>
                    <Button onPress={() => handlePress('ServiceScreen')} style={{backgroundColor: '#3498db'}}>Go to
                        Service</Button>
                </TouchableOpacity>
            </View>
        </View>
    );
};


import Swiper from 'react-native-swiper';
import defaultClient, {defaultWebsocketClient} from "../com/evotech/common/websocket/WebSocketClient";
import {defaultHeaders} from "../com/evotech/common/http/HttpUtil";
import {getUserToken} from "../com/evotech/common/appUser/UserConstant";

export default UserHomeScreen;
