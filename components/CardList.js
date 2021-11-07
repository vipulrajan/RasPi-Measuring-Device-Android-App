import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import CardDetails from '../src/CardDetails';
import Card from './Card';

import { useSelector } from 'react-redux';

const CardList = props => {

    const cards = props.cards

    return (
        cards.map(card => {
            return (
                <Card key={card.id} cardDetails={card} navigationProps={props.navigationProps} />
            );
        }
        )
    );
}



export default CardList;