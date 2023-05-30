import AsyncStorage from '@react-native-async-storage/async-storage';

export function getValue(key) {
    return AsyncStorage.getItem(key);
}

export function setKeyValue(key, value) {
    return AsyncStorage.setItem(key, value);
}

export function asyncDelKey(key) {
    return AsyncStorage.removeItem(key);
}