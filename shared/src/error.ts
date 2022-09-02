import axios from 'axios'

export const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message
    }

    if (axios.isAxiosError(error)) {
        return error.response?.data
    }

    return String(error)
}
