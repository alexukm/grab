import React from 'react';
import { Box, ScrollView } from 'native-base';
import RideStatusScreen from './RideStatusScreen';

const OrderListScreen = () => {
    // 模拟订单数据
    const orders = [
        { id: 1, departure: 'New York', destination: 'Los Angeles', time: '2:00 PM' },
        { id: 2, departure: 'San Francisco', destination: 'Seattle', time: '3:30 PM' },
        { id: 3, departure: 'Chicago', destination: 'Miami', time: '5:15 PM' },
        // 添加更多订单...
    ];

    return (
        <ScrollView>
            <Box p={4}>
                {orders.map(order => (
                    <RideStatusScreen
                        key={order.id}
                        departure={order.departure}
                        destination={order.destination}
                        time={order.time}
                    />
                ))}
            </Box>
        </ScrollView>
    );
};

export default OrderListScreen;
