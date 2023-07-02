import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { MD5 } from "crypto-js";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {getUserID, setUserToken, userType} from "../com/evotech/common/appUser/UserConstant";
import { userLogin, smsSend } from "../com/evotech/common/http/BizHttpUtil";
import {
    FormControl,
    Center,
    Modal,
    VStack,
    Button,
    NativeBaseProvider,
    Input,
    Text,
    HStack,
    Radio,
} from "native-base";
import {buildUserInfo} from "../com/evotech/common/appUser/UserInfo";
import {UserTypeEnum} from "../com/evotech/common/constant/BizEnums";

const countryCodes = {
    my: "60",
    cn: "86",
};

function UserScreen() {
    const navigation = useNavigation();

    const [otp, setOtp] = useState("");
    const [selectedValue, setSelectedValue] = useState("my");
    const [showModal, setShowModal] = useState(false);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

    const handleSelect = (value) => {
        setSelectedValue(value);
        setIsPhoneNumberValid(true);
    };

    const buttonText = () => {
        switch (selectedValue) {
            case 'my':
                return '+60';
            case 'cn':
                return '+86';
            default:
                return 'Select Country Code';
        }
    };

    const submitData = () => {
        if (!value) {
            alert("Please enter a phone number");
            return;
        }

        if (!selectedValue) {
            alert("Please choose a country code");
            return;
        }

        if (!isPhoneNumberValid) {
            alert("Please enter a valid phone number");
            return;
        }

        const prefix = countryCodes[selectedValue];
        const phoneNumber = prefix ? prefix + value : value;
        smsSend(phoneNumber,UserTypeEnum.PASSER)
            .then(data => {
                if (data.code === 200) {
                    setIsTimerActive(true);
                    console.log(data.code)
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.log(error);
                alert('There was an error submitting your data. Please try again.');
            });
    };

    const [value, setValue] = useState("");
    const [secondsRemaining, setSecondsRemaining] = useState(30);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isResendOtpActive, setIsResendOtpActive] = useState(false);

    const setValueAndCheckLength = (text) => {
        setValue(text);

        if (selectedValue === "cn") {
            if (text.length !== 11) {
                setIsPhoneNumberValid(false);
                return;
            }
        }

        if (selectedValue === "my") {
            if (text.length < 9 || text.length > 10) {
                setIsPhoneNumberValid(false);
                return;
            }
        }

        setIsPhoneNumberValid(true);
    };

    useEffect(() => {
        let intervalId;
        if (isTimerActive && secondsRemaining > 0) {
            intervalId = setInterval(() => {
                setSecondsRemaining((prev) => prev - 1);
            }, 1000);
        } else if (secondsRemaining === 0) {
            setIsResendOtpActive(true);
            setIsTimerActive(false);
        }
        return () => clearInterval(intervalId);
    }, [isTimerActive, secondsRemaining]);

    const handleResendOtp = () => {
        setSecondsRemaining(30);
        setIsResendOtpActive(false);
        submitData();
    };

    const handleOtpInputChange = (text) => {
        setOtp(text);
        if (text.length === 4) {
            const userPhone = countryCodes[selectedValue] + value;
            userLoginWithSmsCode(userPhone, text);
        }
    };

    const userLoginWithSmsCode = (userPhone, code) => {
        const loginParams = {
            "userPhone": userPhone,
            "code": MD5(code).toString(), // 对验证码进行 MD5 加密
            "deviceId": getUserID(),
            "platform": 0
        }
        userLogin(loginParams)
            .then(data => {
                if (data.code === 200) {
                    setUserToken(data.data)
                    buildUserInfo(data.data, userType.USER, userPhone).saveWithLocal();
                    navigation.navigate("User");
                } else {
                    alert("Login failed:"+data.message);
                }
            })
            .catch(error => {
                console.log(error);
                alert("Login failed");
            });
    };

    const renderButton = () => {
        if (isTimerActive) {
            return (
                <Button
                    variant="outline"
                    colorScheme="secondary"
                    size="sm"
                    mt="2"
                    isDisabled={true}
                >
                    <Text>{secondsRemaining} s</Text>
                </Button>
            );
        } else if (isResendOtpActive) {
            return (
                <Button
                    variant="outline"
                    colorScheme="secondary"
                    size="sm"
                    mt="2"
                    onPress={handleResendOtp}
                >
                    Resend
                </Button>
            );
        } else {
            return (
                <Button
                    mt="4"
                    onPress={submitData}
                >
                    Get OTP
                </Button>
            );
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <VStack space="2.5" mt="4" px="8">
                <FormControl isRequired>
                    <FormControl.Label>Please enter your phone number</FormControl.Label>
                    <HStack space={2}>
                        <Button onPress={() => setShowModal(true)}>
                            {buttonText()}
                        </Button>

                        <Input
                            placeholder="Phone Number"
                            value={value}
                            onChangeText={setValueAndCheckLength}
                            keyboardType="numeric"
                            size="lg"
                            width="78%"
                        />
                    </HStack>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton />
                            <Modal.Header>Select Country Code</Modal.Header>
                            <Modal.Body>
                                <Radio.Group defaultValue={selectedValue} name="countryCode" size="sm" onChange={handleSelect}>
                                    <VStack space={3}>
                                        <Radio alignItems="flex-start" _text={{ mt: "-1", ml: "2", fontSize: "sm" }} value="my">
                                            +60 Malaysia
                                        </Radio>
                                        <Radio alignItems="flex-start" _text={{ mt: "-1", ml: "2", fontSize: "sm" }} value="cn">
                                            +86 China
                                        </Radio>
                                    </VStack>
                                </Radio.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button flex="1" onPress={() => { setShowModal(false); }}>
                                    Continue
                                </Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                </FormControl>
                {!isPhoneNumberValid && (
                    <Text color="red.500" mt="1" fontSize="sm">
                        {selectedValue === "cn" ? "Enter 11-digit phone number for China" : "Enter 9 or 11 digit phone number for Malaysia"}
                    </Text>
                )}
                <Input
                    size='lg'
                    placeholder="Enter OTP"
                    mt="4"
                    onChangeText={handleOtpInputChange}
                />
                {renderButton()}
                <Text mt="4" textAlign="center">
                    Don't have an account?{" "}
                    <Text
                        onPress={() => navigation.navigate("UserSignUp")}
                        color="blue.500"
                        _underline={{}}
                    >
                        Sign Up here.
                    </Text>
                </Text>
            </VStack>
        </TouchableWithoutFeedback>
    );
}

export default function User() {
    return (
        <NativeBaseProvider>
            <Center flex={1}>
                <UserScreen />
            </Center>
        </NativeBaseProvider>
    );
}
