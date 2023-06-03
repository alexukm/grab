import React, { useState } from 'react';
import { Dimensions, Image, Pressable, View } from 'react-native';
import { Box, Button, HStack, Input, NativeBaseProvider, Text, VStack, Modal } from 'native-base';
import MapView from 'react-native-maps';
import RemixIcon from 'react-native-remix-icon';
import DatePicker from 'react-native-date-picker';

const HomeScreen = () => {
    const [date, setDate] = useState(null);
    const [open, setOpen] = useState(false);
    const [passengerCount, setPassengerCount] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

    const handleOpenDatePicker = () => {
        setOpen(true);
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString('en-US', options).replace(',', '');
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
                    style={styles.map}
                    initialRegion={{
                        latitude: 2.9435,
                        longitude: 101.7654,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
                {isBookingConfirmed ?
                    <Box bg="white" p={4} w="100%" h={Dimensions.get('window').height / 2} position="absolute" bottom={0} borderTopRadius={10}>
                        <VStack space={4} alignItems="stretch">
                            <HStack justifyContent="space-between" alignItems="center">
                                <Button variant="unstyled" onPress={() => setIsBookingConfirmed(false)}>
                                    <Text>Back</Text>
                                </Button>
                                <Text>The estimated distance is: 10.6 KM</Text>
                            </HStack>
                            <HStack justifyContent="space-between" alignItems="center">
                                <Image source={{uri: 'https://cdn.pixabay.com/photo/2013/07/13/12/47/car-160343_1280.png'}} style={{width: 100, height: 100}} />
                                <Text>23 mins</Text>
                                <Text>MYR 23</Text>
                            </HStack>
                            <Button
                                mt={4}
                                onPress={() => {/* your button's onPress function here */}}
                            >
                                Done
                            </Button>
                        </VStack>
                    </Box>
                    :
                    <Box bg="white" p={4} w="100%" h={Dimensions.get('window').height / 2} position="absolute" bottom={0} borderTopRadius={10}>
                        <VStack space={4} alignItems="stretch">
                            <HStack space={2} alignItems="center">
                                <RemixIcon name="map-pin-line" size={20} />
                                <Input flex={1} placeholder="Departure" />
                            </HStack>
                            <HStack space={2} alignItems="center">
                                <RemixIcon name="flag-line" size={20} />
                                <Input flex={1} placeholder="Destination" />
                            </HStack>
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
                            <Button
                                mt={4}
                                onPress={() => setIsBookingConfirmed(true)}
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
                            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} avoidKeyboard justifyContent="flex-end" bottom="4">
                                <Modal.Content maxWidth="100%" width={Dimensions.get('window').width} alignSelf="center">
                                    <Modal.CloseButton />
                                    <Modal.Header>How many of you will go?</Modal.Header>
                                    <Modal.Body>
                                        <VStack space={4} alignItems="center">
                                            <HStack justifyContent="space-between" alignItems="center" width="100%">
                                                <Button onPress={() => setPassengerCount(passengerCount > 1 ? passengerCount - 1 : 1)}>-</Button>
                                                <Text fontSize="xl">{passengerCount}</Text>
                                                <Button onPress={() => setPassengerCount(passengerCount + 1)}>+</Button>
                                            </HStack>
                                        </VStack>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button flex="1" onPress={() => {
                                            setModalVisible(false);
                                        }}>
                                            Done
                                        </Button>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>
                        </VStack>
                    </Box>
                }
            </View>
        </NativeBaseProvider>
    );
};

export default HomeScreen;
