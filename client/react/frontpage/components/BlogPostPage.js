// BlogPostPage.js
// shows full description of post

import React from 'react';
import Loader from './Loader';
import moment from 'moment';
import './BlogPostPage.scss';

/**
Page content for individual post
Displays full description of a post.. everything
* */

const BlogPostsURL = '/getBlogPosts';

const BlogPostPage = React.createClass({
  getInitialState: function() {
    return { fetching: true, post: null, type: '', date: '' };
  },
  componentDidMount() {
    var queryRoute = `${BlogPostsURL}/${this.props.params.blogPostID}`;
    $.get(queryRoute, post => {
      this.parseTag(post);
      this.parseDate(post);
      this.setState({ fetching: false, post: post });
    });
  },
  parseKeystonePost(post) {
    if (post.img1) {
      post.content = post.content.replace(
        '<p>&lt;img1&gt;</p>',
        `<img alt="Image 1" src=${post.img1.secure_url} />`
      );
    }
    if (post.img2) {
      post.content = post.content.replace(
        '<p>&lt;img2&gt;</p>',
        `<img alt="Image 2" src=${post.img2.secure_url} />`
      );
    }
    if (post.img3) {
      post.content = post.content.replace(
        '<p>&lt;img3&gt;</p>',
        `<img alt="Image 3" src=${post.img3.secure_url} />`
      );
    }
    if (post.img4) {
      post.content = post.content.replace(
        '<p>&lt;img4&gt;</p>',
        `<img alt="Image 4" src=${post.img4.secure_url} />`
      );
    }
    if (post.img5) {
      post.content = post.content.replace(
        '<p>&lt;img5&gt;</p>',
        `<img alt="Image 5" src=${post.img5.secure_url} />`
      );
    }
    return post.content;
  },
  createMarkupForContent() {
    if (this.state.post.content) {
      switch (this.state.post.platform) {
        case 'KEYSTONE':
          return {
            __html: this.parseKeystonePost(this.state.post),
          };
        case 'TUMBLR':
          return {
            __html: this.state.post.content,
          };
      }
    } else {
      return;
    }
  },
  parseTag(post) {
    if (post.tags) {
      const len = post.tags.length;
      this.setState({
        type: this.tagToType(post.tags[len - 1]),
      });
    }
  },
  parseDate(post) {
    const date = new Date(post.date);
    const momentDate = moment(date).format('MM/DD/YYYY');
    this.setState({
      date: momentDate,
    });
  },
  tagToType(tag) {
    switch (tag) {
      case 'ConcertReview':
      case 'ShowReview':
        return 'CONCERT REVIEW';
      case 'ArtistInterview':
        return 'ARTIST INTERVIEW';
      case 'Sports':
        return 'SPORTS';
      case 'FestivalReview':
        return 'FESTIVAL REVIEW';
      case 'Other':
        return 'UCLA RADIO';
    }
  },
  renderPost() {
    const post = this.state.post;
    var subheading;
    if (this.state.type) {
      subheading = this.state.type + ' | ' + this.state.date;
    } else {
      subheading = this.state.date;
    }
    switch (post.platform) {
      case 'KEYSTONE':
        var coverImageDiv;
        if (post.coverImage) {
          coverImageDiv = (
            <div className="coverImageContainer">
              <img
                className="coverImage"
                alt="post image"
                src={post.coverImage.secure_url}
              />
            </div>
          );
        }
        return (
          <div key={post.id} className="blogPostContainer">
            {coverImageDiv}
            <div className="subheading">{subheading}</div>
            <h1>{post.title}</h1>
            <div
              className="content"
              dangerouslySetInnerHTML={this.createMarkupForContent()}
            />
          </div>
        );
      case 'TUMBLR':
        return (
          <div key={post.id} className="blogPostContainer">
            <div className="subheading">{subheading}</div>
            <h1>{post.title}</h1>
            <div
              className="content"
              dangerouslySetInnerHTML={this.createMarkupForContent()}
            />
          </div>
        );
    }
  },
  render() {
    if (!this.state.post) {
      return (
        <div className="blogPostPage">
          {this.state.fetching ? <Loader /> : "This post doesn't exist!"}
        </div>
      );
    }
    return <div className="blogPostPage">{this.renderPost()}</div>;
  },
});

export default BlogPostPage;