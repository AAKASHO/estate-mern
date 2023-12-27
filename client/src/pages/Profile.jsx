import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
// import app from 'firebase';
import {getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef=useRef(null);
  const {currentUser,loading,error}=useSelector((state)=>state.user);
  const [file,setFile]=useState(undefined);
  const [filePerc,setFilePerc]=useState(0);
  const [fileUploadError,setfileUploadError]=useState(false);
  const [formData,setFormData]=useState({});
  const [updateSucess,setUpdateSucess]=useState(false);
  const dispatch=useDispatch();
  // console.log(filePerc);
  // console.log(fileUploadError);
  // // console.log(error);
  // console.log(formData);
  // console.log(currentUser);


  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }

  },[file]);

  const handleFileUpload=(file)=>{
    const storage=getStorage(app);
    const fileName= new Date().getTime()+file.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setFilePerc(Math.round(progress));
      },
      
      (error)=>{
        setfileUploadError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL)=>{
          setFormData({...formData,avatar:downloadURL});
        })
      }
      );
  }

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  };
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData),
      });
      const data=await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data.message));
        return ;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSucess(true);
    }catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }
  const handleDeleteUser=async()=>{
    try{
      dispatch(deleteUserStart());
      const res=await fetch(`api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data=await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }
  const handleSignOut=async()=>{
    try{
      dispatch(signOutUserStart());
      const res=await fetch('api/auth/signout');
      const data=res.json();
      if(data.success===false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    }catch(error){

    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4' action="">
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image' />
        <img src={formData.avatar||currentUser.avatar} alt="profile_pic" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'onClick={()=>fileRef.current.click()}/>
        <p className='text-sm self-center'>
          {fileUploadError? (<span className='text-red-700'>Error image upload (Image must be less than 2 MB) </span>
          ):filePerc>0&&filePerc<100?(<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>)
          :filePerc===100?(
            <span className='text-green-700'>Image successfully uploaded</span>
          ):('')
           }
        </p>
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' defaultValue={currentUser.username}  onChange={handleChange}/>
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange}/>
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg'  onChange={handleChange}/>
      <button disabled={loading}
       className='bg-slate-700 border p-3 rounded-lg text-white'>{loading?'loading...':'update'}</button>
       <Link className='bg-green-700 text-white p-3
       rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error?error:""}</p>
      <p className='text-green-700 mt-5'>{updateSucess?"user is updated successfully!":""}</p>
    </div>
  )
}
