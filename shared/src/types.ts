export type User = {
    _id?: string
    username: string
    password: string
    type: 'manager' | 'user'
}

export type Rating = {
    username: string
    value: 1 | 2 | 3 | 4 | 5
}

export type Reservation = {
    _id?: string
    from: Date
    to: Date
    username: string
}

export type Bike = {
    model: string
    color: string
    location: string
    ratings: ReadonlyArray<Rating>
    reservations: ReadonlyArray<Reservation>
}

export type DateRange = [Date | null, Date | null]
