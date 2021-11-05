import AsyncStorage from '@react-native-async-storage/async-storage';


/*export const lambSchema =
{
    name: LAMB_SCHEMA,
    primaryKey: 'id',
    properties:
    {
        id: 'string'
        dameId: 'string',
        sireId: 'string',
        dateOfMating: 'date',
        dateOfLambing: 'date',
        sex: 'string',
        birthWeight: 'int',
        remarks: 'string'
    }
};

const databaseOptions = {
    path: 'lambingApp.realm',
    schema: [lambSchema]
};*/

export const insertNewLamb = async (key, value) => {
    const jsonValue = JSON.stringify(value)
    try {
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const lambExists = async (key) => {
    const result = await getLamb(key);
    if (result !== null)
        return true;
    else
        return false;
}
export const updateLamb = async (key, value) => {

    try {
        const fetchedValue = await getLamb(key);
        await insertNewLamb(key, { ...fetchedValue, ...value });
    } catch (e) {
        console.log(e);
        throw e;
    }

}
export const getLamb = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value != null ? JSON.parse(value) : null;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const deleteLamb = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch (exception) {
        return false;
    }
}

export const getAllLambs = async () => {
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
    getAllLambs().then(value => console.log(value));
}


/*export const updateLamb = lamb => new Promise((resolve, reject) => {

    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let updatingLamb = realm.objectForPrimaryKey(lambSchema, lamb.id);
            updatingLamb = { ...updatingLamb, ...lamb };
            resolve();
        });
    }).catch((error) => reject(error));
});

export const deleteLamb = lambId => new Promise((resolve, reject) => {

    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let deletingLamb = realm.objectForPrimaryKey(lambSchema, lambId);
            realm.delete(deletingLamb);
            resolve();
        });
    }).catch((error) => reject(error));
});*/