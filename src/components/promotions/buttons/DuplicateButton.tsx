import IconButton from "@material-ui/core/IconButton"
import {LibraryAdd} from "@material-ui/icons"
import {PRIMARY_COLOR} from "../../../constants/constants"
import React from "react"

const DuplicateButton = ({ onExecute }: any) => (
    <IconButton onClick={onExecute}>
        <LibraryAdd style={{ color: PRIMARY_COLOR }} />
    </IconButton>
)

export default DuplicateButton
