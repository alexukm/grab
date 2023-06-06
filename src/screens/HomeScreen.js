import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Box, AspectRatio, Button, Center, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';


const HomeScreen = () => {
    const navigation = useNavigation();

    const handlePress = (screen) => {
        if (screen === 'RideOrderScreen') {
            navigation.navigate('Orders', { screen: 'RideOrderScreen' });
        } else if (screen === 'OrderDetailScreen') {
            navigation.navigate('Orders', { screen: 'OrderDetailScreen' });
        } else {
            navigation.navigate(screen);
        }
    };

    const Card = ({ imageUri, title, description }) => (
        <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
                <Image source={{ uri: imageUri }} style={{ flex: 1 }} />
            </AspectRatio>
            <Center
                bg="violet.500"
                position="absolute"
                bottom="0"
                left="20%"
                right="20%"
                _text={{color: "warmGray.50", fontWeight: "700", fontSize: "md"}}
                px="3"
                py="1.5">
                <Text>
                    {title}
                </Text>
                <Text fontWeight="500">
                    {description}
                </Text>
            </Center>
        </Box>
    );

    const CardWithoutDescription = ({ imageUri }) => (
        <Box
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            backgroundColor="gray.50">
            <AspectRatio w="100%" ratio={16 / 9}>
                <Image source={{ uri: imageUri }} style={{ flex: 1 }} />
            </AspectRatio>
        </Box>
    );

    return (

        <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
            <View style={{width: '100%', height: 120, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', paddingLeft: 20}}>
                <Image source={{ uri: "https://i.ibb.co/84stgjq/uber-technologies-new-20218114.jpg" }} style={{ width: 100, height: 100}} />
            </View>

            <View style={{height: "40%", width: "100%"}}>
                <Swiper showsButtons={true}>
                    <Box>
                        <Card imageUri="https://i.ibb.co/cyvcpfF/uberx.png" title="Advertisement 1" description="Advertisement 1 Description" />
                    </Box>
                    <Box>
                        <Card imageUri="https://i.ibb.co/n776JLm/bike.png" title="Advertisement 2" description="Advertisement 2 Description" />
                    </Box>
                    <Box>
                        <Card imageUri="https://i.ibb.co/5RjchBg/uberschedule.png" title="Advertisement 3" description="Advertisement 3 Description" />
                    </Box>
                </Swiper>
            </View>

            <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 5, paddingHorizontal: 5}}>
                <TouchableOpacity onPress={() => handlePress('RideOrderScreen')} style={{width: "47%"}}>
                    <Box>
                        <CardWithoutDescription imageUri="https://i.ibb.co/cyvcpfF/uberx.png" />
                    </Box>
                    <Button onPress={() => handlePress('RideOrderScreen')}>Go to Ride</Button>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('ServiceScreen')} style={{width: "47%"}}>
                    <Box>
                        <CardWithoutDescription imageUri="https://i.ibb.co/n776JLm/bike.png" />
                    </Box>
                    <Button onPress={() => handlePress('ServiceScreen')}>Go to Service</Button>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreen;
