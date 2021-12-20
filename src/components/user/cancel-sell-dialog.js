import React, { useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';

export default function CancelSellDialog(props) {
    const [isDialogOpened, setDialogOpened] = React.useState(false);
    const [countInputError, setCountInputError] = React.useState(false);
    const [countInputHelperText, setCountInputHelperText] = React.useState("");
    const countRef = useRef();

    const onOpenPressed = () => {
        setDialogOpened(true);
    };

    const onClosePressed = () => {
        setCountInputError(false);
        setCountInputHelperText("");
        setDialogOpened(false);
    };

    const onCancelSellPressed = () => {
        const count = parseInt(countRef.current.value);

        if (count > props.max || count <= 0) {
            setCountInputError(true);
            setCountInputHelperText("Количество акций должно быть меньше " + (props.max + 1) + " и больше 0.");
        } else {
            props.onNotsellClick(count);
            setCountInputError(false);
            setCountInputHelperText("");
            setDialogOpened(false);
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={onOpenPressed}>Снять с продажи</Button>
            <Dialog open={isDialogOpened} onClose={onClosePressed} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Снять с продажи</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Сколько акций Вы хотите снять с продажи?
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Количество"
                        type="number"
                        fullWidth
                        inputRef={countRef}
                        size="small"
                        error={countInputError}
                        helperText={countInputHelperText}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={onCancelSellPressed}>Снять с продажи</Button>
                    <Button variant="contained" onClick={onClosePressed}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}