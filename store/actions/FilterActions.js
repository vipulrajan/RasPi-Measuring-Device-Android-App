export const UPDATE_FILTER = 'UPDATE_FILTER';
export const SET_FILTER = 'SET_FILTER';

export const updateFilter = (header, category) => {
    return {
        type: UPDATE_FILTER,
        payload: { header: header, category: category }
    };
};


export const setFilters = (filters) => {
    return {
        type: SET_FILTER,
        payload: { filters: filters }
    };
};

