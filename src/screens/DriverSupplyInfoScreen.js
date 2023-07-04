import React, { useState } from 'react';
import { SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from 'react-native';
import { Center, Box, VStack, Button, FormControl, Input, NativeBaseProvider, Icon, Text, Tooltip, IconButton } from 'native-base';
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

    return (
        <NativeBaseProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Center flex={1}>
                            <Box flex={1} p={4} width="100%">
                                <VStack space={4} width="100%">
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

                                    {Object.entries(info).map(([name, value]) => (
                                        <Box key={name} bg="white" p={4} shadow={1} rounded="lg" marginTop={5} flexDirection="row" justifyContent="space-between">
                                            <FormControl>
                                                <FormControl.Label flexDirection="row" justifyContent="space-between">
                                                    {name}
                                                    <Tooltip label="This is help tip" placement="bottom right" openDelay={300}>
                                                        <IconButton icon={<Icon as={RemixIcon} name="question-line" size="xs" />} />
                                                    </Tooltip>
                                                </FormControl.Label>
                                                <Input
                                                    value={value}
                                                    onChangeText={(value) => handleChange(name, value)}
                                                />
                                            </FormControl>
                                        </Box>
                                    ))}
                                    <Button mt={5} colorScheme="blue">Submit</Button>
                                </VStack>
                            </Box>
                        </Center>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </SafeAreaView>
        </NativeBaseProvider>
    );
};

export default DriverSupplyInfoScreen;
