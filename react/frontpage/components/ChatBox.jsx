var React = require('react');
var List = require("collections/list");
var cookie = require('react-cookie');

var Bootstrap = require('react-bootstrap');
var Grid = Bootstrap.Grid;
var Col = Bootstrap.Col;
var Row = Bootstrap.Row;
var socket = io();

var getPreviousMessagesURL = "/chat/getNext";
var reportMessageURL = "/chat/report";

var newMessage = false;

require('./ChatBox.scss');

var Message = React.createClass({
  getInitialState: function() {
      return {};
  },
  reportMessage: function(text, user) {
    $.post(reportMessageURL, {
        text: text,
        user: user,
      });

    this.setState({reported: true});

  },
  render: function() {
      var date = new Date(this.props.date);
      var Month = date.getMonth() + 1;
      var Day = date.getDay() + 1;
      var Hour = date.getHours();
      var Minute = date.getMinutes();
      var Second = date.getSeconds();
      return (
        <div className="message"> 
        {

            <div className={(this.props.user != this.props.viewing_user) ? "their-message" : "my-message"}
            style={ (this.props.user == this.props.viewing_user) ? {float: "right"} : {float: "left"}}>
          	  <div className="message-body-tag">
                {
                  //if it's an image, display the image
                  this.props.text.split(' ').map(function(word){
                    if(word.length > 4 && word.substring(0,4) == "http") {
                      return (
                        <span>
                          <br />
                          <a href={word} target="_blank">
                            {imageURL(word) ? <img src={word} /> : ""}
                            <br />
                            {word} 
                          </a>
                          <br />
                        </span>
                      )
                    }
                    //otherwise just display the text
                    return word + " ";
                  })
                } {
                  this.props.user != this.props.viewing_user &&
                  <button className="report-message" onClick={() => {this.reportMessage(this.props.text, this.props.user)}}>
                    {
                      this.state.reported ? "GOT IT" : "REPORT"
                    }
                  </button>
                }
              </div>
              <br />
              <span id="message-username-tag" 
              style={ (this.props.user == this.props.viewing_user) ? {float: "right"} : {float: "left"}}>
                <span className="message-username-tag-username">
                  {this.props.user}
                </span>
                {" " /*+ Month + "/" + Day + " "*/ + Hour + ":" + Minute + ":" + Second}
              </span>  
          	</div>
        }
        </div>
      );
  }
});

var MessageList = React.createClass({
  componentDidUpdate: function() {
    if(newMessage == true) {
      this.props.scrollToBottom();
      newMessage = false;
    }
  },
  render: function() {
  	var viewing_user = this.props.user;
      return (
          <div id='messages' className='messages'>
              {
                  this.props.messages.map(function(message, i) {
                      return (
                          <span> {
                            !message.event && 
                            <Message
                              key={i}
                              user={message.user}
                              text={message.text}
                              date={message.date}
                              viewing_user={viewing_user}
                          	/> }
                            <br />
                          </span>
                      );
                  })
              }
          </div>
      );
  }
});


var MessageForm = React.createClass({
  getInitialState: function() {
      return {text: ''};
  },
  handleSubmit: function(e) {
      e.preventDefault();
      var str = this.state.text.replace(/\s/g, '');
      if(str != '') {
        var message = {
            user : this.props.user,
            text : this.state.text,
            date : new Date()
        }
        this.props.onMessageSubmit(message); 
        this.setState({ text: '' });
      }
      this.props.scrollToBottom;
  },
  //fill in form field as user types with what is specified in value=
  changeHandler: function(e) {
      this.setState({ text : e.target.value });
  },
  render: function() {
      return(
        <span>
          <div className='message_form'>
              <form onSubmit={this.handleSubmit}>
                  <input
                      onChange={this.changeHandler}
                      value={this.state.text}
                      placeholder="Write a Message"
                  />
                  <br /><br />
                  <div id="load_more_wrapper">
                    <center>
                      <input type="submit" value="SEND" id="load_more">
                      </input>
                    </center>
                  </div>
              </form>
          </div>
        </span>
      );
  }
});


var ChatBox = React.createClass({
  getInitialState: function() {
    var username = cookie.load('username');
    socket.emit('check if username exists', username);
    var messages = new List();
    return {user: username, messages:messages, text: ''};
  },
  componentDidMount: function() {
    socket.on('new message', this.messageRecieve);
    socket.on('assign username', this.setUsername);
    socket.on('username not found', this.usernameNotFound);
    this.getNext(null, 10);
  },
  getNext: function(id, volume) {
    $.post(getPreviousMessagesURL, {
        id: id,
        volume: volume,
      }, function(previousMessages) {
        var messages = this.state.messages;
        previousMessages.map(function(message){
          var formatted = {
                id : message._id,
              user : message.user,
              text : message.text,
              date : message.date
          };
          messages.unshift(formatted);
        });
        var message_db_cursor = messages.peek().id;
        this.setState({messages: messages, message_db_cursor: message_db_cursor});
      }.bind(this));
  },
  messageRecieve: function(message) {
    newMessage = true;
    this.state.messages.push(message);
    // var messages = this.state.messages;
    // messages.push(message);
    this.setState({messages: this.state.messages});
  },
  setUsername: function(username) {
    var d = new Date();
    d.setDate(d.getDate()+(2*365));
    cookie.save('username', username, {path: '/', expires:d});
    this.setState({user:username});
  },
  usernameNotFound: function() {
    socket.emit('add user');
  },
  handleMessageSubmit: function(message) {
    socket.emit('new message', message);
    this.messageRecieve(message);
    this.props.scrollToBottom();
  },
  retrieveOlderMessages: function() {
    this.getNext(this.state.message_db_cursor, 10);
  },
  render: function() {
    return (
      <span>
      <Grid>
        <Col xs={12} md={8}>
          <div className='chat-box-fade-top'>
            <div className='chat-box-fade-bottom'>
              <div id='chat-box'>
                  <div id="load_more_wrapper">
                    <center>
                      <button id="load_more" onClick={this.retrieveOlderMessages}>
                        MORE
                      </button>
                    </center>
                  </div>
              		<MessageList
              			messages={this.state.messages}
              			user={this.state.user}
                    scrollToBottom={this.props.scrollToBottom}
              		/>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
              <MessageForm
                  onMessageSubmit={this.handleMessageSubmit}
                  user={this.state.user}
                  scrollToBottom={this.props.scrollToBottom}
              />
        </Col>
      </Grid>
      </span>
    );
  }
})

function imageURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

module.exports = ChatBox;