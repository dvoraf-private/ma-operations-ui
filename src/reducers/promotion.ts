export default function reducer(state: any, { type, payload }: any) {
    switch (type) {
        case "FIRST_LOAD":
            return {
                ...state,
                loading: true,
            }
        case "UPDATE_DATA":
            return {
                ...state,
                ...payload,
                loading: false,
            }
        case "START_LOADING":
            return {
                ...state,
                nextPage: payload.nextPage,
                limit: payload.limit,
            }
        case "ERROR_DATA":
            return {
                ...state,
                loading: false,
            }
        default:
            return state
    }
}
