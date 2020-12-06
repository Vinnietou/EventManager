import React from 'react';

import './BookingList.css';

const bookingList = props => (
    <ul className="booking__list">
        {props.bookings.map(booking => {
            return (
                <li className="booking__list-item" key={booking._id}>
                    <div>
                        {booking.event.title} - {' '}
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                        <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                    </div>
                </li>
            );
        })}
    </ul>
);

export default bookingList;