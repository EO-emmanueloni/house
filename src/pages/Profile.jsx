import { useSelector } from "react-redux"

function Profile() {
  const { currentUser } = useSelector(state => state.user)  
  return (
    <div className='profile-container'>
        <h1>Profile</h1>
        <form>
            <img style={{
              width: '50px',
              borderRadius: '50%'
            }} src={currentUser.photoURL} alt={currentUser.name} />

            <input type="text" placeholder="Username"
            id="username" />
            <input type="text" placeholder="email"
            id="email" />
            <input type="text" placeholder="password"
            id="password" />

            <button style={{
              padding: '10px',
              width: '400px',
              margin: 'auto',
              color: 'white',
              backgroundColor: 'skyblue',
            

            }}>Update</button>



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
          <span> Sign out</span>
        </div>
    </div>
  )
}

export default Profile