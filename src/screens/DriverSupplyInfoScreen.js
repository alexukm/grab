import React, { useState } from 'react';
import {SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, Alert} from 'react-native';
import {
    Center,
    Box,
    VStack,
    Button,
    FormControl,
    Input,
    NativeBaseProvider,
    Icon,
    Text,
    Tooltip,
    IconButton,
    Flex
} from 'native-base';
import RemixIcon from 'react-native-remix-icon';
import { launchImageLibrary } from 'react-native-image-picker';
import { driverUpload } from "../com/evotech/common/http/BizHttpUtil";
import { DriverImageType } from "../com/evotech/common/appUser/UserConstant";
import { getUserInfoWithLocal } from "../com/evotech/common/appUser/UserInfo";

const DriverSupplyInfoScreen = () => {
    const [uploadedCarPath, setUploadedCarPath] = useState(false);
    const [info, setInfo] = useState({
        userPhone: "",
        chassisNumber: "",
        carRegistryDate: "",
        carColor: "",
        carType: "",
        carBrand: "",
        bankAccount: "",
        bankName: "",
        bankHolderName: "",
        bankAddress: "",
        emergencyName: "",
        emergencyPhone: "",
        emergencyRs: "",
        emergencyAddress: "",
    });

    const handleChange = (name, value) => {
        setInfo({...info, [name]: value});
    };

    const uploadImage = () => {
        const options = {
            quality: 1.0,
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, async response => {
            if (response.didCancel) {
                alert('User cancelled image picker');
            } else if (response.error) {
                alert('ImagePicker Error: ' + JSON.stringify(response.error));
            } else {
                const uri = response.assets[0].uri;
                const userInfo = await getUserInfoWithLocal();
                const params = {
                    uploadType: DriverImageType.Vehicle,
                    userPhone: userInfo.userPhone,
                };
                try {
                    driverUpload(uri, params)
                        .then(data => {
                            alert("图片上传结果" + data.message);
                            setUploadedCarPath(true);
                        }).catch(err => {
                        alert("图片上传异常" + err.message);
                    });
                } catch (error) {
                    alert('Failed to upload file: ' + error.message);
                }
            }
        });
    };

    const handleSubmit = () => {
        const missingFields = Object.entries(info)
            .filter(([name, value]) => !value)
            .map(([name, value]) => name);

        if (!uploadedCarPath) {
            missingFields.push('uploadedCarPath');
        }

        if (missingFields.length > 0) {
            Alert.alert('Missing Information', 'Please fill in the following: ' + missingFields.join(', '));
        } else {
            // Call your API here
        }
    };


    // divide the fields into categories
    const carFields = ["userPhone", "chassisNumber", "carRegistryDate", "carColor", "carType", "carBrand"];
    const bankFields = ["bankAccount", "bankName", "bankHolderName", "bankAddress"];
    const emergencyFields = ["emergencyName", "emergencyPhone", "emergencyRs", "emergencyAddress"];
    const categories = {"Car Information": carFields, "Bank Information": bankFields, "Emergency Contact Information": emergencyFields};

    return (
        <NativeBaseProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <VStack space={4} alignItems="center" safeArea flex={1} p={4} width="100%">
                            <VStack space={1} width="100%">
                                <Box bg='white' p={4} shadow={1} rounded="lg" marginTop={5}>
                                    <Text bold>Driver Supply Information</Text>
                                    <Text pt={4}>
                                        This interface only collects information for verification purposes and will
                                        not disclose any personal details. Once all the information have been
                                        filled, you can submit for verification.
                                    </Text>
                                </Box>

                                <Box bg="white" p={4} shadow={1} rounded="lg" marginTop={5} flexDirection="row" justifyContent="space-between">
                                    <VStack alignItems="flex-start">
                                        <Text bold>Car Photo</Text>
                                        <Text>Please upload your Car Photo...</Text>
                                    </VStack>
                                    <Button
                                        p={0}
                                        w={10}
                                        h={10}
                                        rounded="full"
                                        bg={uploadedCarPath ? 'green.500' : 'blue.500'}
                                        onPress={uploadImage}
                                    >
                                        <Icon as={RemixIcon}
                                              name={uploadedCarPath ? 'check-line' : 'add-line'}
                                              color="white"/>
                                    </Button>
                                </Box>

                                {Object.entries(categories).map(([category, fields]) => (
                                    <Box bg="white" p={4} shadow={1} rounded="lg" marginTop={5}>
                                        <Text bold>{category}</Text>
                                        {fields.map((name) => (
                                            <Flex direction="row" justify="space-between" alignItems="center" marginTop={5}>
                                                <Box flex={0.3}>
                                                    <Text fontSize="xs">{name}</Text>
                                                </Box>
                                                <Box flex={0.7}>
                                                    <FormControl>
                                                        <Input
                                                            variant="underlined"
                                                            fontSize="xs"
                                                            placeholder={`Enter ${name}...`}
                                                            value={info[name]}
                                                            onChangeText={(value) => handleChange(name, value)}
                                                        />
                                                    </FormControl>
                                                </Box>
                                            </Flex>
                                        ))}
                                    </Box>
                                ))}
                                <Button mt={5} colorScheme="blue" onPress={handleSubmit}>
                                    <Text>Submit</Text>
                                </Button>
                            </VStack>
                        </VStack>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </SafeAreaView>
        </NativeBaseProvider>
    );
};

export default DriverSupplyInfoScreen;
