import IconButton from "@material-ui/core/IconButton";
import {Edit} from "@material-ui/icons";
import {PRIMARY_COLOR} from "../../../constants/constants";
import React from "react";

const EditButton = ({ onExecute }: any) => (
    <IconButton onClick={onExecute} style={{marginRight: '15px'}}>
        <Edit style={{ color: PRIMARY_COLOR}} />
    </IconButton>
)

export default EditButton
