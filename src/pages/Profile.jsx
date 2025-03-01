import { useSelector, useDispatch } from "react-redux";
import { app } from "../firebase";
import { signOut, getAuth } from "firebase/auth";
import { useRef, useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { 
  updateUserStart, updateUserSuccess, updateUserFailure, 
  deleteUserFailure, deleteUserStart, deleteUserSuccess, 
  SignOutUserStart, SignOutUserFailure, SignOutUserSuccess 
} from '../redux/user/userSlice';
import { Link } from "react-router-dom";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
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
        console.log('File available at', downloadURL);
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
      const data = await res.json();
      if (!res.ok) {
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
        const data = await res.json();
        console.log(data.message || 'Failed to delete listing');
        return;
      }
  
      setUserListings((prevListings) => prevListings.filter((listing) => listing.id !== listingId));
  
      console.log(`Listing ${listingId} deleted successfully.`);
    } catch (error) {
      console.log("Error deleting listing:", error.message);
    }
  };
  
  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="file" 
          ref={fileRef} 
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])} 
        />
        
        <img 
          onClick={() => fileRef.current.click()} 
          style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer', alignSelf: "center" }} 
          src={currentUser.photoURL || "/default-avatar.png"} 
          alt={currentUser.name || "User"} 
          className="rounded-full h-24 w-24 object-cover cursor-pointer"
        />

        <input type="text" placeholder="Username" id="username" onChange={handleChange} />
        <input type="email" placeholder="Email" id="email" onChange={handleChange} />
        <input type="password" placeholder="Password" id="password" onChange={handleChange} />

        <Link style={{ padding: '10px', width: '100%', color: 'white', backgroundColor: 'skyblue', border: "none", cursor: "pointer" }}>
          Update
        </Link>

        {/* Create Listing Button */}
        <Link 
          to={'/create-listing'}
          style={{ padding: '10px', width: '100%', color: 'white', backgroundColor: 'green', textAlign: 'center', textDecoration: 'none', display: 'block', cursor: "pointer" }} 
        >
          Create Listing
        </Link>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: 'red', cursor: 'pointer' }}>
        <span onClick={handleDelete}>Delete Account</span>
        <span onClick={handleSignOut}>Sign out</span>
      </div>
      
      <button onClick={handleShowListings} style={{ padding: '10px', width: '100%', color: 'white', backgroundColor: 'blue', marginTop: "10px", cursor: "pointer" }}>
        Show Listings
      </button>

      <p>{showListingsError ? "Error showing listings" : ''}</p>

      {userListings.length > 0 && (
        <div>
          <h2>Your Listings</h2>
          {userListings.map((listing) => (
            <div key={listing.id} style={{ display: 'flex', alignItems: "center", marginBottom: "10px", padding: "10px", border: "1px solid black" }}>
              <Link to={`/listing/${listing.id}`}>
                <img style={{ width: '100px', marginRight: "10px" }} src={listing.imageUrls[0]} alt={listing.name} />
              </Link>  
              <Link to={`/listing/${listing.id}`} style={{ flexGrow: 1, textDecoration: "none", color: "black" }}>
                <p>{listing.name}</p>
              </Link>
              <div>
                <button className="flex flex-col items-center" onClick={() => handleDeleteListing(listing.id)} >Delete</button>

                <Link   to={`/update-listing/${listing.id}`} >
                  <button className="text-green-700 uppercase" >Edit</button>
                </Link>

              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
