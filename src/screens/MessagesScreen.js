// // import React from 'react';
// // import { View, Text, StyleSheet } from 'react-native';
// //
// // const MessagesScreen = () => {
// //     return (
// //         <View style={styles.container}>
// //             <Text style={styles.text}>这是消息</Text>
// //         </View>
// //     );
// // };
// //
// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     text: {
// //         fontSize: 20,
// //         fontWeight: 'bold',
// //     },
// // });
// //
// // export default MessagesScreen;
// //
// //
// import React from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import { Box, VStack, HStack } from 'native-base';
//
// const DriverOrderListScreen = () => {
//     const acceptOrder = (orderId) => {
//         // TODO: Implement acceptOrder functionality
//         console.log('Accept Order:', orderId);
//     };
//
//     const data = [
//         {
//             time: '10/06 at 12:56',
//             start: 'KIZ UKM SELANGOR',
//             destination: 'KLIA SEPANG MALAYSIA',
//             price: 'MYR 500',
//             note: 'This is a short note.',
//             id: '1',
//         },
//         {
//             time: '10/06 at 12:56',
//             start: 'KIZ UKM SELANGOR',
//             destination: 'KLIA SEPANG MALAYSIA',
//             price: 'MYR 500',
//             note: 'This is a long note that will be wrapped inside the ScrollView component.',
//             id: '2',
//         },
//         {
//             time: '10/06 at 12:56',
//             start: 'KIZ UKM SELANGOR',
//             destination: 'KLIA SEPANG MALAYSIA',
//             price: 'MYR 500',
//             note: 'Null',
//             id: '3',
//         },
//         {
//             time: '10/06 at 12:56',
//             start: 'KIZ UKM SELANGOR',
//             destination: 'KLIA SEPANG MALAYSIA',
//             price: 'MYR 500',
//             note: '看见撒谎的雷克萨到了卡了大家埃里克森的距离喀什索拉卡离开洒家立刻撒旦老咔叽卡拉杀了开始就打卢克',
//             id: '4',
//         },
//         // 添加更多的示例订单数据...
//         {
//             time: '10/06 at 12:56',
//             start: 'KIZ UKM SELANGOR',
//             destination: 'KLIA SEPANG MALAYSIA',
//             price: 'MYR 500',
//             note: 'This is a note.',
//             id: '5',
//         },
//         {
//             time: '10/06 at 12:56',
//             start: 'KIZ UKM SELANGOR',
//             destination: 'KLIA SEPANG MALAYSIA',
//             price: 'MYR 500',
//             note: 'This is another note.',
//             id: '6',
//         },
//         // 添加更多的示例订单数据...
//     ];
//     const renderItem = ({ item }) => (
//         <Box bg="white" shadow={2} rounded="lg" p={4} my={2}>
//             <Text style={styles.timeText}>{item.time}</Text>
//             <Text>Departure: {item.start}</Text>
//             <Text>Destination: {item.destination}</Text>
//             <Text>Price: {item.price}</Text>
//             <Text>Comment: {item.note}</Text>
//             <HStack justifyContent="flex-end">
//                 <TouchableOpacity onPress={() => acceptOrder(item.id)} style={styles.buttonContainer}>
//                     <Text style={styles.buttonText}>Accept</Text>
//                 </TouchableOpacity>
//             </HStack>
//         </Box>
//     );
//
//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={data}
//                 renderItem={renderItem}
//                 keyExtractor={(item) => item.id}
//                 ItemSeparatorComponent={() => null}
//             />
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingBottom: 60, // 调整底部导航栏高度
//     },
//     timeText: {
//         fontSize: 10,
//         marginBottom: 5,
//     },
//     buttonContainer: {
//         backgroundColor: 'green',
//         padding: 10,
//         borderRadius: 5,
//     },
//     buttonText: {
//         color: 'white',
//         fontWeight: 'bold',
//     },
// });
//
// export default DriverOrderListScreen;
