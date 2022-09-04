export type User = {
    username: string
    password: string
    type: 'manager' | 'user'
}

export type Rating = {
    username: string
    value: 1 | 2 | 3 | 4 | 5
}

export type Reservation = {
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
