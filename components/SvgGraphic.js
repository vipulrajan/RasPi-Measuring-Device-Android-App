import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/colors';
import Svg, { G, Path, Rect, Circle } from 'react-native-svg';


const SvgGraphic = props =>{

    return (
        <Svg>{ console.log(props.children)}</Svg>
    );
}

export default SvgGraphic;