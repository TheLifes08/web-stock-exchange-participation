const {INIT, BUY, SELL, NOTSELL, START, END, CHANGE} = require('./actions');

const initState = function (initState) {
    return {
        type: INIT,
        initState
    }
}

const buyStock = function(transaction) {
    return {
        type: BUY,
        transaction
    }
}

const sellStock = function (sellInfo) {
    return {
        type: SELL,
        sellInfo
    }
}

const cancelSell = function (notsellInfo) {
    return {
        type: NOTSELL,
        notsellInfo
    }
}

const start = function () {
    return {
        type: START
    }
}

const end = function () {
    return {
        type: END
    }
}

const changePrice = function (stocks) {
    return{
        type: CHANGE,
        stocks
    }
}

module.exports = {initState, buyStock, sellStock, cancelSell, start, end, changePrice}