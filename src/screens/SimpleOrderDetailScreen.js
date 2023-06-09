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


    const InfoBox = ({ children, showBack }) => (
        <Box style={styles.box}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 5 }} />
            {children}
        </Box>
    );



    const OrderInfoBox = ({ showStatus }) => (
        <InfoBox title="Order Information" showBack={showStatus}>
            <VStack space={4} alignItems="stretch">
                <HStack justifyContent="space-between" alignItems="center">
                </HStack>
                <HStack>
                    <RemixIcon name="map-pin-2-fill" size={24} color="black" />
                    <Text>Departure: {Departure}</Text>
                </HStack>
                <HStack>
                    <RemixIcon name="map-pin-2-fill" size={24} color="black" />
                    <Text>Destination: {Destination}</Text>
                </HStack>
                <HStack>
                    <RemixIcon name="calendar-line" size={24} color="black" />
                    <Text>Date and Time: {Time}</Text>
                </HStack>
                <HStack>
                    <RemixIcon name="money-dollar-circle-line" size={24} color="black" />
                    <Text>Price: {Price}</Text>
                </HStack>
                {showStatus && (
                    <Button variant="solid" colorScheme="blue">
                        <Text>Status: {Status}</Text>
                    </Button>
                )}
            </VStack>
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
                    <>
                        {departureCoords && destinationCoords && <MapComponent />}
                        <OrderInfoBox showStatus={true} />
                    </>
                );
            case 'Awaiting departure':
            case 'In transit':
                return (
                    <>
                        {departureCoords && destinationCoords && (
                            <>
                                <MapComponent />
                                <DriverInfoBox showBack={true} />
                                <OrderInfoBox showStatus={false} />
                            </>
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
                    <>
                        <OrderInfoBox showStatus={true} />
                    </>
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
