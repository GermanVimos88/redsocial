import "./post.css";
import { MoreVert } from "@mui/icons-material";
//import { Users } from "../../dummyData";
import { useEffect, useState } from "react";
import axios from "axios";
import {format} from "timeago";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Post ({post}) {
    //console.log(post); //parametro 'post' enviado desde Feed.jsx
    const [like, setLike] = useState(post.likes.length)
    const [isLiked, setIsLiked] = useState(false)
    const [user, setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:currentUser} = useContext(AuthContext)

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id));        
    }, [currentUser._id, post.likes]);
    
    useEffect(()=>{
        //console.log("feed rendered")
        const fetchUser = async () => {
          const res = await axios.get(`http://127.0.0.1:8800/api/users/${post.userId}`);
          console.log(post.userId);
          setUser(res.data);
        };
        fetchUser();
      },[post.userId]);

    const likeHandler = () => {
        try {
            axios.put("http://127.0.0.1:8800/api/posts/" + post._id + "/like", { userId: currentUser._id});
        } catch (error) {}
        setLike(isLiked ? like-1 : like+1)
        setIsLiked(!isLiked)
    }
  return (
    <div className="post">
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`http://127.0.0.1:8800/api/posts/profile/${user.username}`} >
                    <img
                        className="postProfileImg" 
                        src={user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.png"}
                        alt=""
                    />
                    </Link>
                    <span className="postUsername">
                        {user.username}
                    </span>
                    <span className="postDate">{post.createdAt} </span>
                </div>
                <div className="postTopRight">
                    <MoreVert />
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">{post?.desc}</span>
                <img className="postImg" src={PF+post.img} alt=""/>
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt=""/>
                    <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt=""/>
                    <span className="postLikeCounter">{like} personas les gustó</span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">{post.comment}</span>
                </div>
            </div>
        </div>        
    </div>
  )
}

