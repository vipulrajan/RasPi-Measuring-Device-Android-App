import React, { useState, useEffect, useCallback } from 'react';
import { View, StatusBar, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import SearchBar from '../components/SearchBar'
import CardList from '../components/CardList';
import AddButton from '../components/AddButton';

import { useDispatch, useSelector } from 'react-redux';
import { fetchCards, setCards } from '../store/actions/CardActions'
import { set } from 'react-native-reanimated';
import { Ionicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import SeparatorBar from '../components/SeparatorBar';
import { getAllLambs } from '../databases/DataStore';
import Values from '../constants/Values';
import { getCategory } from '../src/DateMethods'
//const dispatch = useDispatch();

const MainScreen = props => {
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [searchHasText, setSearchHasText] = useState(false);

  const filters = useSelector(state => state.filterState);

  const fetchedCards = useSelector(state => {

    const filteredCards = (() => {
      if (!searchHasText) {
        return state.cardsScroll.cardsOnScroll.map(x => {
          return { ...x, category: getCategory(new Date(x.dateOfLambing)) }
        }).filter(x => {
          const allFilterKeys = Object.keys(filters);
          const retBool = allFilterKeys.reduce((acc, key) => acc && filters[key].reduce((yAcc, yKey) => yAcc || yKey === x[key], false), true);
          return retBool
        });
      }
      else {
        return state.cardsScroll.cardsOnScroll.filter(x => x.id.startsWith(searchText));
      }
    })();

    return filteredCards;
  });



  const fetchAllCards = () => {
    getAllLambs().then(cards => {
      dispatch(setCards(cards));
    }
    )
  };

  useEffect(fetchAllCards, []);

  const callBackFunction = () => {
    getAllLambs().then(cards => {
      dispatch(setCards(cards));
    }
    )
  }


  const screenWidth = Dimensions.get('window').width;
  const searchBarWidth = 0.7 * screenWidth;
  const [percentageSearchBoxWidth] = useState(new Animated.Value(searchBarWidth));



  const onPressFunc = () => Animated.timing(percentageSearchBoxWidth, { useNativeDriver: false, toValue: 0.95 * screenWidth, timing: 10000 }).start();
  const onEndEditingFunc = () => Animated.timing(percentageSearchBoxWidth, { useNativeDriver: false, toValue: searchBarWidth, timing: 10000 }).start();


  return (
    <View style={styles.container} >
      <SearchBar
        setSearchText={setSearchText}
        setSearchHasText={setSearchHasText}
        navigationProps={props.navigation}
        placeholderText='Search a Number'
        containerStyle={{ width: percentageSearchBoxWidth, marginBottom: 20 }}
        onFocus={onPressFunc}
        onEndEditing={onEndEditingFunc}
        filters={filters}
      />
      <SeparatorBar />
      <Text style={styles.numberText}> {'Records: ' + fetchedCards.length}</Text>

      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingTop: 5 }} scrollEventThrottle='16'>
        <CardList cards={fetchedCards} navigationProps={props.navigation} callBackFunction={callBackFunction} />
        <Text style={{ color: Colors.textAndSymbols, height: 70 }} > End of List  </Text>
      </ScrollView>

      <AddButton navigationProps={props.navigation} callBackFunction={callBackFunction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 55
  },
  floatIcon: {
    position: 'absolute',
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOpacity: 0.6,
    shadowOffset: { height: 4 },
    bottom: 30,
    right: 50,
    zIndex: 3,
    elevation: 3,
    height: 60,
    width: 60,
    backgroundColor: Colors.accents,
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  numberText: {
    color: Colors.placeholderText,
    fontSize: 18,
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginLeft: 25
  }
});
export default MainScreen;