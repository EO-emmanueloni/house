// import React from 'react'

// export default function Contact({ listing }) {
//   return (
//     <div>Contact</div>
//   )
// }




// import React, { useEffect, useRef, useState } from 'react';

// export default function Contact({ listing }) {
//     const [landlord, setLandlord] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);
// console.log(listing?.userRef)
//     useEffect(() => {
//         const fetchLandlord = async () => {
//             try {
//                 setLoading(true);
//                 setError(false);

//                 const res = await fetch(`http://localhost:3001/usersData/${listing.userRef}`);
//                 if (!res.ok) throw new Error('Failed to fetch landlord data');

//                 const data = await res.json();
//                 setLandlord(data);
//             } catch (error) {
//                 setError(true);
//                 console.error('Error fetching landlord:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLandlord();
//     }, [listing.userRef]);

//     if (loading) return <p>Loading landlord details...</p>;
//     if (error) return <p>Error fetching landlord details.</p>;

//     return (
//         <div>
//             {landlord && (
//                 <div>
//                     <h2>Contact {landlord.username}</h2>
//                     <p>Email: {landlord.email}</p>
//                 </div>
//             )}
//         </div>
//     );
// }
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };


  useEffect(() => {
    console.log(listing.id, listing.name);
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`http://localhost:3001/usersData/?id=${listing.id}&verify=true`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.id]);
  return (
    <>
      {landlord && (
        <div >
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
          style={{width: '500px', height: '100px'}}
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
           
          ></textarea>

          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}