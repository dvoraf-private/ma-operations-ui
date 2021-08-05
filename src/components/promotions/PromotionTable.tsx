import React, { useEffect, useState, useReducer } from 'react'
import {
    SelectionState, EditingState, IntegratedSelection, Column, DataTypeProvider, VirtualTableState
} from '@devexpress/dx-react-grid'
import {
    Grid, VirtualTable, TableHeaderRow, TableSelection, TableEditRow, TableEditColumn, Table
} from '@devexpress/dx-react-grid-material-ui'
import { Getter } from "@devexpress/dx-react-core"
import { IPromotion, IState } from "../../constants/types"
import _ from "lodash"
import { PRIMARY_COLOR, VIRTUAL_ROWS_AMOUNT, MAX_ROWS } from "../../constants/constants"
import {IconButton, TableCell, MenuItem, Select, Input, Paper} from '@material-ui/core'
import { Close, LibraryAdd } from '@material-ui/icons'
import Alert from "@material-ui/lab/Alert"
import { ThemeProvider, withStyles } from "@material-ui/core/styles"
import styles from "./PromotionHP.module.scss"
import PrimaryButton from "./buttons/PrimaryButton"
import EditButton from "./buttons/EditButton"
import DeleteButton from "./buttons/DeleteButton"
import CommitButton from "./buttons/CommitButton"
import CancelButton from "./buttons/CancelButton"
import DuplicateButton from "./buttons/DuplicateButton"
import { tableTheme, useStyles, editingTheme } from "../../constants/theme"
import { Loading } from './Loading'
import { getPromotions, updatePromotion, deletePromotion, addPromotion } from "../../api/api"
import reducer from "../../reducers/promotion"

const PromotionTable = () => {

    const initialState: IState = {
        rows: [],
        page: 0,
        nextPage: 0,
        limit: VIRTUAL_ROWS_AMOUNT * 2,
        totalCount: 0,
        loading: false
    }

    const TITLE = 'Promotions List'
    const classes = useStyles()

    const [state, dispatch] = useReducer(reducer, initialState)
    const { rows, page, totalCount, loading } = state;

    const [columns, setColumns] = useState<Column[]>([])
    const [showAlert, setShowAlert] = useState(false)
    const [showFailedAlert, setShowFailedAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [editingRowIds, getEditingRowIds] = useState<Array<number | string> >([])
    const [rowChanges, setRowChanges] = useState({});
    const [noDataLoading, setNoDataLoading] = useState(false)
    const [dateColumns] = useState(['startDate', 'endDate'])
    const [tableColumnExtensions] = useState([
        {columnName: '', width: 57}
    ])

    const getColumnsName = (data: IPromotion[]): string[] =>{
        const columnNames: string[] = _.uniq(_.flatten(data.map((record) => {return _.keys(record) })))

        return  columnNames
    }

    const getColumns = (data: [{}]): Column[] => {
        const columnNames: string[] = _.uniq(_.flatten(data.map((record) => {return _.keys(record) })))
        _.pull(columnNames, 'uuid')
        const columns: Column[] = []

        _.map(columnNames, (c) => {
            columns.push({
                name: c,
                title: _.startCase(c)
            })
        })

        // Add Actions column with no title
        columns.push({
            name: ''
        })

        return  columns
    }

    const loadPromotionData = ({nextPage, limit}: any) => {
        setNoDataLoading(true)
        dispatch({ type: "FIRST_LOAD" })

        getPromotions(nextPage, limit)
            .then((data: any) => {
                setColumns(getColumns(data.promotions))
                // @ts-ignore
                const mapData = data.promotions.map((p: any) => _.pick(p, getColumnsName(data.promotions)))

                dispatch({
                    type: "UPDATE_DATA",
                    payload: {
                        page: nextPage,
                        rows: mapData,
                        totalCount: MAX_ROWS,
                    },
                })
                setNoDataLoading(false)
            })
    }

    // useEffect(() => {
    //     loadPromotionData(state)
    // }, [])

    const getRows = (nextPage: number, limit: number) => {
        console.log('-getRows--', nextPage , limit)
        loadPromotionData({ nextPage, limit })
        dispatch({ type: "START_LOADING", payload: { nextPage, limit } });
    }

    const onRowUpdate = (changed: any) => {
        let changedRows = rows.map((promotion: IPromotion) => (changed[promotion.uuid] ? { ...promotion, ...changed[promotion.uuid] } : promotion))
        const editedPromotion = changedRows.find((p: IPromotion) => changed[p.uuid])

        updatePromotion(editedPromotion)
            .then(() => {
                dispatch({
                    type: "UPDATE_DATA",
                    payload: {
                        rows: changedRows
                    },
                })

                setAlert(true, 'Promotion updated successfully')
            })
            .catch(() => {
                dispatch({ type: 'ERROR_DATA'})
                setAlert(false, 'Failed to update promotion')
            })
    }

    const onRowDelete = (deletedIds: string[]) => {
        const changedRows = rows.slice()

        deletedIds.forEach((rowId: string) => {
            deletePromotion(rowId)
                .then(() => {
                    const index = changedRows.findIndex((p: IPromotion) => p.uuid === rowId)
                    if (index > -1) {
                        changedRows.splice(index, 1);
                    }

                    dispatch({
                        type: "UPDATE_DATA",
                        payload: {
                            rows: changedRows,
                        },
                    })

                    setAlert(true, 'Promotion deleted successfully')
                })
                .catch(() => {
                    dispatch({ type: 'ERROR_DATA'})
                    setAlert(false, 'Failed to delete promotion')
                })
        })

    }

    const onDuplicateRow = (newData: IPromotion) => {
        addPromotion(newData)
            .then((newUuid: string) => {
                const { uuid, ...data } = newData
                const promotions = rows
                // @ts-ignore
                data["uuid"] = newUuid
                // @ts-ignore
                promotions.unshift(data)

                dispatch({
                    type: "UPDATE_DATA",
                    payload: {
                        rows: promotions,
                    },
                })

                setAlert(true, 'Promotion was duplicated')
            })
            .catch(() => {
                dispatch({ type: 'ERROR_DATA'})
                setAlert(false, 'Failed to duplicate promotion')
            })
    }

    const commitChanges = ({ changed, deleted }: any): any => {
        if (changed) {
            onRowUpdate(changed)
        }

        if (deleted) {
            onRowDelete(deleted)
        }
    }

    const DateFormatter = (value: any) => new Date(value.value).toLocaleDateString()

    const StringTypeProvider = (props: any) => (
        <DataTypeProvider
            formatterComponent={DateFormatter}
            {...props}
        />
    )

    const commandComponents = {
        duplicate: DuplicateButton,
        edit: EditButton,
        delete: DeleteButton,
        commit: CommitButton,
        cancel: CancelButton,
    }

    const Command = ({ id, onExecute }: any) => {
        // @ts-ignore
        const CommandButton = commandComponents[id]

        return (
            <CommandButton
                onExecute={onExecute}
            />
        )
    }

    const onDataGenerated = (amount: string) => {
        setAlert(true, `${amount} records created successfully`)
    }

    const onFail = () => {
        setAlert(false, 'Failed to generate data')
    }

    const setAlert = (success: boolean, msg: string): void => {
        success ? setShowAlert(true) : setShowFailedAlert(true)
        setAlertMessage(msg)
    }

    const showAlertNotification = () => {
        return (showFailedAlert || showAlert) ?
            <Alert severity={ showFailedAlert ? "error" : "success" }
               action={
                   <IconButton
                       aria-label="close"
                       color="inherit"
                       size="small"
                       onClick={() => {
                           setShowAlert(false)
                       }}
                   >
                       <Close fontSize="inherit" />
                   </IconButton>
                }> {alertMessage}
        </Alert> : null
    }

    const LookupEditCellBase = ({ availableColumnValues, value, onValueChange, classes }: any) => (
        <TableCell
            className={classes.lookupEditCell}
        >
            <Select
                value={value}
                onChange={event => onValueChange(event.target.value)}
                MenuProps={{
                    className: classes.selectMenu,
                }}
                input={(
                    <Input
                        classes={{ root: classes.inputRoot }}
                    />
                )}
            >
                {availableColumnValues.map((item: any) => (
                    <MenuItem key={item} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </TableCell>
    )

    // @ts-ignore
    const LookupEditCell = withStyles(editingTheme, { name: 'ControlledModeDemo' })(LookupEditCellBase)

    const selectValues = {
        type: ['Basic', 'Common', 'Epic']
    }

    const EditCell = (props: any) => {
        const { column } = props
        // @ts-ignore
        const availableColumnValues = selectValues[column.name]
        if (availableColumnValues) {
            return <LookupEditCell { ...props } availableColumnValues={ availableColumnValues } />
        }
        if(column.name === '') {
            return <div></div>
        }

        return <TableEditRow.Cell { ...props } />
    }

    const noDataCell = () => {
        return noDataLoading ? <Loading /> : null
    }

    const ActionCell = ({ row, column, ...restProps }: any) => {
        return column.name === "" ? (
            <Table.Cell column={column} row={row} {...restProps} >
                <IconButton onClick={() => {
                    onDuplicateRow(row)
                }}>
                    <LibraryAdd style={{color: PRIMARY_COLOR}}/>
                </IconButton>
            </Table.Cell>
        ) : (
            <Table.Cell row={row} column={column} {...restProps} />
        )
    }

    const reOrderColumns = ({tableColumns}: any) => {
        const result = [
            ...tableColumns.filter((c: any) => c.type !== TableEditColumn.COLUMN_TYPE),
            { key: 'editCommand', type: TableEditColumn.COLUMN_TYPE, width: 140 }
        ]
        return result
    }

    const getRowId = (row: any) => row.uuid

    return (
        <div>
            { showAlertNotification() }
            <div className={ styles.container }>
                <div className={ styles.title }>{TITLE}</div>
                <PrimaryButton text={'generate data'} style={classes.addDataStyle}  onSuccess={ onDataGenerated } onFail={ onFail } />
            </div>
            <ThemeProvider theme={ tableTheme }>
                <Paper className={classes.root} >
                    <Grid
                        rows={rows}
                        columns={columns}
                        getRowId={getRowId}
                    >
                        <SelectionState />

                        <IntegratedSelection />

                        <StringTypeProvider
                            for={dateColumns}
                        />

                        <VirtualTableState
                            infiniteScrolling
                            loading={loading}
                            totalRowCount={totalCount}
                            pageSize={VIRTUAL_ROWS_AMOUNT}
                            skip={page}
                            getRows={getRows}
                        />

                        <VirtualTable
                            noDataCellComponent={noDataCell}
                            columnExtensions={tableColumnExtensions}
                            cellComponent={ActionCell}

                        />

                        <EditingState
                            editingRowIds={editingRowIds}
                            onEditingRowIdsChange={getEditingRowIds}
                            rowChanges={rowChanges}
                            onRowChangesChange={setRowChanges}
                            onCommitChanges={commitChanges}
                        />

                        <TableHeaderRow />
                        <TableSelection showSelectAll />
                        <TableEditRow
                            cellComponent={ EditCell }
                        />
                        <TableEditColumn
                            width={150}
                            showEditCommand
                            showDeleteCommand
                            commandComponent={ Command }
                        />
                        <Getter
                            name="tableColumns"
                            computed={reOrderColumns}
                        />
                    </Grid>
                </Paper>
            </ThemeProvider>
        </div>
    )
}

export default PromotionTable
