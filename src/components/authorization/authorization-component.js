import React from "react";
import $ from "jquery"
import { Button, Container, Stack, Typography, TextField } from "@mui/material";

export class AuthorizationComponent extends React.Component {
    state = {
        brokers: [],
        loginInputValue: "",
        error: false,
        helperText: ""
    }

    constructor(props) {
        super(props);
        this.onEnterPressed = this.onEnterPressed.bind(this);
        this.onInputChanged = this.onInputChanged.bind(this);
    }

    componentDidMount() {
        $.get('http://localhost:5010/storage/brokers', (responseData) => {
            if (responseData.success) {
                this.setState({ brokers: responseData.data });
            }
        })
    }

    onEnterPressed() {
        this.setState({ error: false, helperText: "" });

        let foundBrokers = this.state.brokers.filter((broker) => this.state.loginInputValue === broker.login);
        let broker = (foundBrokers.length > 0)? foundBrokers[0] : null;

        if (!broker) {
            this.setState({ error: true, helperText: "Данный пользователь не существует." });
        } else if (broker.admin) {
            window.location.href = `/admin`;
        } else {
            window.location.href = `/user/${broker.id}`;
        }
    }

    onInputChanged(event) {
        this.setState({ loginInputValue: event.target.value });
    }

    render() {
        return <Container maxWidth="sm">
            <Stack spacing={2}>
                <Typography mt={2} align="center" component="h2" variant="h5">
                    Биржа акций - Авторизация
                </Typography>
                <TextField label="Логин" variant="standard" error={this.state.error} helperText={this.state.helperText}
                           onChange={this.onInputChanged} />
                <Button variant="outlined" onClick={this.onEnterPressed}>Войти</Button>
            </Stack>
        </Container>;
    }
}

