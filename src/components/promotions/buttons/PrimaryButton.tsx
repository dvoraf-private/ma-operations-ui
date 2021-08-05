import { IPrimaryButtonProps } from "../../../constants/types"
import AddIcon from "@material-ui/icons/Add"
import Button from "@material-ui/core/Button"
import React from "react"
import { createPromotions } from "../../../api/api"

const PrimaryButton = ({text, style, onSuccess, onFail}: IPrimaryButtonProps) => {

    const generateData = () => {
        createPromotions()
            .then((res) => {
                onSuccess(res.amount)
            })
            .catch(() => {
                onFail()
            })
    }

    return (<Button
        variant="outlined"
        color="primary"
        className={ style }
        startIcon={ <AddIcon /> }
        onClick={ generateData }
    > {text} </Button>)
}

export default PrimaryButton
