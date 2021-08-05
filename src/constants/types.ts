import {VIRTUAL_ROWS_AMOUNT} from "./constants";

export interface IPromotion {
    tableData?: any;
    uuid: string,
    name: string,
    type: string,
    startDate: string,
    endDate: string,
    userGroupName: string
}

export interface IPrimaryButtonProps {
    text: string,
    style: any,
    onSuccess: any,
    onFail: any
}

export interface IState {
    rows: IPromotion[],
    page: number,
    nextPage: number,
    limit: number,
    totalCount: number,
    loading: boolean
}
