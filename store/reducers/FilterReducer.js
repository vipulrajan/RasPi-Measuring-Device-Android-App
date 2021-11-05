
import { UPDATE_FILTER, SET_FILTER } from '../actions/FilterActions';
import initialFilterState from '../../constants/InitialFilterState'


const initialState = initialFilterState();

const CardsOnScrollReducer = (state = initialState, action) => {
    switch (action.type) {

        case UPDATE_FILTER:

            const newCatArray = (() => {
                if (state[action.payload.header].includes(action.payload.category))
                    return state[action.payload.header].filter(x => x !== action.payload.category)
                else
                    return [...state[action.payload.header], action.payload.category]
            })()

            const updatedHeader = JSON.parse(`{ "${action.payload.header}":[${newCatArray.map(x => `"${x}"`)}] }`)

            const newState = { ...state, ...updatedHeader };
            return newState;

        case SET_FILTER:

            return action.payload.filters;

        default:
            return state;
    }
}

export default CardsOnScrollReducer;