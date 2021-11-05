import Values from '../constants/Values'
import { getCategory } from '../src/DateMethods'

const getSeparator = (count) => {
    return { text: 'sep', count: count }
}
const groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};



export const countsFieldWise = (allLambs, field) => {

    const groupedRecords = groupBy(allLambs, field);

    return Object.keys(groupedRecords).map(key => {
        return { text: key, count: groupedRecords[key].length }
    }).filter(x => x.count !== 0)

};

export const birthStatistics = (allLambs, beginningDate, endingDate) => {
    const allBirths = allLambs.filter(lamb => {
        return lamb.dateOfLambing >= beginningDate && lamb.dateOfLambing <= endingDate
    })

    const sexWiseCounts = countsFieldWise(allBirths, 'sex')

    return {
        heading: { text: 'Total Births', count: allBirths.length },
        subs: sexWiseCounts
    }
};


export const disposalStatistics = (allLambs, beginningDate, endingDate) => {
    const allDisposals = allLambs.filter(lamb => {
        return lamb.dateOfDisposal >= beginningDate && lamb.dateOfDisposal <= endingDate
    }).map(x => {
        return {
            ...x,
            category: getCategory(new Date(x.dateOfLambing), new Date(x.dateOfDisposal))
        }
    })

    const sexWiseCounts = countsFieldWise(allDisposals, 'sex')
    const categoryWiseCounts = countsFieldWise(allDisposals, 'category')
    const statusWiseCounts = countsFieldWise(allDisposals, 'status')
    return {
        heading: { text: 'Total Disposals', count: allDisposals.length },
        subs: [...statusWiseCounts, getSeparator(1), ...categoryWiseCounts, getSeparator(2), ...sexWiseCounts]
    }
};

export const deathStatistics = (allLambs, beginningDate, endingDate) => {
    const allDisposals = allLambs.filter(lamb => {
        return lamb.dateOfDisposal >= beginningDate && lamb.dateOfDisposal <= endingDate
    }).filter(x => x.status === Values.status.DIED).map(x => {
        return {
            ...x,
            category: getCategory(new Date(x.dateOfLambing), new Date(x.dateOfDisposal))
        }
    })

    const sexWiseCounts = countsFieldWise(allDisposals, 'sex')
    const categoryWiseCounts = countsFieldWise(allDisposals, 'category')
    return {
        heading: { text: 'Total Deaths', count: allDisposals.length },
        subs: [...categoryWiseCounts, getSeparator(2), ...sexWiseCounts]
    }
};

export const transitionStatistics = (allLambs, beginningDate, endingDate) => {
    const allTransitions = allLambs.filter(lamb => lamb.dateOfLambing <= endingDate).map(lamb => {

        const beginningDateMinus1 = new Date(beginningDate.getFullYear(), beginningDate.getMonth(), beginningDate.getDate() - 1);

        const cat1 = (() => {
            if (lamb.dateOfLambing <= beginningDateMinus1)
                return getCategory(new Date(lamb.dateOfLambing), new Date(beginningDateMinus1));
            else
                return Values.category.lamb21;
        })()



        const cat2 = (() => {
            if ((lamb.status !== Values.status.ACTIVE) && !(lamb.dateOfDisposal > endingDate))
                return getCategory(new Date(lamb.dateOfLambing), new Date(lamb.dateOfDisposal));

            else
                return getCategory(new Date(lamb.dateOfLambing), new Date(endingDate));
        })()

        return {
            ...lamb,
            category1: cat1,
            category2: cat2
        };
    }).filter(lamb => lamb.category1 !== lamb.category2).map(lamb => {
        const transition = lamb.category1 + " -> " + lamb.category2;
        return {
            ...lamb,
            transition: transition
        }
    })

    const transitionWiseCounts = countsFieldWise(allTransitions, 'transition')
    return {
        heading: { text: 'Total Transitions', count: allTransitions.length },
        subs: transitionWiseCounts
    }
};


export const totalActiveStatistics = (allLambs, endingDate) => {
    const allActiveLambs = allLambs.filter(lamb => {
        return (lamb.status === Values.status.ACTIVE || lamb.dateOfDisposal > endingDate)
    });

    const sexWiseCounts = countsFieldWise(allActiveLambs, 'sex')
    const categoryWiseCounts = countsFieldWise(allActiveLambs, 'category')

    return {
        heading: { text: 'All Active Records', count: allActiveLambs.length },
        subs: [...categoryWiseCounts, getSeparator(2), ...sexWiseCounts]
    }
}