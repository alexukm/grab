import React, {useState} from 'react';
import {View, TextInput, Button, Modal, Text, Dimensions} from 'react-native';
import DatePicker from 'react-native-datepicker';
import MapView from 'react-native-maps';

const RideBookingScreen = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [mode, setMode] = useState('');
    const [date, setDate] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
    };

    const handleSubmit = () => {
        // 这里可以处理提交操作，例如向服务器发送数据
    };

    return (
        <View style={{flex: 1}}>
            <MapView style={{flex: 0.5}}/>
            <View style={{flex: 0.5, alignItems: 'center'}}>
                <TextInput
                    style={{width: '80%', height: 40, borderColor: 'gray', borderWidth: 1, margin: '10%', fontSize: 20}}
                    placeholder="出发地"
                    onFocus={() => setShowModal(true)}
                    value={origin}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <TextInput
                            placeholder="搜索出发地"
                            // 使用Google Maps API搜索地址
                            // 设置选定的地址到状态
                        />
                        <Button title="选择" onPress={() => setShowModal(false)}/>
                    </View>
                </Modal>


                {/* 重复上述步骤以处理目的地输入框 */}

                <Button title="Sharing" onPress={() => handleModeChange('sharing')}/>
                <Button title="Single" onPress={() => handleModeChange('single')}/>

                <DatePicker
                    style={{width: Dimensions.get('window').width * 0.8, margin: Dimensions.get('window').width * 0.1}}
                    date={date}
                    mode="datetime"
                    placeholder="选择日期和时间"
                    format="YYYY-MM-DD HH:mm"
                    confirmBtnText="确认"
                    cancelBtnText="取消"
                    onDateChange={(date) => {
                        setDate(date)
                    }}
                />
                {mode && (
                    <Text>为您推荐的价格为10马币</Text>
                )}

                <Button title="确认" onPress={handleSubmit}/>
            </View>
        </View>
    );
}

export default RideBookingScreen;
