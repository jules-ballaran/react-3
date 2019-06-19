import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Header from './Header/Header';
import Compose from './Compose/Compose';
import Posts from './Post/Post'

class App extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
    };

    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.createPost = this.createPost.bind(this);
  }

  componentDidMount() {
    axios
      .get('http://localhost:9090/posts')
      .then(res => {
        this.setState({
          posts: res.data
        })
      })
  }

  updatePost(id, text) {
    axios
      .put(`http://localhost:9090/posts/${id}`, {text})
      .then(res => {
        const updatedPost = res.data;
        const updatedPosts = this.state.posts.map(p => {
          if(p.id === updatedPost.id){
            return {p, ...updatedPost};
          }
          else{
            return p;
          }
        })

        this.setState({
          posts: updatedPosts
        })
      })
  }

  deletePost(id) {
    axios
      .delete(`http://localhost:9090/posts/${id}`)
      .then(res => {
        this.setState({
          posts: this.state.posts.filter(p => p.id !== id)
        })
      })
  }

  createPost(text) {
    axios
      .post(`http://localhost:9090/posts`, {text})
      .then(res => {
        this.setState({
          posts: this.state.posts.concat(res.data)
        })
      })
  }''

  searchPost = (text) => {
    axios
      .get(`http://localhost:9090/posts?q=${encodeURI(text)}`)
      .then(res => {
        this.setState({
          posts: res.data
        })
      })
  }

  render() {
    const { posts } = this.state;

    return (
      <div className="App__parent">
        <Header searchPostFn={this.searchPost}/>

        <section className="App__content">
          <Compose createPostFn={this.createPost}/>
          {posts.map(p => (
            <Posts key={p.id} text={p.text} date={p.date} id={p.id} updatePostFn={this.updatePost} deletePostFn={this.deletePost}/>
          ))}
        </section>
      </div>
    );
  }
}

export default App;
