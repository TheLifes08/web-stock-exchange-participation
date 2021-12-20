import React from "react";
import { Typography } from "@mui/material";

export class NotFoundComponent extends React.Component {
    render() {
        return (
            <Typography mt={2} align="center" component="h2" variant="h5">
                404. Страница не найдена.
            </Typography>
        );
    }
}