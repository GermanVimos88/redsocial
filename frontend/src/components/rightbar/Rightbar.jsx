import "./rightbar.css"
import { Users } from "../../dummyData"
import Online from "../online/Online"
import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export default function Rightbar ({user}) {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?.id)
  );
    
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(`http://127.0.0.1:8800/api/users/friends/${user._id}`);
        setFriends(friendList.data);
      } catch (error) {
        //console.log(error);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`http://127.0.0.1:8800/api/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`http://127.0.0.1:8800/api/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (error) {
    }
  };

  
  const HomeRightbar = () => {        
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={PF+"gift.png"} />
          <span className="birthdayText">
            <b>Ana María Enriquez</b> y <b>1 persona</b> cumplen años hoy
          </span>
        </div>
        <img className="rightbarAd" src={PF+"ad.png"}/>
        <h4 className="rightbarTitle">Amigos en línea</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u}/>
          ))}
        </ul>
      </>
    )
  }

  const ProfileRightbar = () => {    
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <RemoveIcon /> : <AddIcon />}
          </button>
        )}
        <h4 className="rightbarTitle">Información del Usuario</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Ciudad:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Origen:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Situación:</span>
            <span className="rightbarInfoValue">{user.relationship ===1 ? "Soltero" : user.relationship ===1 ? "Casado" : "-"}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">Amigos del usuario</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
              <Link
                to={"http://127.0.0.1:8800/api/posts/profile/" + friend.username}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={
                      friend.profilePicture
                        ? PF + friend.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">{friend.username}</span>
                </div>
              </Link>
            ))}
        </div>
      </>
    )
  }

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar /> }
        
      </div>      
    </div>
  )
}

