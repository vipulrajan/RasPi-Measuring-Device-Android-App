import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import TextEntryBox from '../components/TextEntryBox';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { insertNewLamb, getAllLambs, deleteLamb, getLamb, updateLamb } from '../databases/DataStore';
import CardDetails from '../src/CardDetails';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards, setCards } from '../store/actions/CardActions'
import Picker from 'react-native-picker-select';
import { showMessage, hideMessage } from "react-native-flash-message";
import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { getCategory } from '../src/DateMethods'

import 'intl';
import 'intl/locale-data/jsonp/en';

import { getFormattedDateShort } from '../src/DateMethods'
import Values from '../constants/Values';
import SeparatorBar from '../components/SeparatorBar';

import ExpandableCard from '../components/ExpandableCard'
import { birthStatistics, disposalStatistics, deathStatistics, transitionStatistics, totalActiveStatistics } from '../src/StatisticalFunctions'

const StatsScreen = props => {



    const [isBeginningDatePickerVisible, setBeginningDatePickerVisibility] = useState(false);
    const [beginningDate, setBeginningDate] = useState(new Date());


    const allLambs = useSelector(state => state.cardsScroll.cardsOnScroll.map(x => {

        const disposalDate = (() => {
            if (x.dateOfDisposal !== undefined)
                return new Date(x.dateOfDisposal);
            else
                return undefined;
        })()
        return {
            ...x,
            category: getCategory(new Date(x.dateOfLambing)),
            dateOfLambing: new Date(x.dateOfLambing),
            dateOfMating: new Date(x.dateOfMating),
            dateOfDisposal: disposalDate
        }
    }))

    const showBeginningDatePicker = () => {
        setBeginningDatePickerVisibility(true);
    };

    const hideBeginningDatePicker = () => {
        setBeginningDatePickerVisibility(false);
    };

    const handleBeginningConfirm = (date) => {
        hideBeginningDatePicker();
        setBeginningDate(date);
    };


    const [isEndingDatePickerVisible, setEndingDatePickerVisibility] = useState(false);
    const [endingDate, setEndingDate] = useState(new Date());

    const showEndingDatePicker = () => {
        setEndingDatePickerVisibility(true);
    };

    const hideEndingDatePicker = () => {
        setEndingDatePickerVisibility(false);
    };

    const handleEndingConfirm = (date) => {
        setEndingDate(date);
        hideEndingDatePicker();
    };


    const spanStats = [
        birthStatistics(allLambs, beginningDate, endingDate),
        disposalStatistics(allLambs, beginningDate, endingDate),
        deathStatistics(allLambs, beginningDate, endingDate),
        transitionStatistics(allLambs, beginningDate, endingDate)
    ];

    const dateStats = [totalActiveStatistics(allLambs, endingDate)];


    const [bigFontHeight, setBigFontHeight] = useState(0);
    const [smallFontHeight, setSmallFontHeight] = useState(0);
    const [separatorHeight, setSeparatorHeight] = useState(0);



    return (
        <View style={styles.container} >
            <View style={styles.header} >
                <TouchableOpacity onPress={() => props.navigation.toggleDrawer()} style={{ position: 'absolute', left: 10 }}>
                    <FontAwesome name="bars" color='black' size={30} />
                </TouchableOpacity>
                <Text style={styles.numberText}>Statistics</Text>
            </View>

            <SeparatorBar />

            <View style={{ flexDirection: 'row', width: '95%', alignItems: 'center', justifyContent: 'center', paddingLeft: 2 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.headingText}>Staring Date:</Text>
                    <Button onPress={showBeginningDatePicker} title={getFormattedDateShort(beginningDate)} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} />
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.headingText}>Ending Date:</Text>
                    <Button onPress={showEndingDatePicker} title={getFormattedDateShort(endingDate)} titleStyle={styles.buttonTitle} buttonStyle={styles.buttonStyle} containerStyle={styles.buttonContainer} />
                </View>
            </View>
            <DateTimePickerModal
                isVisible={isBeginningDatePickerVisible}
                mode="date"
                date={beginningDate}
                onConfirm={handleBeginningConfirm}
                onCancel={hideBeginningDatePicker}
            />
            <DateTimePickerModal
                isVisible={isEndingDatePickerVisible}
                mode="date"
                date={endingDate}
                minimumDate={beginningDate} d
                onConfirm={handleEndingConfirm}
                onCancel={hideEndingDatePicker}
            />
            <View onLayout={(event) => setBigFontHeight(event.nativeEvent.layout.height)} style={{ zIndex: 100, position: 'absolute', opacity: 0 }}><Text style={{ fontSize: 21, color: 'white' }}>A</Text></View>
            <View onLayout={(event) => setSmallFontHeight(event.nativeEvent.layout.height)} style={{ zIndex: 100, position: 'absolute', opacity: 0 }}><Text style={{ fontSize: 18, color: 'white' }}>A</Text></View>
            <View onLayout={(event) => setSeparatorHeight(event.nativeEvent.layout.height)} style={{ zIndex: 100, position: 'absolute', width: '100%', opacity: 0 }}><SeparatorBar /></View>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>


                <Text style={{ ...styles.headingText, color: 'white' }}>{getFormattedDateShort(beginningDate) + ' - ' + getFormattedDateShort(endingDate)}</Text>
                {spanStats.map(value => {
                    const minHeight = bigFontHeight + separatorHeight + separatorHeight / 2;
                    const maxHeight = (() => {
                        if (value.heading.count !== 0)
                            return value.subs.filter(x => x.text !== 'sep').length * smallFontHeight + value.subs.filter(x => x.text == 'sep').length * smallFontHeight + minHeight + separatorHeight / 2;
                        else
                            return minHeight;
                    })()


                    return <ExpandableCard key={value.heading.text} header={value.heading} subHeadings={value.subs} minHeight={minHeight} maxHeight={maxHeight} ></ExpandableCard>;
                }
                )}
                <Text style={{ ...styles.headingText, color: 'white' }}>{'on ' + getFormattedDateShort(endingDate)}</Text>
                {dateStats.map(value => {
                    const minHeight = bigFontHeight + separatorHeight + separatorHeight / 2;
                    const maxHeight = (() => {
                        if (value.heading.count !== 0)
                            return value.subs.filter(x => x.text !== 'sep').length * smallFontHeight + value.subs.filter(x => x.text == 'sep').length * smallFontHeight + minHeight + separatorHeight / 2;
                        else
                            return minHeight;
                    })()


                    return <ExpandableCard key={value.heading.text} header={value.heading} subHeadings={value.subs} minHeight={minHeight} maxHeight={maxHeight} ></ExpandableCard>;
                }
                )}
            </ScrollView>

        </View >
    );
}

StatsScreen.navigationOptions = {
    headerTitle: 'Edit',
    headerStyle: { backgroundColor: Colors.secondary },
    headerTintColor: Colors.textAndSymbols
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        paddingTop: 35,
        backgroundColor: Colors.primary,

    },
    header: {
        backgroundColor: Colors.secondary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: '80%',
        height: 50,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20
    },
    numberText: {
        color: Colors.textAndSymbols,
        fontSize: 23
    },
    headingText: {
        color: Colors.placeholderText,
        fontSize: 17,
        marginBottom: 10
    },
    inputBox: {
        marginBottom: 25
    },
    buttonTitle: {
        color: Colors.textAndSymbols
    },
    buttonStyle: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 15
    },
    buttonContainer:
    {
        marginBottom: 15,
        width: '90%'
    }
});

const customPickerStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 23,
        padding: 10,
        paddingLeft: 20,
        borderRadius: 8,
        width: "80%",
        color: Colors.textAndSymbols,
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 25,
        backgroundColor: Colors.secondary,
    },
    inputAndroid: {
        fontSize: 23,
        padding: 10,
        paddingLeft: 20,
        borderRadius: 8,
        color: Colors.textAndSymbols,
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 25,
        backgroundColor: Colors.secondary,
    },
    placeholder: {
        color: Colors.placeholderText,
    }
});

export default StatsScreen;