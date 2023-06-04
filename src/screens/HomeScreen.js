import React, { useState, useEffect, useRef } from 'react';
import { PermissionsAndroid, Dimensions, Image, Pressable, View, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Box, Button, HStack, Input, NativeBaseProvider, Text, VStack, Modal } from 'native-base';
import MapView from 'react-native-maps';
import RemixIcon from 'react-native-remix-icon';
import DatePicker from 'react-native-date-picker';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

Geocoder.init('AIzaSyCTgmg64j-V2pGH2w6IgdLIofaafqWRwzc'); // 将YOUR_API_KEY替换为您的逆地理编码API密钥

const HomeScreen = () => {
    const [date, setDate] = useState(null);
    const [open, setOpen] = useState(false);
    const [passengerCount, setPassengerCount] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [remarks, setRemarks] = useState('');


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

    const fetchDepartureSuggestions = async (input) => {
        if (!showDepartureSuggestions) {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&components=country:my&key=AIzaSyCTgmg64j-V2pGH2w6IgdLIofaafqWRwzc`
            );
            const data = await response.json();
            setDepartureSuggestions(data.predictions);
        }
    };

    const fetchDestinationSuggestions = async (input) => {
        if (!showDestinationSuggestions) {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&components=country:my&key=AIzaSyCTgmg64j-V2pGH2w6IgdLIofaafqWRwzc`
            );
            const data = await response.json();
            setDestinationSuggestions(data.predictions);
        }
    };

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


    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(async info => {
            const { latitude, longitude } = info.coords;
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

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const handleOpenDatePicker = () => {
        setOpen(true);
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

        const dateString = date.toLocaleDateString('en-GB', options); // formats to day/month/year
        const timeString = date.toLocaleTimeString('en-US', timeOptions); // formats to hour:minute AM/PM

        return `${dateString} ${timeString}`;
    };


    const handleNextStep = () => {
        if(isBookingConfirmed) {
            // Move to the Success Screen
            setIsSuccessScreen(true);
        } else {
            // Confirm the booking
            setIsBookingConfirmed(true);
        }
    };

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
                { text: 'No' },
                { text: 'Yes', onPress: () => setPickupWaiting('Cancel') }
            ]
        );
    };

    const mapRef = useRef(null);

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
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: 2.9435,
                        longitude: 101.7654,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
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
                            <Button mt={4} onPress={handlePickupWaiting}>
                                {pickupWaiting}
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
                                <Text>The estimated distance is: 10.6 KM</Text>
                            </HStack>
                            <HStack justifyContent="space-between" alignItems="center">
                                <Image
                                    source={{
                                        uri: 'https://cdn.pixabay.com/photo/2013/07/13/12/47/car-160343_1280.png',
                                    }}
                                    style={{ width: 100, height: 100 }}
                                />
                                <Text>23 mins</Text>
                                <Text>MYR 23</Text>
                            </HStack>
                            <Input
                                placeholder="Remarks (Optional)"
                                value={remarks}
                                onChangeText={setRemarks}
                            />
                            <Button mt={4} onPress={handleNextStep}>
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
                                <RemixIcon name="map-pin-line" size={20} />
                                <Input
                                    flex={1}
                                    placeholder="Departure"
                                    value={departure}
                                    onChangeText={(text) => {
                                        setIsDepartureSelected(false);
                                        setDeparture(text);
                                    }}
                                />
                            </HStack>
                            {showDepartureSuggestions && departureSuggestions.slice(0, 5).map((suggestion) => (
                                <Text
                                    key={suggestion.place_id}
                                    onPress={() => {
                                        setIsDepartureSelected(true);
                                        let addressParts = suggestion.description.split(','); // Split the address into parts
                                        let shortAddress = addressParts.slice(0, 2).join(','); // Join the first two parts
                                        setDeparture(shortAddress); // 然后更新出发地的值
                                        setShowDepartureSuggestions(false); // 先关闭推荐列表
                                        // 这里添加代码使地图移动到新的出发地
                                    }}
                                >
                                    {suggestion.description}
                                </Text>

                            ))}
                            <HStack space={2} alignItems="center">
                                <RemixIcon name="flag-line" size={20} />
                                <Input
                                    flex={1}
                                    placeholder="Destination"
                                    value={destination}
                                    onChangeText={(text) => {
                                        setIsDestinationSelected(false);
                                        setDestination(text);
                                    }}
                                />
                            </HStack>
                            {showDestinationSuggestions && destinationSuggestions.slice(0, 5).map((suggestion) => (
                                <Text
                                    key={suggestion.place_id}
                                    onPress={() => {
                                        setIsDestinationSelected(true);
                                        let addressParts = suggestion.description.split(','); // Split the address into parts
                                        let shortAddress = addressParts.slice(0, 2).join(','); // Join the first two parts
                                        setDestination(shortAddress); // 然后更新目的地的值
                                        setShowDestinationSuggestions(false); // 先关闭推荐列表
                                        // 这里添加代码使地图移动到新的目的地
                                    }}
                                >
                                    {suggestion.description}
                                </Text>

                            ))}
                            <Pressable onPress={handleOpenDatePicker} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <HStack space={2} alignItems="center">
                                    <RemixIcon name="calendar-2-fill" size={20} color="gray" />
                                    <Box flex={1} borderWidth={1} borderColor="#ddd" borderRadius={4} p={2}>
                                        <Text flexShrink={1}>{date ? formatDate(date) : 'Select Time'}</Text>
                                    </Box>
                                </HStack>
                            </Pressable>
                            <Pressable onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <HStack space={2} alignItems="center">
                                    <RemixIcon name="group-line" size={20} color="gray" />
                                    <Box flex={1} borderWidth={1} borderColor="#ddd" borderRadius={4} p={2}>
                                        <Text flexShrink={1}>{`${passengerCount} passenger${passengerCount > 1 ? 's' : ''}`}</Text>
                                    </Box>
                                </HStack>
                            </Pressable>
                            <Button mt={4} onPress={handleNextStep}>
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
                                    <Modal.CloseButton />
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

export default HomeScreen;
