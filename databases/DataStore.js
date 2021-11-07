import AsyncStorage from '@react-native-async-storage/async-storage';



export const insertNewCard = async (key, value) => {
    const jsonValue = JSON.stringify(value)
    try {
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const cardExists = async (key) => {
    const result = await getCard(key);
    if (result !== null)
        return true;
    else
        return false;
}
export const updateCard = async (key, value) => {

    try {
        const fetchedValue = await getCard(key);
        await insertNewCard(key, { ...fetchedValue, ...value });
    } catch (e) {
        console.log(e);
        throw e;
    }

}
export const getCard = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value != null ? JSON.parse(value) : null;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const deleteCard = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch (exception) {
        return false;
    }
}

export const getAllCards = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        return result.map(value => value != null ? JSON.parse(value[1]) : null);
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const testFunc = () => {
    getAllCards().then(value => console.log(value));
}
