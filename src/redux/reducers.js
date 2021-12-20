const immutable = require("immutable");
const {INIT, SET, BUY, SELL, NOTSELL, START, END, CHANGE} = require('./actions');

const reducer = function (state = immutable.Map(), action) {
    switch (action.type) {
        case SET:
            return state.merge(action.state);
        case INIT:
            return state.update('users', (users) => {
                return action.initState.users;
            }).update('stocks', (stocks) => {
                return action.initState.stocks;
            }).update('settings', (settings)=> {
                return action.initState.settings;
            });
        case START:
            return state.update('settings', (settings) => {
                settings.state = 'in';
                return settings;
            })
        case CHANGE:
            return state.update('stocks', (stocks) => {
                stocks = action.stocks;
                return stocks;
            })
        case END:
            return state.update('settings', (settings) => {
                settings.state = 'after';
                return settings;
            })
        case BUY:
            return state.update('users', (users) => {
                users[action.transaction.buyer_id].stocks[action.transaction.stock_id].count += action.transaction.count;
                users[action.transaction.buyer_id].balance -= action.transaction.price * action.transaction.count;
                users[action.transaction.buyer_id].waste += action.transaction.price * action.transaction.count;
                if (action.transaction.seller_id >= 0) {
                    users[action.transaction.seller_id].selling_stocks[action.transaction.stock_id].count -= action.transaction.count;
                    users[action.transaction.seller_id].balance += action.transaction.price * action.transaction.count;
                    users[action.transaction.seller_id].earn += action.transaction.price * action.transaction.count;
                }
                return users;
            }).update('stocks', (stocks) => {
                if (action.transaction.seller_id < 0) {
                    stocks[action.transaction.stock_id].count -= action.transaction.count;
                }
                return stocks;
            })
        case SELL:
            return state.update('users', (users) => {
                users[action.sellInfo.seller_id].selling_stocks[action.sellInfo.stock_id].count += action.sellInfo.count;
                users[action.sellInfo.seller_id].stocks[action.sellInfo.stock_id].count -= action.sellInfo.count;
                return users;
            })
        case NOTSELL:
            return state.update('users', (users) => {
                users[action.notsellInfo.seller_id].selling_stocks[action.notsellInfo.stock_id].count -= action.notsellInfo.count;
                users[action.notsellInfo.seller_id].stocks[action.notsellInfo.stock_id].count += action.notsellInfo.count;
                return users;
            })
        default:
    }

    return state;
}

module.exports = reducer;