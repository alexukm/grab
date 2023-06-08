import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Box, HStack, VStack, Text } from 'native-base';
import RemixIcon from 'react-native-remix-icon';

const OrderBox = ({ order }) => {
    const { Departure, Destination, Time, Price, Status } = order;
    const statusColors = { Pending: '#CCCC00', Completed: 'green', Cancel: 'red' };

    return (
        <Box bg="white" shadow={2} rounded="lg" p={4} my={2}>
            <Text style={{ color: statusColors[Status], alignSelf: 'flex-end' }}>{Status}</Text>
            <VStack space={4}>
                <HStack space={2} alignItems="center">
                    <RemixIcon name="map-pin-line" size={20} color="blue" />
                    <Text>Departure: {Departure}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RemixIcon name="map-pin-line" size={20} color="red" />
                    <Text>Destination: {Destination}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RemixIcon name="calendar-check-line" size={20} color="black" />
                    <Text>Time: {Time}</Text>
                </HStack>
                <HStack space={2} alignItems="center">
                    <RemixIcon name="wallet-3-line" size={20} color="black" />
                    <Text>Price: {Price}</Text>
                </HStack>
            </VStack>
        </Box>
    );
};
//server API
// const OrderListScreen = () => {
//     const [orders, setOrders] = useState([]);
//     const [page, setPage] = useState(1); // 用于跟踪当前页面
//
//     // 初始加载数据
//     useEffect(() => {
//         fetchInitialData();
//     }, []);
//
//     const fetchInitialData = async () => {
//         try {
//             let response = await fetch('http://your-api-url/orders?page=1');
//             let json = await response.json();
//             setOrders(json.orders);
//             setPage(2);
//         } catch (error) {
//             console.error(error);
//         }
//     };
//
//     const fetchMoreOrders = async () => {
//         try {
//             let response = await fetch(`http://your-api-url/orders?page=${page}`);
//             let json = await response.json();
//             setOrders([...orders, ...json.orders]);
//             setPage(page + 1);
//         } catch (error) {
//             console.error(error);
//         }
//     };
//
//     const renderItem = ({ item }) => {
//         return <OrderBox key={item.id} order={item} />;
//     };
//
//     return (
//         <FlatList
//             contentContainerStyle={styles.container}
//             data={orders}
//             renderItem={renderItem}
//             onEndReached={fetchMoreOrders}
//             onEndReachedThreshold={0.5}
//             ListHeaderComponent={
//                 <Box bg="white" shadow={2} rounded="lg" p={4} my={2} style={{ marginTop: 10 }}>
//                     <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Order List</Text>
//                     <Text>This page displays a list of all orders with their status.</Text>
//                 </Box>
//             }
//             ListFooterComponent={<Box height={20} />}
//             keyExtractor={item => item.id.toString()}
//         />
//     );
// };
//
// // ... styles stays the same
//
// export default OrderListScreen;
const OrderListScreen = () => {
    const initialOrders = [
        {
            id: '1',
            Departure: 'New York',
            Destination: 'San Francisco',
            Time: '2023-06-09 14:00',
            Price: '$500',
            Status: 'Pending',
        },
        {
            id: '2',
            Departure: 'Los Angeles',
            Destination: 'Chicago',
            Time: '2023-06-10 10:00',
            Price: '$400',
            Status: 'Completed',
        },
        {
            id: '3',
            Departure: 'Houston',
            Destination: 'Boston',
            Time: '2023-06-11 16:00',
            Price: '$350',
            Status: 'Cancel',
        }
        //... other initial orders
    ];
    const [orders, setOrders] = useState(initialOrders);

    const fetchMoreOrders = () => {
        const moreOrders = [
            {
                id: '6',
                Departure: 'Houston',
                Destination: 'Boston',
                Time: '2023-06-11 16:00',
                Price: '$350',
                Status: 'Cancel',
            },

            //... other more orders
        ];
        setOrders([...orders, ...moreOrders]);
    };

    const renderItem = ({ item }) => {
        return <OrderBox key={item.id} order={item} />;
    };

    return (
        <FlatList
            contentContainerStyle={styles.container}
            data={orders}
            renderItem={renderItem}
            onEndReached={fetchMoreOrders}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
                <Box bg="white" shadow={2} rounded="lg" p={4} my={2} style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Order List</Text>
                    <Text>This page displays a list of all orders with their status.</Text>
                </Box>
            }
            ListFooterComponent={<Box height={20} />}
            keyExtractor={item => item.id.toString()}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
    },
});

export default OrderListScreen;
