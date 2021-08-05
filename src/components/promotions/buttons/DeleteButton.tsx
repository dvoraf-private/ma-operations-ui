import IconButton from "@material-ui/core/IconButton"
import {Delete} from "@material-ui/icons"
import {PRIMARY_COLOR} from "../../../constants/constants"
import React, {Fragment} from "react"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

const DeleteButton = ({ onExecute }: any) => {

    const [open, setOpen] = React.useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const execDeletion = () => {
        onExecute()
    }


    return (
        <Fragment>
            <IconButton
                onClick={() => {
                    setOpen(true)
                    // eslint-disable-next-line
                    // if (window.confirm('Are you sure you want to delete this promotion?')) {
                    //     onExecute()
                    // }
                }}
                title="Delete"
            >
                <Delete style={{color: PRIMARY_COLOR}}/>
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText color={'initial'}>
                        Are you sure you want to delete this promotion?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={execDeletion} color="primary">
                        Yes
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment> )


}

export default DeleteButton
