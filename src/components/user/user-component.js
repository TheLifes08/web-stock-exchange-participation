import React from "react";
import $ from "jquery";
import SellDialog from "./sell-dialog";
import CancelSellDialog from "./cancel-sell-dialog";
import BuyDialog from "./buy-dialog";
import {
    Container,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

class StockRow extends React.Component {
    constructor(props) {
        super(props);

        this.onSellClick = this.onSellClick.bind(this);
        this.onCountChange = this.onCountChange.bind(this);
        this.onNotsellClick = this.onNotsellClick.bind(this);
        this.onBuyClick = this.onBuyClick.bind(this);

        this.state = {
            count: 1
        }
    }

    onSellClick(value) {
        this.setState({ count: value });
        this.props.onSell(this.props.id, value);
    }

    onNotsellClick(value) {
        this.setState({ count: value });
        this.props.onNotsell(this.props.id, value);
    }

    onBuyClick(value) {
        this.setState({ count: value });
        this.props.onBuy(this.props.id, value, this.props.owner_id)
    }

    onCountChange(event) {
        this.setState({ count: parseInt(event.target.value) });
    }

    render() {
        switch (this.props.type) {
            case "own":
                return (
                    <TableRow>
                        <TableCell align="center">{this.props.name}</TableCell>
                        <TableCell align="center">{this.props.price}</TableCell>
                        <TableCell align="center">{this.props.count}</TableCell>
                        <TableCell align="center">{this.props.owner_name}</TableCell>
                        <TableCell align="center">
                            <SellDialog onSellClick={this.onSellClick} max={this.props.count}/>
                        </TableCell>
                    </TableRow>
                );
            case "sell":
                return (
                    <TableRow>
                        <TableCell align="center">{this.props.name}</TableCell>
                        <TableCell align="center">{this.props.price}</TableCell>
                        <TableCell align="center">{this.props.count}</TableCell>
                        <TableCell align="center">{this.props.owner_name}</TableCell>
                        <TableCell align="center">
                            <CancelSellDialog onNotsellClick={this.onNotsellClick} max={this.props.count}/>
                        </TableCell>
                    </TableRow>
                );
            case "buy":
                return (
                    <TableRow>
                        <TableCell align="center">{this.props.name}</TableCell>
                        <TableCell align="center">{this.props.price}</TableCell>
                        <TableCell align="center">{this.props.count}</TableCell>
                        <TableCell align="center">{(this.props.owner_name)? this.props.owner_name : this.props.name}</TableCell>
                        <TableCell align="center">
                            <BuyDialog onBuyClick={this.onBuyClick} max={this.props.count}/>
                        </TableCell>
                    </TableRow>
                );
            default:
                return (
                    ""
                );
        }
    }
}

class StocksTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.stocks != null && this.props.stocks.length > 0) {
            console.log(this.props)
            return (
                <TableContainer component={Paper}>
                    <Table className="table-class" sx={{ border: 1, minWidth: 650 }} size="small" aria-label="simple table">
                        <TableHead sx={{ backgroundColor: "#3d93f5" }}>
                            <TableRow>
                                <TableCell align="center">Название</TableCell>
                                <TableCell align="center">Цена</TableCell>
                                <TableCell align="center">Количество</TableCell>
                                <TableCell align="center">{ (this.props.type === "buy")? "Продавец" : "Владелец" }</TableCell>
                                <TableCell align="center"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.stocks.map((stock) => {
                                    return <StockRow price={this.props.allstocks[stock.id].startingPrice} name={stock.name} count={stock.count} type={this.props.type} key={stock.owner_id + "." + stock.id} id={stock.id} owner_id={stock.owner_id} owner_name={stock.owner_name} onSell={this.props.onSell} onNotsell={this.props.onNotsell} onBuy={this.props.onBuy}/>
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        } else {
            return (
                <Container maxWidth="xl">
                    <Typography align="center" component="h5" variant="h5">
                        Ничего нет.
                    </Typography>
                </Container>
            );
        }
    }
}

class StocksForBuying extends React.Component {
    constructor(props) {
        super(props);
    }

    getStocks() {
        let stocks = [];

        if (this.props.stocks) {
            stocks = this.props.stocks.filter((stock) => stock.count > 0);

            for (let user of this.props.users) {
                if (user.id !== this.props.user.id) {
                    for (let stock of user.selling_stocks) {
                        if (stock.count > 0) {
                            stock.name = this.props.stocks[stock.id].name;
                            stock.owner_id = user.id;
                            stock.owner_name = user.name;
                            stocks.push(stock);
                        }
                    }
                }
            }
        }

        return stocks;
    }

    render() {
        return (
            <Container maxWidth="xl" sx={{ display: (!(this.props.settings) || this.props.settings.state !== "in")? "none" : "block" }}>
                <Stack spacing={2}>
                    <Typography mt={6} align="center" component="h4" variant="h4">
                        Доступные для покупки акции
                    </Typography>
                    <StocksTable type={"buy"} stocks={this.getStocks()} onBuy={this.props.onBuy} allstocks={this.props.stocks}/>
                </Stack>
            </Container>
        );
    }
}

class OwnStocksOnSaleComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container maxWidth="xl">
                <Stack spacing={2}>
                    <Typography mt={6} align="center" component="h4" variant="h4">
                        Акции, выставленные на продажу
                    </Typography>
                    <StocksTable type={"sell"} stocks={(this.props.user && this.props.stocks)? this.props.user.selling_stocks.filter((stock) => stock.count > 0).map((stock) => {
                        stock.name = this.props.stocks[stock.id].name;
                        stock.owner_id = this.props.user.id;
                        stock.owner_name = this.props.user.name;
                        return stock;
                    }) : null} onNotsell={this.props.onNotsell} allstocks={this.props.stocks}/>
                </Stack>
            </Container>
        );
    }
}

class OwnStocksComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container maxWidth="xl">
                <Stack spacing={2}>
                    <Typography mt={6} align="center" component="h4" variant="h4">
                        Купленные акции
                    </Typography>
                    <StocksTable type="own" stocks={(this.props.user && this.props.stocks)? this.props.user.stocks.filter((stock) => stock.count > 0).map((stock) => {
                        stock.name = this.props.stocks[stock.id].name;
                        stock.owner_id = this.props.user.id;
                        stock.owner_name = this.props.user.name;
                        return stock;
                    }): null} onSell={this.props.onSell} allstocks={this.props.stocks}/>
                </Stack>
            </Container>
        );
    }
}

class StatusComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Stack spacing={2}>
                <Typography mt={2} align="center" component="p" variant="p">
                    Участник: {(this.props.user) ? this.props.user.name : ""}
                </Typography>
                <Typography mt={2} align="center" component="p" variant="p">
                    Баланс: {(this.props.user) ? this.props.user.balance : 0}
                </Typography>
                <Typography mt={2} align="center" component="p" variant="p">
                    Доход: {(this.props.user)? (this.props.user.earn - this.props.user.waste) : 0} (получено: {(this.props.user)? this.props.user.earn : 0}, потрачено: {(this.props.user)? this.props.user.waste : 0})
                </Typography>
                <Typography mt={2} align="center" component="p" variant="p">
                    Цена меняется каждые {(this.props.settings) ? this.props.settings.interval : 0} секунд
                </Typography>
                <Typography mt={2} align="center" component="p" variant="p">
                    Дата начала аукциона: {(this.props.settings) ? this.props.settings.datetimeStart.replace("T", " ") : ""}
                </Typography>
                <Typography mt={2} align="center" component="p" variant="p">
                    Дата окончания аукциона: {(this.props.settings) ? this.props.settings.datetimeEnd.replace("T", " ") : ""}
                </Typography>
            </Stack>
        );
    }
}

class UserComponent extends React.Component{
    constructor(props) {
        super(props);
        this.onSellStock = this.onSellStock.bind(this);
        this.onCancelSellStock = this.onCancelSellStock.bind(this);
        this.onBuyStock = this.onBuyStock.bind(this);

        this.state = {
            user_id: null,
            socket: null,
            updateInfo: true
        }
    }

    componentDidMount() {
        const splitUrl = window.location.href.split("/");
        const userId = parseInt(splitUrl[splitUrl.length - 1]);
        this.setState({user_id: userId});

        $.get("http://localhost:5010/storage/", (data) => {
            this.props.initState({
                users: data.state.brokers,
                stocks: data.state.stocks,
                settings: data.state.settings
            })
        })

        let socket = io.connect("http://localhost:5030");
        this.setState({socket: socket});

        socket.on("start", () => {
            this.props.start();
            this.setState({updateInfo: true});
        });

        socket.on("end", () => {
            this.props.end();
            this.setState({updateInfo: true});
        });

        socket.on("change", (data) => {
            this.props.changePrice(data.stocks);
            this.setState({updateInfo: true});
        });

        socket.on("sell", (data) => {
            this.props.sellStock(data.sellInfo);
            this.setState({user_id: this.state.user_id});
        });

        socket.on("buy", (data) => {
            this.props.buyStock(data.transaction);
            this.setState({user_id: this.state.user_id});
        })

        socket.on("notsell", (data) => {
            this.props.cancelSell(data.notsellInfo);
            this.setState({user_id: this.state.user_id});
        })
    }

    componentWillUnmount() {
        if (this.state.socket) {
            this.state.socket.disconnect();
        }
    }

    onSellStock(stock_id, count) {
        let sellInfo = {
            seller_id: this.state.user_id,
            stock_id: stock_id,
            count: count
        }
        this.state.socket.emit("sell", {sellInfo: sellInfo});
    }

    onCancelSellStock(stock_id, count) {
        let notsellInfo = {
            seller_id: this.state.user_id,
            stock_id: stock_id,
            count: count
        }
        this.state.socket.emit("notsell", {notsellInfo: notsellInfo});
    }

    onBuyStock(stock_id, count, owner_id) {
        let transaction = {
            buyer_id: this.state.user_id,
            seller_id: owner_id !== undefined ? owner_id : -1,
            stock_id: stock_id,
            count: count,
            price: this.props.stocks[stock_id].startingPrice
        };
        this.state.socket.emit("buy", {transaction: transaction});
    }

    render() {
        return (
            <Container maxWidth="xl">
                <Stack spacing={2}>
                    <Typography mt={2} align="center" component="h2" variant="h5">
                        Биржа акций - Покупка акций
                    </Typography>
                    <StatusComponent settings={this.props.settings} user={(this.props.users) ? this.props.users[this.state.user_id] : null}/>
                    <OwnStocksComponent settings={this.props.settings} stocks={this.props.stocks} user={(this.props.users) ? this.props.users[this.state.user_id] : null} onSell={this.onSellStock}/>
                    <OwnStocksOnSaleComponent settings={this.props.settings} stocks={this.props.stocks} user={(this.props.users) ? this.props.users[this.state.user_id] : null} onNotsell={this.onCancelSellStock}/>
                    <StocksForBuying settings={this.props.settings} users={this.props.users} stocks={this.props.stocks} user={(this.props.users) ? this.props.users[this.state.user_id] : null} onBuy={this.onBuyStock}/>
                </Stack>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: state.get("users"),
        stocks: state.get("stocks"),
        settings: state.get("settings")
    }
}

const connect = require("react-redux").connect
const actions = require("../../redux/actions-creators")

export default connect(mapStateToProps, actions)(UserComponent)