import { Bike, Rating } from 'shared/types'

export type ExtendedBike = Bike & { _id: string; averageRating: number | null; canRate: boolean }

export type Filters = {
    model: string
    location: string
    color: string
    rating: null | Rating['value']
}
