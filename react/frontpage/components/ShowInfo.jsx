// ShowInfo.jsx

import React from 'react';

// Common Components
import RectImage from '../../common/RectImage.jsx';

// Bootstrap Components
import { Glyphicon } from 'react-bootstrap';

import { Link } from 'react-router';

// styling
require('./ShowInfo.scss');

var defaultShowPic = "/img/radio.png"

/**
Floating div with image and relevant info for a show

@prop title: (optional) title to show above show
@prop glyph: (optional) glyph to show at left of title
@prop show: show to present
*/
var ShowInfo = React.createClass({
  djString: function(djMap) {
    var djString = "";
    var addComma = false;
    for (var dj in djMap) {
      if (addComma) {
        djString += ", ";
      }
      djString += djMap[dj];
      addComma = true;
    }
    return djString;
  },
  truncateName: function(name, l) {
    return name.length > l ? name.substr(0,l-2) + "\u2026" : name;
  },
  urlFromShow: function(show) {
    return "/beta/show/" + show.id;
  },
  render: function() {
    if (!this.props.show) {
      return <div classname="showInfoEmpty"></div>;
    } else {
      return (
        <div className="showInfo">
          { this.props.title &&
            <p className="infoHeader">
              { this.props.glyph ? <Glyphicon glyph={this.props.glyph}/> : null }
              { this.props.title }
            </p>
          }
          <Link to={this.urlFromShow(this.props.show)} activeClassName="active">
            <div className="showBanner">
              <RectImage
                src={this.props.show.picture || defaultShowPic} />
              <div className="showDetails">
                <p className="showTitle">{this.props.show.title || ""}</p>
                <p className="djs">{this.djString(this.props.show.djs || {})}</p>
              </div>
              
              { /*<span className="genre">{this.truncateName(this.props.show.genre || "", 18)}</span> */ }
            </div>
          </Link>
        </div>
      );
    }
  }
});

module.exports = ShowInfo;
