const { buildSchema } = require('graphql');

module. exports = buildSchema(`
type Booking{
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event{
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type User{
    _id: ID!
    email: String!
    admin: Boolean
    password: String
    createdEvents: [Event!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    admin: Boolean!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

input UserInput {
    email: String!
    password: String!
}

type RootQuery{
    bookings: [Booking!]!
    events: [Event!]!
    users: [User!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation{
    createEvent(eventInput: EventInput): Event
    updateEvent(eventId: ID!, eventInput: EventInput): Event
    deleteEvent(eventId: ID!): Event
    cancelBooking(bookingId: ID!): Event
    bookEvent(eventId: ID!): Booking!
    createUser(userInput: UserInput): User
    deleteUser(userId: ID!): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);