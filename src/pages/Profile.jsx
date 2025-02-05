import { useSelector } from "react-redux";
import { app } from "../firebase";
import { useRef, useState,useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  console.log(file)
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name;  
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        console.log('Error uploading file:', error);
      }, 
      () => {
        console.log('File uploaded successfully');
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, photoURL: downloadURL });
          console.log('File available at', downloadURL);
        });
      }
    );
  }

  return (
    <div className='profile-container'>
      <h1>Profile</h1>
      <form>
        {/* Hidden file input */}
        <input style={{
          display: 'none'
        }} type="file" ref={fileRef} hidden accept="image/*"
        onChange={(e) =>setFile(e.target.files[0])} />
        
        {/* Clickable image to trigger file input */}
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

        <input type="text" placeholder="Username" id="username" />
        <input type="text" placeholder="Email" id="email" />
        <input type="password" placeholder="Password" id="password" />

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
        <span>Delete Account</span>
        <span>Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
