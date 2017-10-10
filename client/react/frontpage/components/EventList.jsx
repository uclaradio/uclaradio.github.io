// EventTab.jsx
// list of events in events tab of frontpage

import React from 'react';
import { Link } from 'react-router';
import RectImage from '../../common/RectImage.jsx';
import Loader from './Loader.jsx';
import './EventList.scss';

const defaultColor = 'grey';
const colors = {
  'Ticket Giveaway': '#3c84cc', // blue
  'UCLA Radio Presents': '#098440', // green
  'Campus Event': '#842b78', // magenta
  'Local Event': '#cca437', // orange
};

const defaultEventPic = '/img/radio.png';

/**
Content of events page

@prop eventGroups: list of groups of event objects, each with a title (months)
@prop fetching: currently fetching objects
@prop updateEvents: callback action to fetch updated events from server
* */
const EventList = React.createClass({
  componentWillMount() {
    this.props.updateEvents();
  },
  render() {
    // describe colors with events legend
    const legend = Object.keys(colors).map(eventType => (
      <div className="colorKeyLabel" key={eventType}>
        <span>{eventType}</span>
        <div
          className="dot"
          style={{ backgroundColor: getBackgroundColor(eventType) }}
        />
      </div>
    ));

    return (
      <div className="eventsTab">
        {this.props.fetching && this.props.eventGroups.length == 0 ? (
          <Loader />
        ) : (
          <div>
            <div className="colorKey">{legend}</div>
            {this.props.eventGroups.map(month => (
              <div className="monthEvents" key={month.title}>
                <h1>{month.title}</h1>
                <div className="allEvents">
                  {month.events.map(event => {
                    const start = formatDate(event.start);
                    const eventColor = getBackgroundColor(event.type);
                    return (
                      <div className="event" key={event.id}>
                        <Link to={`/events/${event.id}`}>
                          <RectImage src={event.image || defaultEventPic} />
                          <div className="overlayWrapper">
                            <div
                              className="overlay"
                              style={{ backgroundColor: eventColor }}>
                              <p className="eventDate">{start}</p>
                              <div className="eventOverlay">
                                <p className="bandName">{event.host}</p>
                                <p className="separator">
                                  . . .&nbsp;&nbsp;&nbsp;. .
                                  .&nbsp;&nbsp;&nbsp;. . .
                                </p>
                                <p className="venue">{event.location}</p>
                              </div>
                            </div>
                            <div className="hoverOverlay">
                              <p className="enterLabel">
                                click for more details
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
});

var getBackgroundColor = function(type) {
  return colors[type] || defaultColor;
};

// Useful if we revert to google calendar
// var getBandName = function(desc){
//   return desc.substring(0, desc.indexOf("@") - 1);
// };

// var getVenue = function(desc){
//   return desc.substring(desc.indexOf("@") + 2);
// };

var formatDate = function(dateString) {
  const date = new Date(dateString);
  return date.getDate();
};

export default EventList;