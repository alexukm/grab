import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, VStack, HStack, Button, Text, Link } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import { View, Dimensions, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import Geocoder from 'react-native-geocoding';
import RemixIcon from 'react-native-remix-icon';

Geocoder.init('AIzaSyCTgmg64j-V2pGH2w6IgdLIofaafqWRwzc');

const DriverOrderDetailScreen = () => {
    const Departure = 'KLIA'; // 声明出发地址
    const Destination = 'KLCC'; // 声明目的地地址
    const Time = '03/15/2023 16:56'; // 声明日期和时间
    const Price = 'MYR 75'; // 声明价格
    const [status, setStatus] = useState('Start your ride'); // 声明状态
    const [departureCoords, setDepartureCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);

    useEffect(() => {
        Geocoder.from(Departure)
            .then(json => {
                var location = json.results[0].geometry.location;
                setDepartureCoords(location);
            })
            .catch(error => console.warn(error));

        Geocoder.from(Destination)
            .then(json => {
                var location = json.results[0].geometry.location;
                setDestinationCoords(location);
            })
            .catch(error => console.warn(error));
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        map: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height * 0.4,
        },
        orderBox: {
            height: Dimensions.get('window').height * 0.6,
        },
        fullScreen: StyleSheet.absoluteFillObject,
    });

    const toggleStatus = () => {
        switch (status) {
            case 'Start your ride':
                setStatus('In transit');
                break;
            case 'In transit':
                setStatus('Completed');
                break;
            default:
                setStatus('Start your ride');
        }
    };

    const InfoBox = ({ title, children }) => (
        <Box bg="white" shadow={2} rounded="lg" p={4}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
            <VStack space={4} mt={3}>
                {children}
            </VStack>
        </Box>
    );

    const OrderInfoBox = () => {
        const getColorScheme = () => {
            switch (status) {
                case 'Start your ride':
                    return 'yellow';
                case 'In transit':
                    return 'green';
                case 'Completed':
                    return 'transparent';
                default:
                    return 'blue';
            }
        };

        const getTextColor = () => {
            if (status === 'Completed') return 'black';
            else return 'white';
        };

        const renderCancelOrder = () => {
            if (status === 'Start your ride') {
                return (
                    <Link href="#" onPress={() => console.log("Order cancelled.")}>
                        Cancel Order
                    </Link>
                );
            }
            return null;
        };

        return (
            <InfoBox title="Order Information">
                <HStack space={2} alignItems="center">
                    <RemixIcon name="map-pin-line" size={24} color="blue" />
                    <Text>Departure: {Departure}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RemixIcon name="map-pin-line" size={24} color="red" />
                    <Text>Destination: {Destination}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RemixIcon name="calendar-check-line" size={24} color="black" />
                    <Text>Date and Time: {Time}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RemixIcon name="wallet-3-line" size={24} color="black" />
                    <Text>Price: {Price}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <Button
                        style={{
                            height: 40,
                            width: '50%',
                            backgroundColor: '#D3D3D3',
                            alignItems: 'flex-start',
                        }}
                        onPress={() => console.log('Chat with Passenger')}
                        variant="ghost"
                    >
                        <HStack
                            space={2}
                            alignItems="center"
                            style={{ width: '100%', justifyContent: 'flex-start' }}
                        >
                            <RemixIcon name="chat-smile-2-line" size={24} color="black" />
                            {/*<Text>Chat with your passenger</Text>*/}
                        </HStack>
                    </Button>
                    <Button
                        style={{
                            height: 40,
                            width: '50%',
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: 'black',
                        }}
                        onPress={() => console.log('Call Passenger')}
                        variant="ghost"
                    >
                        <RemixIcon name="phone-line" size={24} color="black" />
                    </Button>
                </HStack>
                <Button variant="solid" colorScheme={getColorScheme()} onPress={toggleStatus}>
                    <Text color={getTextColor()}>Status: {status}</Text>
                </Button>
                {renderCancelOrder()}
            </InfoBox>
        );
    };

    const MapComponent = () => (
        <>
            <MapView
                style={styles.map}
                region={{
                    latitude: (departureCoords.lat + destinationCoords.lat) / 2,
                    longitude: (departureCoords.lng + destinationCoords.lng) / 2,
                    latitudeDelta: Math.abs(departureCoords.lat - destinationCoords.lat) * 2 * 1.8,
                    longitudeDelta: Math.abs(departureCoords.lng - destinationCoords.lng) * 2 * 1.8,
                }}
            >
                <Marker coordinate={{ latitude: departureCoords.lat, longitude: departureCoords.lng }} />
                <Marker
                    coordinate={{ latitude: destinationCoords.lat, longitude: destinationCoords.lng }}
                />
            </MapView>
        </>
    );

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                {departureCoords && destinationCoords && <MapComponent />}
                <ScrollView style={styles.orderBox}>
                    <OrderInfoBox />
                </ScrollView>
            </View>
        </NativeBaseProvider>
    );
};

export default DriverOrderDetailScreen;
