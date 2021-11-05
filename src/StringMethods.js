export const getFirstLetterCapitalized = (str) => {
    if (str !== undefined && str !== null)
        return str.charAt(0).toUpperCase() + str.slice(1);
    else
        return null
}