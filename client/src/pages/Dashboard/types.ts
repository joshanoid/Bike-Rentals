import { Bike } from 'shared/types'

export type ExtendedBike = Bike & { _id: string; averageRating: number | null; canRate: boolean }

export type DateRange = [Date | null, Date | null]
