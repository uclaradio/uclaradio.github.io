// DateTimeField.js

var React = require('react');

/**
*  Allow user to select date and time as format ddd/hh (Mon / 10am)
*  @prop day: current day
*  @prop time: current time
*  @prop onDayChange: function to call when day changes
*  @prop onTimeChange: function to call when time changes
*/
var DateTimeField = React.createClass({
  render: function() {
    return (
      <div className="dateTimeField">
        <select value={this.props.day} onChange={this.props.onDayChange}>
          <option value="Mon">Monday</option>
          <option value="Tue">Tuesday</option>
          <option value="Wed">Wednesday</option>
          <option value="Thu">Thursday</option>
          <option value="Fri">Friday</option>
          <option value="Sat">Saturday</option>
          <option value="Sun">Sunday</option>
        </select>
        &ensp;
        <select value={this.props.time} onChange={this.props.onTimeChange}>
          <option value="12am">12AM</option>
          <option value="1am">1AM</option>
          <option value="2am">2AM</option>
          <option value="3am">3AM</option>
          <option value="4am">4AM</option>
          <option value="5am">5AM</option>
          <option value="6am">6AM</option>
          <option value="7am">7AM</option>
          <option value="8am">8AM</option>
          <option value="9am">9AM</option>
          <option value="10am">10AM</option>
          <option value="11am">11AM</option>
          <option value="12pm">12PM</option>
          <option value="1pm">1PM</option>
          <option value="2pm">2PM</option>
          <option value="3pm">3PM</option>
          <option value="4pm">4PM</option>
          <option value="5pm">5PM</option>
          <option value="6pm">6PM</option>
          <option value="7pm">7PM</option>
          <option value="8pm">8PM</option>
          <option value="9pm">9PM</option>
          <option value="10pm">10PM</option>
          <option value="11pm">11PM</option>
        </select>
    </div>
    );
  }
});

module.exports = DateTimeField;