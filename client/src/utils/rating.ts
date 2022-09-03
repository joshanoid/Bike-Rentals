import { Bike } from 'shared/types'

export const calculateRating = (ratings: Bike['ratings']) => {
    if (ratings.length === 0) {
        return null
    }

    const ratingSum = ratings.reduce((sum, rating) => sum + rating.value, 0)

    return ratingSum / ratings.length
}
