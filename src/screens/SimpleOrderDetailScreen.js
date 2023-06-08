import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, VStack, HStack, Button, Text } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import { View, Dimensions, Alert } from 'react-native';
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

    const handleBack = () => {
        navigation.goBack('OrderListScreen');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        map: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },
    });

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                {departureCoords && destinationCoords && ( // Add this line
                    <MapView
                        style={{ ...styles.map, marginBottom: Dimensions.get('window').height / 2 }}
                        region={{
                            latitude: (departureCoords.lat + destinationCoords.lat) / 2,
                            longitude: (departureCoords.lng + destinationCoords.lng) / 2,
                            latitudeDelta: Math.abs(departureCoords.lat - destinationCoords.lat) * 2 * 1.8,
                            longitudeDelta: Math.abs(departureCoords.lng - destinationCoords.lng) * 2 * 1.8,
                        }}
                    >
                        <Marker coordinate={{latitude: departureCoords.lat, longitude: departureCoords.lng}} />
                        <Marker coordinate={{latitude: destinationCoords.lat, longitude: destinationCoords.lng}} />
                    </MapView>
                )}
                <Box
                    bg="white"
                    p={4}
                    w="100%"
                    h={Dimensions.get('window').height / 2}
                    position="absolute"
                    bottom={0}
                    borderTopRadius={10}
                >
                    <VStack space={4} alignItems="stretch">
                        <HStack justifyContent="space-between" alignItems="center">
                            <Button
                                variant="solid"
                                colorScheme="blue"
                                onPress={handleBack}
                                startIcon={<RemixIcon name="arrow-left-line" size={24} color="#fff" />}
                            >
                                <Text color="white">Back</Text>
                            </Button>
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
                        <Button
                            variant="solid"
                            colorScheme={Status === 'Completed' ? 'green' : 'orange'}
                            mt={4}
                        >
                            <Text>Status: {Status}</Text>
                        </Button>
                    </VStack>
                </Box>
            </View>
        </NativeBaseProvider>
    );
};

export default SimpleOrderDetailScreen;
