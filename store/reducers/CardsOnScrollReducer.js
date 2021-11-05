import { Card } from 'react-native-elements';
import CardDetails from '../../src/CardDetails';
import { FETCH_CARDS, SET_CARDS } from '../actions/CardActions';
import { getAllLambs } from '../../databases/DataStore';


const initialState = {
    cardsOnScroll: [],
    lastIndex: -1,
    allCardsRead: false
};

const CardsOnScrollReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_CARDS:

            const newState = { ...state, cardsOnScroll: [...action.payload.cardsToSet] };
            return newState;

        default:
            return state;
    }
}

export default CardsOnScrollReducer;