export type ResponseData = {
    data: any
    current_page: number
    last_page: number
}

export type Response = {
    /** The status code of the response, e.g. 200 for success, 400 for bad request, etc. */
    status: number

    /** The data returned from the server, which can be of any type depending on the endpoint and request made. */
    data: ResponseData

    /** The message associated with the response, which can provide additional information about the success or failure of the request. */
    message: string
}

export type ResponseNoPagination = {
    /** The status code of the response, e.g. 200 for success, 400 for bad request, etc. */
    status: number

    /** The data returned from the server, which can be of any type depending on the endpoint and request made. */
    data: any

    /** The message associated with the response, which can provide additional information about the success or failure of the request. */
    message: string
}
