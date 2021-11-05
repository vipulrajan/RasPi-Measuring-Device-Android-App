import Values from './Values'

const initialState = () => {
    const filterPropertiesOtherThanStatus = Values.filterProperties.filter(x => x !== "status")

    const tempState = { "status": [Values.status.ACTIVE] };

    return filterPropertiesOtherThanStatus.reduce((acc, property) => {
        const allPossibleValues = Object.values(Values[property]).map(x => `"${x}"`);

        return { ...acc, ...JSON.parse(`{ "${property}":[${allPossibleValues}] }`) };

    }, tempState);
}

export default initialState;