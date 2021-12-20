import React, { useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';

export default function BuyDialog(props) {
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

    const onBuyPressed = () => {
        const count = parseInt(countRef.current.value);

        if (count > props.max || count <= 0) {
            setCountInputError(true);
            setCountInputHelperText("Количество акций должно быть меньше " + (props.max + 1) + " и больше 0.");
        } else {
            props.onBuyClick(count);
            setCountInputError(false);
            setCountInputHelperText("");
            setDialogOpened(false);
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={onOpenPressed}>Купить</Button>
            <Dialog open={isDialogOpened} onClose={onClosePressed} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Покупка акций</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Сколько акций Вы хотите купить?
                    </DialogContentText>
                    <TextField
                        autoFocus
                        size="small"
                        margin="dense"
                        label="Количество"
                        type="number"
                        fullWidth
                        error={countInputError}
                        helperText={countInputHelperText}
                        inputRef={countRef}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={onBuyPressed}>Купить</Button>
                    <Button variant="contained" onClick={onClosePressed}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}