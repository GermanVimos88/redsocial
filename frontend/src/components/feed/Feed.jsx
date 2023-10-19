import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";



export default function Feed ({ username }) {
  const [posts,setPosts] = useState([]);
  const {user} = useContext(AuthContext);

  useEffect(()=>{
    //console.log("feed rendered")
    const fetchPosts = async () => {
      /* const res = username//await axios.get("http://localhost:8800/api/posts/profile/:" + username)//username
      ? await axios.get("http://localhost:8800/api/posts/profile/:" + username,  {
        headers: {'Content-Type': 'application/json'}
      }).then(function(response) {
        console.log(response);
        setPosts(response.data);
      }).catch(function(error) {
        console.log(error);
      })
      : await axios.get("http://localhost:8800/api/posts/profile/timeline/:" + user._id,  {
        headers: {'Content-Type': 'application/json'}
      }).then(function(response) {
        console.log(response);
        setPosts(response.data);
      }).catch(function(error) {
        console.log(error);
      });
      //setPosts(res.data); // revisar esta linea */

      //await axios.get(`http://localhost:8800/api/posts/profile/:${user.username}`)
      //const res = await axios.get('http://127.0.0.1:8800/api/posts/timeline/:'+user._id);
      const res = username
        ? await axios.get(`http://127.0.0.1:8800/api/posts/profile/${user.username}`)
        : await axios.get(`http://127.0.0.1:8800/api/posts/timeline/${user._id}`);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );



    
    };
    fetchPosts();
  },[username, user._id]);

  return (
    <div className="feed">    
        <div className="feedWrapper">
            {(!username || username === user.username) && <Share />}
            {posts.map((p) => (
              <Post key={p._id} post={p}/>            
            ))}                        
        </div>        
    </div>
  )
}