import IconButton from "@material-ui/core/IconButton";
import {Check} from "@material-ui/icons";
import {PRIMARY_COLOR} from "../../../constants/constants";
import React from "react";

const CommitButton = ({ onExecute }: any) => (
    <IconButton onClick={onExecute} title="Save">
        <Check style={{ color: PRIMARY_COLOR }} />
    </IconButton>
)

export default CommitButton
