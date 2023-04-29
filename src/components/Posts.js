import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addPost, deletePost, updatePost } from '../redux/postsSlice';
import userAvatar from "../assets/user.png"

export default function Posts() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const [date, setDate] = useState("")

  const [avatarUrl, setAvatarUrl] = useState("");

  const [updatedTitle, setUpdatedTitle] = useState("")
  const [updatedDescription, setUpdatedDescription] = useState("")

  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState(null)

  const [errorMessage, setErrorMessage] = useState("");

  const posts = useSelector((state) => state.posts.items)

  const dispatch = useDispatch()

  return (
    <div>
        <div className="forForm">
            <div className="form">
                <input 
                    type="text" 
                    value={title}
                    placeholder='Enter Post Title' 
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea 
                    rows={5}
                    cols={50}
                    value={description}
                    placeholder='Enter Post Description' 
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="forAvatar">Choose Avatar</label>
                <input
                    type="file"
                    name='forAvatar'
                    // accept="image/*"
                    onChange={(e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        setAvatarUrl(reader.result);
                    };
                    }}
                />
                <button onClick={() => {
                    if (title.trim() === '' || description.trim() === '') {
                        setErrorMessage('Enter Post Title and Description');
                        return;
                    }
                    const now = new Date();
                    dispatch(addPost({id: posts.length + 1, title, description, avatarUrl, date: now.toLocaleString()}))
                    setTitle("");
                    setDescription("")
                    setDate(new Date().toLocaleString())
                    setAvatarUrl("");
                    setErrorMessage("");
                }}>Add Post</button>
                {errorMessage && <h4>{errorMessage}</h4>}
            </div>
        </div>
        <div className="posts">
            {posts.length > 0 ? posts.map(post => 
                <div key={post.id} className="post">
                    <img src={post.avatarUrl || userAvatar} alt="User Avatar" />
                    <div className="info">
                        <span>{post.date}</span>
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                        <div className="post-buttons">
                            <button onClick={() => {
                                setIsEdit(true)
                                setId(post.id)
                            }}>Edit</button>
                            <button onClick={() => dispatch(deletePost({id: post.id}))}>Delete</button>
                        </div>
                        {isEdit && id === post.id && (
                            <>
                                <h3>Edit Title</h3>
                                <input 
                                    type="text" 
                                    value={updatedTitle || post.title}  
                                    onChange={(e) => setUpdatedTitle(e.target.value)}
                                />
                                <h3>Edit Description</h3>
                                <textarea 
                                    rows={5} 
                                    cols={50} 
                                    value={updatedDescription || post.description}  
                                    onChange={(e) => setUpdatedDescription(e.target.value)}
                                />
                                <button onClick={() => {
                                    dispatch(updatePost({id: post.id, title: updatedTitle === "" ? post.title : updatedTitle, description: updatedDescription === "" ? post.description : updatedDescription}))
                                    setIsEdit(false)
                                }}>Update</button>
                            </>
                        )}
                    </div>
                </div>): <p className='noPost'>{`No posts :(`}</p>}
        </div>
    </div>
  )
}