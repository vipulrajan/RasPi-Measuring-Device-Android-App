export const FETCH_CARDS = 'FETCH_CARDS';
export const SET_CARDS = 'SET_CARDS';

export const fetchCards = (number) => {
    return {
        type: FETCH_CARDS,
        payload: { numberOfCards: number }
    };
};


export const setCards = (cards) => {
    return {
        type: SET_CARDS,
        payload: { cardsToSet: cards }
    };
};