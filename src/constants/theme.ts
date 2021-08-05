import {createMuiTheme, makeStyles, Theme} from "@material-ui/core/styles"
import {PRIMARY_COLOR, PRIMARY_COLOR_DARK, PRIMARY_COLOR_LIGHT} from "../constants/constants"

export const tableTheme = createMuiTheme({
    palette: {
        primary: {
            main: PRIMARY_COLOR,
        },
        secondary: {
            main: PRIMARY_COLOR,
        },
    },
    overrides: {
        MuiTableRow: {
            root: {
                "&:hover": {
                    backgroundColor: PRIMARY_COLOR_LIGHT,
                }
            }
        }
    }
})

export const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '1200px',
        margin: '50px auto',
        "& tr": {
            "&:hover": {
                backgroundColor: PRIMARY_COLOR_LIGHT,
            }
        },
        "& th": {
            backgroundColor: '#EEE'
        }
    },
    addDataStyle: {
        margin: theme.spacing(3),
        backgroundColor: PRIMARY_COLOR,
        color: 'white',
        "&:hover, &.Mui-focusVisible": { backgroundColor: PRIMARY_COLOR_DARK, color: 'white' }
    },
    actionCell: {
        width: '20px'
    }
}))

export const editingTheme = (theme: Theme) => ({
    lookupEditCell: {
        padding: theme.spacing(1)
    }
})
