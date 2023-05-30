import React, {useState, useEffect} from 'react';
import {SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, ScrollView} from 'react-native';
import {Center, Box, VStack, Button, FormControl, NativeBaseProvider, Icon, Text} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {driverUpload} from "../com/studentlifestyle/common/http/BizHttpUtil";
import {DriverImageType} from "../com/studentlifestyle/common/appUser/UserConstant";
import {getUserInfoWithLocal} from "../com/studentlifestyle/common/appUser/UserInfo";


const ImageUploadPage = () => {
    const [uploadedSelfie, setUploadedSelfie] = useState(false);
    const [uploadedCarInsurance, setUploadedCarInsurance] = useState(false);
    const [uploadedLicense, setUploadedLicense] = useState(false);
    const [uploadedIdCardFront, setUploadedIdCardFront] = useState(false);
    const [uploadedIdCardBack, setUploadedIdCardBack] = useState(false);
    const [uploadedPassport, setUploadedPassport] = useState(false);
    const [documentType, setDocumentType] = useState('ID');

    useEffect(() => {
        if (
            uploadedSelfie &&
            uploadedCarInsurance &&
            uploadedLicense &&
            (documentType === 'ID' ? (uploadedIdCardFront && uploadedIdCardBack) : uploadedPassport)
        ) {
            Alert.alert('Success', 'All documents uploaded successfully!');
            // 这里可以进行页面跳转或其他操作
        }
    }, [uploadedSelfie, uploadedCarInsurance, uploadedLicense, uploadedIdCardFront, uploadedIdCardBack, uploadedPassport, documentType]);


    const uploadImage = (setUploadStatus, uploadType) => {
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
                alert('ImagePicker Error: '+JSON.stringify(response.error));
            } else {
                const uri = response.assets[0].uri;
                const userInfo = await getUserInfoWithLocal()
                const params = {
                    uploadType: uploadType,
                    userPhone: userInfo.userPhone
                }
                try {
                    driverUpload(uri, params)
                        .then(data => {
                            alert("图片上传结果"+data.message);
                            setUploadStatus(true);
                        }).catch(err => {
                        alert("图片上传异常"+err.message);
                    });
                } catch (error) {
                    alert('Failed to upload file: '+error.message);
                }
            }
        });
    }


    const handleTabChange = (value) => {
        setDocumentType(value);
    };

    return (
        <NativeBaseProvider>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Center flex={1}>
                            <Box flex={1} p={4} width="100%">
                                <VStack space={4} width="100%">
                                    <Box bg='white' p={4} shadow={1} rounded="lg" marginTop={5}>
                                        <Text bold>Mention</Text>
                                        <Text pt={4}>
                                            This interface only collects information for verification purposes and will
                                            not disclose any personal details. Once all the document images have been
                                            uploaded, you will be automatically redirected to the next page.
                                        </Text>
                                    </Box>

                                    {[
                                        {
                                            label: "Selfie",
                                            desc: "Please upload your selfie...",
                                            handler: () => uploadImage(setUploadedSelfie, DriverImageType.Selfie),
                                            uploadStatus: uploadedSelfie,
                                        },
                                        {
                                            label: "Car Insurance",
                                            desc: "Please upload your Car Insurance...",
                                            handler: () => uploadImage(setUploadedCarInsurance, DriverImageType.Vehicle_Insurance),
                                            uploadStatus: uploadedCarInsurance,
                                        },
                                        {
                                            label: "License",
                                            desc: "Please upload your License...",
                                            handler: () => uploadImage(setUploadedLicense, DriverImageType.License),
                                            uploadStatus: uploadedLicense,
                                        },
                                    ].map(form => (
                                        <Box key={form.label} bg="white" p={4} shadow={1} rounded="lg" marginTop={5}
                                             flexDirection="row" justifyContent="space-between">
                                            <VStack alignItems="flex-start">
                                                <Text bold>{form.label}</Text>
                                                <Text>{form.desc}</Text>
                                            </VStack>
                                            <Button
                                                p={0}
                                                w={10}
                                                h={10}
                                                rounded="full"
                                                bg={form.uploadStatus ? 'green.500' : 'blue.500'}
                                                onPress={form.handler}
                                            >
                                                <Icon as={Ionicons} name={form.uploadStatus ? 'checkmark' : 'add'}
                                                      color="white"/>
                                            </Button>
                                        </Box>
                                    ))}

                                    <FormControl width="100%">
                                        <FormControl.Label>ID/PASSPORT</FormControl.Label>
                                        <VStack space={2}>
                                            <Button.Group variant="solid" isAttached space={2} borderColor="gray.200">
                                                <Button
                                                    onPress={() => handleTabChange('ID')}
                                                    colorScheme={documentType === 'ID' ? 'blue' : 'gray'}
                                                    flex={1}
                                                >
                                                    ID
                                                </Button>
                                                <Button
                                                    onPress={() => handleTabChange('Passport')}
                                                    colorScheme={documentType === 'Passport' ? 'blue' : 'gray'}
                                                    flex={1}
                                                >
                                                    Passport
                                                </Button>
                                            </Button.Group>
                                        </VStack>
                                    </FormControl>
                                    {documentType === 'ID' ?
                                        [
                                            {
                                                label: "ID Card Front",
                                                desc: "Please upload your ID Card Front...",
                                                handler: () => uploadImage(setUploadedIdCardFront, DriverImageType.NRIC_FRONT),
                                                uploadStatus: uploadedIdCardFront,
                                            },
                                            {
                                                label: "ID Card Back",
                                                desc: "Please upload your ID Card Back...",
                                                handler: () => uploadImage(setUploadedIdCardBack, DriverImageType.NRIC_BACK),
                                                uploadStatus: uploadedIdCardBack,
                                            }
                                        ].map(form => (
                                            <Box key={form.label} bg="white" p={4} shadow={1} rounded="lg" marginTop={5}
                                                 flexDirection="row" justifyContent="space-between">
                                                <VStack alignItems="flex-start">
                                                    <Text bold>{form.label}</Text>
                                                    <Text>{form.desc}</Text>
                                                </VStack>
                                                <Button
                                                    p={0}
                                                    w={10}
                                                    h={10}
                                                    rounded="full"
                                                    bg={form.uploadStatus ? 'green.500' : 'blue.500'}
                                                    onPress={form.handler}
                                                >
                                                    <Icon as={Ionicons} name={form.uploadStatus ? 'checkmark' : 'add'}
                                                          color="white"/>
                                                </Button>
                                            </Box>
                                        )) :
                                        [
                                            {
                                                label: "Passport",
                                                desc: "Please upload your Passport...",
                                                handler: () => uploadImage(setUploadedPassport, DriverImageType.Passport),
                                                uploadStatus: uploadedPassport,
                                            }
                                        ].map(form => (
                                            <Box key={form.label} bg="white" p={4} shadow={1} rounded="lg" marginTop={5}
                                                 flexDirection="row" justifyContent="space-between">
                                                <VStack alignItems="flex-start">
                                                    <Text bold>{form.label}</Text>
                                                    <Text>{form.desc}</Text>
                                                </VStack>
                                                <Button
                                                    p={0}
                                                    w={10}
                                                    h={10}
                                                    rounded="full"
                                                    bg={form.uploadStatus ? 'green.500' : 'blue.500'}
                                                    onPress={form.handler}
                                                >
                                                    <Icon as={Ionicons} name={form.uploadStatus ? 'checkmark' : 'add'}
                                                          color="white"/>
                                                </Button>
                                            </Box>
                                        ))
                                    }
                                </VStack>
                            </Box>
                        </Center>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </SafeAreaView>
        </NativeBaseProvider>
    );
};

export default ImageUploadPage;
