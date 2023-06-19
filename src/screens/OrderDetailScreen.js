import { NativeBaseProvider, Box, VStack, HStack, Button, Text } from 'native-base';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { View, Dimensions, Alert } from 'react-native';
import { StyleSheet } from 'react-native';

const OrderDetailScreen = ({ route, navigation }) => {
    const { departure, destination, date, passengerCount, pickupWaiting, coords } = route.params;
    const dateObj = new Date(date); // 将字符串转换回 Date 对象


    const handleBack = () => {
        navigation.navigate('Home');
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

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

        const dateString = date.toLocaleDateString('en-GB', options); // formats to day/month/year
        const timeString = date.toLocaleTimeString('en-US', timeOptions); // formats to hour:minute AM/PM

        return `${dateString} ${timeString}`;
    };

    const minLatitude = Math.min(...coords.map(c => c.latitude));
    const maxLatitude = Math.max(...coords.map(c => c.latitude));
    const minLongitude = Math.min(...coords.map(c => c.longitude));
    const maxLongitude = Math.max(...coords.map(c => c.longitude));
    const centerLatitude = (minLatitude + maxLatitude) / 2;
    const centerLongitude = (minLongitude + maxLongitude) / 2;
    const padding = 2.8; // 你可以调整这个值
    const latitudeDelta = (maxLatitude - minLatitude) * padding;
    const longitudeDelta = (maxLongitude - minLongitude) * padding;
    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <MapView
                    style={{ ...styles.map, marginBottom: Dimensions.get('window').height / 2 }}
                    initialRegion={{
                        latitude: centerLatitude,
                        longitude: centerLongitude,
                        latitudeDelta,
                        longitudeDelta,
                    }}
                >

                    <Polyline
                        coordinates={coords}
                        strokeWidth={4}
                        strokeColor="red"
                    />
                </MapView>
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
                            <Button variant="unstyled" onPress={handleBack}>
                                <Text>Back</Text>
                            </Button>
                        </HStack>
                        <Text>Departure: {departure}</Text>
                        <Text>Destination: {destination}</Text>
                        <Text>Date and Time: {dateObj ? formatDate(dateObj) : ''}</Text>
                        <Text>Number of Passengers: {passengerCount}</Text>
                        <Button mt={4} onPress={handlePickupWaiting}>
                            {pickupWaiting}
                        </Button>
                    </VStack>
                </Box>
            </View>
        </NativeBaseProvider>
    );
};

export default OrderDetailScreen;
