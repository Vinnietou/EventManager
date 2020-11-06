const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User{
            _id: ID!
            email: String!
            password: String
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
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
    
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: async () => {
            try {
                return await Event.find();
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
        createEvent: async args => {
                        
            try{
                const {title, description, price, date } = args.eventInput;
                const event = new Event({
                    title, description, price, date: new Date(date),
                    creator: "5fa5a51d7f9fd7093a1bee74"
                });
                const result = await event
                    .save();
                const user = await User.findById("5fa5a51d7f9fd7093a1bee74");
                if(!user) {throw new Error("User not found", err)}
                await user.createdEvents.push(result);
                await user.save();
                console.log(result);
                return result;
            }catch (err) {
                console.log(err);
                if(err.message = "User not found"){
                    throw err;
                }else{
                    throw new Error("Event not created", err)
                };
            }
        },
        createUser: async args => {
        
            try{
                const {email} = args.userInput;
                const passwordHash = await bcrypt.hash(args.userInput.password,12);
                const existingUser = await User.findOne({email});
                
                if(existingUser) {throw new Error("User already exists")}

                const user = new User({
                    email: email,
                    password: passwordHash
                });
                
                const result = await user
                    .save();
                    console.log(user);
                    result.password = null;
                    return result;
            }catch(err){
                console.log(err)
                throw err;
            }
        }
    },
    graphiql: true   
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
    }@clustercero.4b7sk.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,
    {useNewUrlParser: true, useUnifiedTopology: true}
    ).then(() => {
        app.listen(5000);
        console.log("Database Connection Successful");
    }).catch(error => {
        console.log(error);
    });

