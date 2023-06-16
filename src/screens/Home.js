import React, { createContext, useContext, useEffect, useState } from "react";
import { VStack, Box, Center, Button, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import {getUserToken, getUserType} from "../com/evotech/common/appUser/UserConstant";
// 创建用户类型上下文
const UserTypeContext = createContext();

function Home() {
    const navigation = useNavigation();
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        // 检查本地存储是否有保存的用户类型
        retrieveUserType();
    }, []);

    const saveUserType = (type) => {
        setUserType(type);
        // 这里可以将用户类型保存到本地存储，以便后续获取
    };

    const retrieveUserType = () => {
        // 这里可以从本地存储中获取用户类型
        const savedUserType = getUserType(); // 调用getUserType接口
        if (savedUserType !== null) {
            setUserType(savedUserType);
        }
    };

    const handleUserButtonPress = () => {
        saveUserType(getUserType().USER); // 调用getUserType接口中的USER值
        navigation.navigate("User");
    };

    const handleDriverButtonPress = () => {
        saveUserType(getUserType().DRIVER); // 调用getUserType接口中的DRIVER值
        navigation.navigate("Driver");
    };

    return (
        <UserTypeContext.Provider value={userType}>
            <VStack flex={1} space={4} alignItems="center">
                <Box flex={0.6} w="full" bg="blue.500" mt="5%" roundedBottom="md" shadow={3}></Box>
                <VStack flex={0.2} w="full" space={1} alignItems="center">
                    <Text fontWeight="bold">Welcome to my App</Text>
                    <Text textAlign="center">
                        This is a very good app that you can share your ride with other person, and for drivers, they can earn a lot of money.
                    </Text>
                </VStack>
                <VStack flex={0.2} w="full" justifyContent="flex-end" pb="15%" alignItems="center">
                    <Box flexDirection="row" justifyContent="space-between" width="100%">
                        <Button size="lg" colorScheme="primary" flexGrow={1} marginRight={2} onPress={handleUserButtonPress}>
                            User
                        </Button>
                        <Button size="lg" colorScheme="secondary" flexGrow={1} marginLeft={2} onPress={handleDriverButtonPress}>
                            Driver
                        </Button>
                    </Box>
                </VStack>
            </VStack>
        </UserTypeContext.Provider>
    );
}

// 自定义钩子以在其他组件中获取用户类型
const useUserType = () => useContext(UserTypeContext);

export { useUserType };
export default Home;
