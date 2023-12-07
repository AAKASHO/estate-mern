import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux';
import { useRef } from 'react';
// import app from 'firebase';
import {getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
export default function Profile() {
  const fileRef=useRef(null);
  const {currentUser}=useSelector((state)=>state.user);
  const [file,setFile]=useState(undefined);
  const [filePerc,setFilePerc]=useState(0);
  const [fileUploadError,setfileUploadError]=useState(false);
  const [formData,setFormData]=useState({});
  console.log(filePerc);
  console.log(fileUploadError);
  // console.log(error);
  console.log(formData);


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
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-4' action="">
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
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' />
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' />
        <input type="text" placeholder='password' id='password' className='border p-3 rounded-lg' />
      <button className='bg-slate-700 border p-3 rounded-lg text-white'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>

    </div>
  )
}
