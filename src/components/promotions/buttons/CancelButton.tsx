import IconButton from "@material-ui/core/IconButton"
import {Clear} from "@material-ui/icons"
import React from "react"

const CancelButton = ({ onExecute }: any) => (
    <IconButton color="secondary" onClick={onExecute} title="Cancel">
        <Clear />
    </IconButton>
)

export default CancelButton
