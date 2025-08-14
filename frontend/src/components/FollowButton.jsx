import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { toggleFollow } from '../redux/userSlice'

function FollowButton({ targetUserId, tailwind, onFollowChange }) {
  const { following } = useSelector(state => state.user)
  const isFollowing = following.includes(targetUserId)
  const dispatch = useDispatch()

  const handleFollow = async () => {
    
    dispatch(toggleFollow(targetUserId))
    if (onFollowChange) onFollowChange()

    try {
      await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`, { withCredentials: true })
    } catch (error) {
      console.log(error)
      // Revert on error
      dispatch(toggleFollow(targetUserId))
    }
  }

  return (
    <button className={tailwind} onClick={handleFollow}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  )
}

export default FollowButton
