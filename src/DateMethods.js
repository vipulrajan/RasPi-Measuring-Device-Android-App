import 'intl';
import 'intl/locale-data/jsonp/en';
import Values from '../constants/Values';

export const getFormattedDate = (date) => {
    const parsedDate = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }).format(date);
    return parsedDate;
}

export const getFormattedDateShort = (date) => {
    const parsedDate = new Intl.DateTimeFormat('en', { year: '2-digit', month: 'short', day: 'numeric' }).format(date);
    return parsedDate;
}

export const getAgeString = (date, now = new Date()) => {
    const oneDay = 1000 * 60 * 60 * 24;


    //const now = new Date();

    if (date > now)
        return "unborn";

    const startNowYear = new Date(now.getFullYear(), 0, 0);
    const startNowMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const diffNowYear = now - startNowYear;
    const diffNowMonth = now - startNowMonth;

    const dayOfYearNow = Math.floor(diffNowYear / oneDay);
    const dayOfMonthNow = Math.floor(diffNowMonth / oneDay);

    const startDateYear = new Date(date.getFullYear(), 0, 0);
    const startDateMonth = new Date(date.getFullYear(), date.getMonth(), 0);

    const diffDateYear = date - startDateYear;
    const diffDateMonth = date - startDateMonth;

    const dayOfYearDate = Math.floor(diffDateYear / oneDay);
    const dayOfMonthDate = Math.floor(diffDateMonth / oneDay);

    let yearDifference = now.getFullYear() - date.getFullYear();

    if (dayOfYearNow < dayOfYearDate)
        yearDifference = yearDifference - 1;


    let monthDifference = now.getMonth() - date.getMonth();


    if (dayOfMonthNow < dayOfMonthDate)
        monthDifference = monthDifference - 1;


    if (monthDifference < 0)
        monthDifference = 12 + monthDifference;


    let dayDifference = dayOfMonthNow - dayOfMonthDate;


    if (dayDifference < 0) {
        dayDifference = Math.floor((now - new Date(now.getFullYear(), now.getMonth() - 1, date.getDate())) / oneDay);
    }

    const weekDifference = Math.floor(dayDifference / 7);
    dayDifference = dayDifference % 7;
    return (yearDifference + "y " + monthDifference + "m " + weekDifference + "w " + dayDifference + "d")

}

export const getCategory = (date, now = new Date()) => {
    const oneDay = 1000 * 60 * 60 * 24;


    if (date > now)
        return "unborn";

    const numberOfDays = Math.floor((now - date) / oneDay)

    if (numberOfDays <= 21)
        return Values.category.lamb21
    else if (numberOfDays <= 45)
        return Values.category.lamb45
    else if (numberOfDays <= 90)
        return Values.category.lamb90
    else if (numberOfDays <= (9 * 30))
        return Values.category.weaner
    else if (numberOfDays <= (18 * 30))
        return Values.category.hogget
    else
        return Values.category.adult
}