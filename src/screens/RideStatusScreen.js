import React, { useState } from 'react';
import { Box, Text, Icon, VStack, HStack, Badge, NativeBaseProvider, IconButton, View } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, StyleSheet } from 'react-native';

const RideStatusScreen = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const rides = [
        {id: 1, departure: "Kolej Ibu Zain, UKM 43600 Bangi, Selangor", destination: "Jalan KLIA 164000 Sepang, Selangor", time: "2:00 PM", status: "Pending"},
        {id: 2, departure: "Kolej Ibu Zain, UKM 43600 Bangi, Selangor", destination: "Jalan KLIA 164000 Sepang, Selangor", time: "2:00 PM", status: "Completed"},
        {id: 3, departure: "Kolej Ibu Zain, UKM 43600 Bangi, Selangor", destination: "Jalan KLIA 164000 Sepang, Selangor", time: "2:00 PM", status: "Completed"},
        {id: 4, departure: "Kolej Ibu Zain, UKM 43600 Bangi, Selangor", destination: "Jalan KLIA 164000 Sepang, Selangor", time: "2:00 PM", status: "Cancel"},
        {id: 5, departure: "Kolej Ibu Zain, UKM 43600 Bangi, Selangor", destination: "Jalan KLIA 164000 Sepang, Selangor", time: "2:00 PM", status: "Cancel"},
        // Add more rides as needed...
    ];

    const totalItems = rides.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedRides = rides.slice(startIndex, endIndex);

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {displayedRides.map((ride, index) => (
                        <Box bg="white" shadow={2} rounded="lg" p={4} my={2} key={index}>
                            <VStack space={4}>
                                <HStack space={2} alignItems="center">
                                    <Icon as={<MaterialIcons name="place" />} size="sm" color="blue.500" />
                                    <Text>Departure: {ride.departure}</Text>
                                </HStack>
                                <HStack space={2} alignItems="center">
                                    <Icon as={<MaterialIcons name="place" />} size="sm" color="red.500" />
                                    <Text>Destination: {ride.destination}</Text>
                                </HStack>
                                <HStack space={2} alignItems="center">
                                    <Icon as={<MaterialIcons name="date-range" />} size="sm" color="green.500" />
                                    <Text>Time: {ride.time}</Text>
                                </HStack>
                            </VStack>
                            <Badge
                                bg={
                                    ride.status === 'Pending'
                                        ? 'yellow.500'
                                        : ride.status === 'Completed'
                                            ? 'green.500'
                                            : 'red.500'
                                }
                                px={3}
                                rounded="md"
                                mt={4}
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="row"
                            >
                                <Box py={2}>
                                    <Text color="white" ml={2}>
                                        {ride.status}
                                    </Text>
                                </Box>
                            </Badge>
                        </Box>
                    ))}
                </ScrollView>
                <View style={styles.pagination}>
                    <HStack justifyContent="space-between" px={5} py={3}>
                        <IconButton
                            icon={<MaterialIcons name="navigate-before" />}
                            isDisabled={currentPage === 1}
                            onPress={handlePreviousPage}
                        />
                        <Text>{currentPage}</Text>
                        <IconButton
                            icon={<MaterialIcons name="navigate-next" />}
                            isDisabled={currentPage === totalPages}
                            onPress={handleNextPage}
                        />
                    </HStack>
                </View>
            </View>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollView: {
        paddingBottom: 60,
    },
    pagination: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
    },
});

export default RideStatusScreen;
