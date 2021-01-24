import React, {Component} from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import LoginContext from '../context/login-context'
import './PageEvents.css';

class EventsPage extends Component{
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null,
        viewingEventDetails: false,
        editingEvent: false
    };
    isActive = true;

    static contextType = LoginContext;

    constructor(props) {
        super(props);
        this.titleElement = React.createRef();
        this.priceElement = React.createRef();
        this.dateElement = React.createRef();
        this.descriptionElement = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    beginCreateEventHandler = () => {
        this.setState({creating: true});
    }

    modalConfirmHandler = () => {
        this.setState({creating: false});
        const title = this.titleElement.current.value;
        const price = +this.priceElement.current.value;
        const date = this.dateElement.current.value;
        const description = this.descriptionElement.current.value;

        if(
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        const event = {title, price, date, description};
        console.log(event);

        const requestBody = {
            query: `
                mutation CreateEvent(
                    $newEventTitle: String!,
                    $newEventDescription: String!,
                    $newEventPrice: Float!,
                    $newEventDate: String!
                    ) {
                        createEvent(eventInput: {
                            title: $newEventTitle,
                            description: $newEventDescription,
                            price: $newEventPrice,
                            date: $newEventDate
                        }) {
                            _id
                            title
                            description
                            price
                            date
                        }
                    }
            `,
            variables: {
                newEventTitle: title,
                newEventDescription: description,
                newEventPrice: price,
                newEventDate: date
            }
        };  

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    price: resData.data.createEvent.price,
                    date: resData.data.createEvent.date,
                    creator: {
                        _id: this.context.userId,
                    }
                });
                return {events: updatedEvents};
            });
        })
        .catch(err => {
            console.log(err);
        });
    };

    modalCancelHandler = () => {
        this.setState({creating: false, selectedEvent: null, viewingEventDetails: false, editingEvent: false});
    };

    fetchEvents() {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator{
                            _id
                            email
                        }
                    }
                }
            `
        };  

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const events = resData.data.events;
            if(this.isActive){
                this.setState({events: events, isLoading: false});
            }
        })
        .catch(err => {
            console.log(err);
            if(this.isActive){
                this.setState({isLoading: false});
            }
        });
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId)
            return {
                selectedEvent: selectedEvent,
                viewingEventDetails: true
            };
        });
    }

    updateEventFromListHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId)
            return {
                selectedEvent: selectedEvent,
                editingEvent: true,
                viewingEventDetails: false
            };
        });
    }

    deleteEventFromListHandler = eventId => {
        if(!this.context.token){
            this.setState({selectedEvent: null});
            return;
        }

        const selectedEventId = eventId;

        const requestBody = {
            query: `
                mutation DeleteMyEvent ($selectedId: ID!){
                    deleteEvent(eventId: $selectedId) {
                        _id
                    }
                }
            `,
            variables: {
                selectedId: selectedEventId
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            if(this.isActive){
                this.setState({ selectedEvent: null });
                this.fetchEvents();
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    modalBookEventHandler = () => {
        if(!this.context.token){
            this.setState({
                selectedEvent: null,
                viewingEventDetails: false
            });
            return;
        }

        const selectedEventId = this.state.selectedEvent._id;
        
        const requestBody = {
            query: `
                mutation BookEvent ($selectedId: ID!){
                    bookEvent(eventId: $selectedId) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: {
                selectedId: selectedEventId
            }
        };  

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            if(this.isActive){
                this.setState({
                    selectedEvent: null,
                    viewingEventDetails: false
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    modalUpdateHandler = () => {
        if(!this.context.token){
            this.setState({
                selectedEvent: null,
                viewingEventDetails: false,
                editingEvent: false
            });
            return;
        }

        this.setState({editingEvent: false});
        const title = this.titleElement.current.value;
        const price = +this.priceElement.current.value;
        const date = this.dateElement.current.value;
        const description = this.descriptionElement.current.value;
        const selectedEventId = this.state.selectedEvent._id;

        if(
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        const requestBody = {
            query: `
                mutation UpdateEvent(
                    $updatedEvent: ID!,
                    $updatedEventTitle: String!,
                    $updatedEventDescription: String!,
                    $updatedEventPrice: Float!,
                    $updatedEventDate: String!
                    ) {
                        updateEvent(eventId: $updatedEvent, eventInput: {
                            title: $updatedEventTitle,
                            description: $updatedEventDescription,
                            price: $updatedEventPrice,
                            date: $updatedEventDate
                        }) {
                            _id
                            title
                            description
                            price
                            date
                        }
                    }
            `,
            variables: {
                updatedEvent: selectedEventId,
                updatedEventTitle: title,
                updatedEventDescription: description,
                updatedEventPrice: price,
                updatedEventDate: date
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            if(this.isActive){
                this.setState({ 
                    selectedEvent: null,
                    editingEvent: false,
                    viewingEventDetails: false
                });
                this.fetchEvents();
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    render(){

        return(
            <React.Fragment>
                {(this.state.creating || this.state.viewingEventDetails || this.state.editingEvent) && <Backdrop/>}
                {this.state.creating && (
                    <Modal 
                        title="Add Event"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Confirm"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleElement}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceElement}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateElement}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionElement}></textarea>
                            </div>
                        </form>
                    </Modal>
                )}
                {this.state.viewingEventDetails && (<Modal 
                        title={this.state.selectedEvent.title}
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalBookEventHandler}
                        confirmText={this.context.token ? "Book Event" : "Back"}
                    >
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>PLN {this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>
                )}
                {this.state.editingEvent && (
                    <Modal 
                        title="Update Event"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalUpdateHandler}
                        confirmText="Update"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleElement}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceElement}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateElement}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionElement}></textarea>
                            </div>
                        </form>
                    </Modal>
                )}        
                {this.context.token && (<div className="events-control">
                    <p>Share your own Event!</p>
                    <button className="btn" onClick={this.beginCreateEventHandler}>Create Event</button>
                </div>)}
                {this.state.isLoading ? 
                    (<div className="spinner"><p>Loading...</p></div>) : 
                    (<EventList 
                        events={this.state.events}
                        loggedInUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler}
                        onViewUpdate={this.updateEventFromListHandler}
                        onClickDelete={this.deleteEventFromListHandler}
                    />)
                }
            </React.Fragment>
        );
    }
}

export default EventsPage;