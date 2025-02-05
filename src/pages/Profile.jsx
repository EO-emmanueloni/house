import { useSelector } from "react-redux";
import { useRef } from "react";

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);

  return (
    <div className='profile-container'>
      <h1>Profile</h1>
      <form>
        {/* Hidden file input */}
        <input style={{
          display: 'none'
        }} type="file" ref={fileRef} hidden accept="image/*" />
        
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
