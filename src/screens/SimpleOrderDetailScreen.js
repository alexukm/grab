import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, VStack, HStack, Button, Text, Avatar } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import { View, Dimensions, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import Geocoder from 'react-native-geocoding';
import RemixIcon from 'react-native-remix-icon';

Geocoder.init('AIzaSyCTgmg64j-V2pGH2w6IgdLIofaafqWRwzc');

const SimpleOrderDetailScreen = ({ route, navigation }) => {
    const { Departure, Destination, Time, Price, Status } = route.params;
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
            height: Dimensions.get('window').height / 2,
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
        fullScreen: StyleSheet.absoluteFillObject,
    });

    const handleBack = () => {
        navigation.goBack('OrderListScreen');
    };


    const InfoBox = ({ title, children }) => (
        <Box bg="white" shadow={2} rounded="lg" p={4}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
            <VStack space={4} mt={3}>
                {children}
            </VStack>
        </Box>
    );


    const OrderInfoBox = ({ showStatus }) => (
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
            {showStatus && (
                <Button variant="solid" colorScheme="blue">
                    <Text>Status: {Status}</Text>
                </Button>
            )}
        </InfoBox>
    );


    const PaymentInfoBox = () => (
        <InfoBox title="Payment Information">
            <VStack space={4} alignItems="stretch">
                <HStack>
                    <Text>Order No: 123456789</Text>
                </HStack>
                <HStack>
                    <Text>Payment No: 987654321</Text>
                </HStack>
                <HStack>
                    <Text>Payment Method: Credit Card</Text>
                </HStack>
                <HStack>
                    <Text>Payment Amount: {Price}</Text>
                </HStack>
                <HStack>
                    <Text>Payment Status: Paid</Text>
                </HStack>
                <Button variant="solid" colorScheme="blue">
                    <Text>Status: {Status}</Text>
                </Button>
            </VStack>
        </InfoBox>
    );

    const DriverInfoBox = ({ showBack }) => (
        <InfoBox title="Driver Information" showBack={true}>
        <VStack space={4} alignItems="stretch">
                <HStack style={styles.driverInfo}>
                    <Avatar
                        size="lg"
                        source={{
                            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                        }}
                    />
                    <VStack>
                        <Text>Driver Name: John Doe</Text>
                        <Text>Car Model: Toyota</Text>
                        <Text>License Plate: XYZ 1234</Text>
                    </VStack>
                    <VStack>
                        <Button
                            onPress={() => console.log('Call Driver')}
                            variant="ghost"
                        >
                            <RemixIcon name="phone-line" size={24} color="black" />
                        </Button>
                        <Button
                            onPress={() => console.log('Chat with Driver')}
                            variant="ghost"
                        >
                            <RemixIcon name="message-3-line" size={24} color="black" />
                        </Button>
                    </VStack>
                </HStack>
            </VStack>
        </InfoBox>
    );

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
                <Marker coordinate={{ latitude: destinationCoords.lat, longitude: destinationCoords.lng }} />
            </MapView>
        </>
    );


    const renderContentBasedOnStatus = () => {
        switch (Status) {
            case 'Pending':
                return (
                    <ScrollView style={styles.fullScreen}>
                    {departureCoords && destinationCoords && <MapComponent />}
                        <OrderInfoBox showStatus={true} />
                    </ScrollView>
                );
            case 'Awaiting departure':
            case 'In transit':
                return (
                    <>
                        {departureCoords && destinationCoords && (
                            <ScrollView style={styles.fullScreen}>
                                <MapComponent />
                                <OrderInfoBox showStatus={false} />
                                <DriverInfoBox showBack={true} />

                            </ScrollView>
                        )}
                    </>
                );
            case 'Arrived':
                return (
                    <ScrollView style={styles.fullScreen}>
                        <DriverInfoBox showBack={true} />
                        <OrderInfoBox showStatus={false} />
                        <PaymentInfoBox />
                    </ScrollView>
                );
            case 'Cancelled':
                return (
                    <ScrollView style={styles.fullScreen}>
                        <OrderInfoBox showStatus={true} />
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

export default SimpleOrderDetailScreen;
