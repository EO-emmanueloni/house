import { useSelector } from "react-redux";
import { app } from "../firebase";
import { signOut, getAuth } from "firebase/auth";
import { useRef, useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, SignOutUserStart, SignOutUserFailure, SignOutUserSuccess, } from '../redux/user/userSlice';
import { useDispatch } from "react-redux";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch(); 

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Error uploading file:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prevData => ({
          ...prevData,
          photoURL: downloadURL // Update formData state
        }));
        console.log('File available at', downloadURL);
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser?.id) {
      dispatch(updateUserFailure("User ID is missing"));
      return;
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:3001/usersData/${currentUser.id}`, {
        method: 'PUT',  // Use PUT instead of PATCH
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message || "Failed to update user"));
        return;
      }

      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
        dispatch(deleteUserStart());
        const res = await fetch(`http://localhost:3001/usersData/${currentUser.id}`, {
            method: 'DELETE',
        });

        const data = await res.json();
        if(data.success === false) {
            dispatch(deleteUserFailure(data.message || 'Failed to delete user'));
            return;
        }
        dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
  }

  };
  const handleSignOut = async () => {
    const auth = getAuth(app);
    

    try {
      dispatch(SignOutUserStart());
      await signOut(auth);
      dispatch(SignOutUserSuccess());
    } catch (error) {
      dispatch(SignOutUserFailure(error.message));
    }

  };

  return (
    <div className='profile-container'>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          ref={fileRef} 
          hidden 
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])} 
        />
        
        <img 
          onClick={() => fileRef.current.click()} 
          style={{
            width: '50px',
            borderRadius: '50%',
            cursor: 'pointer'
          }} 
          src={currentUser.photoURL} 
          alt={currentUser.name} 
        />

        <input type="text" placeholder="Username" id="username" onChange={handleChange} />
        <input type="text" placeholder="Email" id="email" onChange={handleChange} />
        <input type="password" placeholder="Password" id="password" onChange={handleChange} />

        <button style={{
          padding: '10px',
          width: '400px',
          margin: 'auto',
          color: 'white',
          backgroundColor: 'skyblue',
        }}>
          Update
        </button>
      </form>

      <div style={{
        display: 'flex',
        gap: '20px',
        margin: '10px auto',
        justifyContent: 'space-around',
        cursor: 'pointer',
        color: 'red'
      }}>
        <span onClick={handleDelete}>Delete Account</span>
        <span onClick={handleSignOut} >Sign out</span>
      </div>
    </div>
  );

}

export default Profile;
