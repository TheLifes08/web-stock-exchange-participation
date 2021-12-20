import React from "react";
import {
    Button,
    Container, Paper,
    Stack,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import $ from "jquery";
import StartExchangeDialog from "./start-exchange-dialog";

class UserRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TableRow key={this.props.user.id}>
                <TableCell align="center">{this.props.user.id}</TableCell>
                <TableCell align="center">{this.props.user.name}</TableCell>
                <TableCell align="center">{this.props.user.login}</TableCell>
                <TableCell align="center">{this.props.user.balance}</TableCell>
                <TableCell align="center">{this.props.user.earn}</TableCell>
                <TableCell align="center">{this.props.user.waste}</TableCell>
                <TableCell align="center">{
                    this.props.user.stocks.filter((stock) => stock.count > 0).map((stock) => {
                        return <div key={"" + this.props.user.id + "|" + stock.id + "b"}>
                            {this.props.stocks[stock.id].name} ({stock.count} шт.)</div>;
                    })
                }</TableCell>
                <TableCell align="center">{
                    this.props.user.selling_stocks.filter((stock) => stock.count > 0).map((stock) => {
                        return <div key={"" + this.props.user.id + "|" + stock.id + "s"}>
                            {this.props.stocks[stock.id].name} ({stock.count} шт.)</div>;
                    })
                }</TableCell>
            </TableRow>
        );
    }
}

class UsersTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table className="table-class"  sx={{ border: 1, minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ backgroundColor: "#3d93f5" }}>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Участник</TableCell>
                            <TableCell align="center">Логин</TableCell>
                            <TableCell align="center">Баланс</TableCell>
                            <TableCell align="center">Получено</TableCell>
                            <TableCell align="center">Потрачено</TableCell>
                            <TableCell align="center">Купленные акции</TableCell>
                            <TableCell align="center">Акции, выставленные на продажу</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(this.props.users)? this.props.users.map((user) => {
                            return <UserRow key={user.id} user={user} stocks={this.props.stocks}/>;
                        }) : ""}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

class AdminComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            socket: null,
            stockPriceChangeType: 0
        }

        this.onStartExchangeClick = this.onStartExchangeClick.bind(this);
        this.onEndExchangeClick = this.onEndExchangeClick.bind(this);
        this.onSetStockPriceChangeClick = this.onSetStockPriceChangeClick.bind(this);
    }

    componentDidMount() {
        $.get("http://localhost:5010/storage/", (data) => {
            this.props.initState({
                users: data.state.brokers,
                settings: data.state.settings,
                stocks: data.state.stocks
            });

            this.setState({stockPriceChangeType: this.props.stocks[0].changeType});
        });

        const socket = io.connect("http://localhost:5030");

        this.setState({ socket: socket });

        socket.on("start", () => {
            this.props.start();
        });

        socket.on("end", () => {
            this.props.end();
        });

        socket.on("change", (data) => {
            this.props.changePrice(data.stocks);
        });

        socket.on("sell", (data) => {
            this.props.sellStock(data.sellInfo);
        });

        socket.on("buy", (data) => {
            this.props.buyStock(data.transaction);
        });

        socket.on("notsell", (data) => {
            this.props.cancelSell(data.notsellInfo);
        });
    }

    componentWillUnmount() {
        if (this.state.socket) {
            this.state.socket.disconnect();
        }
    }

    onSetStockPriceChangeClick() {
        if (this.state.stockPriceChangeType === 0) {
            this.setState({stockPriceChangeType: 1})
        } else {
            this.setState({stockPriceChangeType: 0})
        }

        this.state.socket.emit("setChange", {type: (this.state.stockPriceChangeType === 0)? 1 : 0});
    }

    onStartExchangeClick() {
        this.state.socket.emit("start", this.props.settings.interval, this.props.settings.datetimeEnd);
        this.props.start();
    }

    onEndExchangeClick() {
        this.state.socket.emit("end");
        this.props.end();
    }

    render() {
        return (
            <Container maxWidth="xl">
                <Stack spacing={2}>
                    <Typography mt={2} align="center" component="h2" variant="h5">
                        Биржа акций - Администрирование
                    </Typography>
                    <UsersTable {...this.props} />
                    <Typography mt={2} align="center" component="h4" variant="h5">
                        Текущий закон изменения цен: {(this.state.stockPriceChangeType === 0) ? "Равномерный" : "Нормальный"}
                    </Typography>
                    <Typography mt={2} align="center" component="h4" variant="h5" hidden={!this.props.settings || this.props.settings.state !== "after"}>
                        Торги окончены
                    </Typography>
                    <Typography mt={2} align="center" component="h4" variant="h5" hidden={!this.props.settings || this.props.settings.state !== "before"}>
                        Начало торгов: {this.props.settings ? new Date(this.props.settings.datetimeStart).toLocaleDateString() + " " + new Date(this.props.settings.datetimeEnd).toLocaleTimeString()  : ""}
                    </Typography>
                    <Typography mt={2} align="center" component="h4" variant="h5" hidden={!this.props.settings || this.props.settings.state !== "in"}>
                        Завершение торгов: {this.props.settings ? new Date(this.props.settings.datetimeEnd).toLocaleDateString() + " " + new Date(this.props.settings.datetimeEnd).toLocaleTimeString() : ""}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={this.onSetStockPriceChangeClick}>Установить другой закон</Button>
                        <StartExchangeDialog settings={this.props.settings} onStartExchangeClick={this.onStartExchangeClick}/>
                        <Button variant="contained" disabled={!this.props.settings || this.props.settings.state !== "in"} onClick={this.onEndExchangeClick}>Завершить торги</Button>
                    </Stack>
                </Stack>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: state.get("users"),
        settings: state.get("settings"),
        stocks: state.get("stocks")
    }
}

const connect = require("react-redux").connect;
const actions = require("../../redux/actions-creators");

export default connect(mapStateToProps, actions)(AdminComponent)