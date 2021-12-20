import React, { useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

export default function StartExchangeDialog(props) {
    const [isDialogOpened, setDialogOpened] = React.useState(false);
    const [intervalError, setIntervalError] = React.useState(false);
    const [intervalHelperText, setIntervalHelperText] = React.useState("");
    const [datetimeError, setDatetimeError] = React.useState(false);
    const [datetimeHelperText, setDatetimeHelperText] = React.useState("");
    const intervalRef = useRef();
    const datetimeRef = useRef();

    const onOpenPressed = () => {
        setDialogOpened(true);
    };

    const onClosePressed = () => {
        setDialogOpened(false);
        setIntervalError(false);
        setDatetimeError(false);
        setIntervalHelperText("");
        setDatetimeHelperText("");
    };

    const onStartPressed = () => {
        setIntervalError(false);
        setDatetimeError(false);
        setIntervalHelperText("");
        setDatetimeHelperText("");

        let datetime = new Date(datetimeRef.current.value.substr(0, 19));
        datetime.setTime(datetime.getTime() + 3 * 60 * 60 * 1000);
        const currentDatetime = new Date();

        if (intervalRef.current.value <= 0) {
            setIntervalError(true);
            setIntervalHelperText("Интервал должен быть больше 0.");
        } else if (datetime.valueOf() <= currentDatetime.valueOf()) {
            setDatetimeError(true);
            setDatetimeHelperText("Время окончания торгов должно быть больше текущего времени.");
        } else {
            props.settings.interval = intervalRef.current.value;
            props.settings.datetimeEnd = datetime.toISOString().substr(0, 19);
            props.onStartExchangeClick();
            setDialogOpened(false);
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={onOpenPressed}>Начать торги</Button>
            <Dialog open={isDialogOpened} onClose={onClosePressed} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Настройки торгов</DialogTitle>
                <DialogContent>
                    <TextField
                        size="small"
                        margin="dense"
                        label="Интервал пересчета цены акций"
                        type="number"
                        defaultValue="10"
                        fullWidth
                        error={intervalError}
                        helperText={intervalHelperText}
                        inputRef={intervalRef}
                    />
                    <TextField
                        size="small"
                        margin="dense"
                        label="Дата окончания"
                        type="datetime-local"
                        defaultValue={(new Date()).toISOString().substr(0, 19)}
                        fullWidth
                        error={datetimeError}
                        helperText={datetimeHelperText}
                        inputRef={datetimeRef}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onStartPressed}>Начать торги</Button>
                    <Button variant="outlined" onClick={onClosePressed}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}