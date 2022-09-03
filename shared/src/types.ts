export type User = {
    username: string
    password: string
    type: 'manager' | 'user'
}

export type Rating = {
    username: string
    value: 1 | 2 | 3 | 4 | 5
}

export type Bike = {
    model: string
    color: string
    location: string
    ratings: ReadonlyArray<Rating>
}
