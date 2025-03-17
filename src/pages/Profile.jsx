import { useSelector, useDispatch } from "react-redux";
import { app } from "../firebase";
import { signOut, getAuth } from "firebase/auth";
import { useRef, useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { 
  updateUserStart, updateUserSuccess, updateUserFailure, 
  deleteUserFailure, deleteUserStart, deleteUserSuccess, 
  signOutUserStart, signOutUserFailure, signOutUserSuccess 
} from '../redux/user/userSlice';
import { Link } from "react-router-dom";
import ProfileAvatar from "../components/ProfileAvatar";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    photoURL: currentUser?.photoURL || "",
  });
  const dispatch = useDispatch(); 
  const [showListingsError, setShowListingsError] = useState(false); 
  const [userListings, setUserListings] = useState([]);

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
        setFormData(prevData => ({ ...prevData, photoURL: downloadURL }));
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      if (!res.ok) {
        dispatch(deleteUserFailure("Failed to delete user"));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth(app);
    try {
      dispatch(signOutUserStart());
      await signOut(auth);
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`http://localhost:3001/listingData?userId=${currentUser.id}`);
      const data = await res.json();
      if (!res.ok) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`http://localhost:3001/listingData/${listingId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.log('Failed to delete listing');
        return;
      }

      setUserListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.log("Error deleting listing:", error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="file" 
          ref={fileRef} 
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])} 
        />

        <div className="flex justify-center">
          {formData.photoURL ? (
            <img 
              onClick={() => fileRef.current.click()} 
              src={formData.photoURL} 
              alt="Profile" 
              className="rounded-full h-24 w-24 object-cover cursor-pointer"
            />
          ) : (
            <ProfileAvatar 
              username={currentUser.username}  
              photoURL={currentUser.photoURL} 
              size="50px"
/>
          )}
        </div>

        <input type="text" placeholder="Username" id="username" value={formData.username} onChange={handleChange} />
        <input type="email" placeholder="Email" id="email" value={formData.email} onChange={handleChange} />
        <input type="password" placeholder="Password" id="password" onChange={handleChange} />

        <button type="submit" className="bg-blue-500 text-white py-2 rounded-md">Update</button>

        <Link to={'/create-listing'} className="bg-green-500 text-white py-2 text-center rounded-md block">
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-4 text-red-500 cursor-pointer">
        <span onClick={handleDelete}>Delete Account</span>
        <span onClick={handleSignOut}>Sign out</span>
      </div>
      
      <button onClick={handleShowListings} className="bg-blue-700 text-white py-2 mt-4 rounded-md w-full">
        Show Listings
      </button>

      {showListingsError && <p className="text-red-500 mt-2">Error showing listings</p>}

      {userListings.length > 0 && (
        <div className="mt-4">
          <h2>Your Listings</h2>
          {userListings.map((listing) => (
            <div key={listing.id} className="flex items-center border p-4 mb-4">
              <Link to={`/listing/${listing.id}`}>
                <img className="w-24 h-24 mr-4" src={listing.imageUrls[0]} alt={listing.name} />
              </Link>  
              <Link to={`/listing/${listing.id}`} className="flex-grow">
                <p>{listing.name}</p>
              </Link>
              <button className="text-red-500 ml-2" onClick={() => handleDeleteListing(listing.id)}>Delete</button>
              <Link to={`/update-listing/${listing.id}`} className="text-green-500 ml-2">Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
