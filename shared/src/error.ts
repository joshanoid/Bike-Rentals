import axios from 'axios'

export const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return String(error.response?.data)
    }

    if (error instanceof Error) {
        return error.message
    }

    return String(error)
}
