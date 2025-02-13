import React, { useRef, useState } from "react";
import { uploadToCloudinary } from "../components/cloudinaryUpload";
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom'; 

function CreateListings() {
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate();
 const [files, setFiles] = useState([]);
 const [formData, setFormData] = useState({
   imageUrls: [],
   name: '',
   description: '',
   address: '',
   type: 'rent',
   bedrooms: 1,
   bathrooms: 1,
   regularPrice: 50,
   discountPrice: 0,
   offer: false,
   parking: false,
   furnished: false,
 });
 console.log(formData);
 const [uploading, setUploading] = useState(false);
 const [error, setError] = useState(false);
 const [loading, setLoading] = useState(false);

 const handleUpload = async () => {
   if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
     setUploading(true);
     const promises = files.map((file) => uploadToCloudinary(file));

     try {
       const urls = await Promise.all(promises);
       setFormData((prevState) => ({
         ...prevState,
         imageUrls: [...prevState.imageUrls, ...urls.filter(url => url != null)],
       }));
       setFiles([]);
     } catch (error) {
       console.error("Upload Error:", error);
     } finally {
       setUploading(false);
     }
   } else {
     alert("You can upload a maximum of 6 images");
   }
 };

 const handleRemoveImage = (index) => {
   setFormData((prevState) => ({
     ...prevState,
     imageUrls: prevState.imageUrls.filter((_, i) => i !== index),
   }));
 };
const handleChange = (e) => {
  if(e.target.id === 'sale' || e.target.id === 'rent') {
    setFormData((prevState) => ({
      ...prevState,
      type: e.target.id,
    }));
  }

  if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.checked,
    }));
  }
  if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

  }

 
}
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true)
    setError(false)
    const res = await fetch('http://localhost:3001/listingData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData, 
        userId: currentUser.id,  // Pass user ID directly
      }),
    });
    const data = await res.json()
    setLoading(false)
    if (data === false) {
      setError(data.message)
    }
     navigate(`/listing/${data.id}`) 

  } catch (error) {
    setError(error.message)
    setLoading(false)
  }
}
 return (
   <main className="listing-container">
     <h1>Create Listing</h1>
     <form onSubmit={handleSubmit} className="listing-form">
       <div className="form-group">
         <label htmlFor="title">Name</label>
         <input 
           type="text" 
           id="name" 
           placeholder="name"
           maxLength="62" 
           minLength="10" 
           required
           onChange={handleChange}
           value={formData.name} 
         />

         <label htmlFor="description">Description</label>
         <textarea 
           id="description" 
           placeholder="Description" 
           required
           onChange={handleChange}
           value={formData.description}
         />

         <label htmlFor="location">Location</label>
         <input 
           type="text" 
           id="location" 
           placeholder="Location" 
           onChange={handleChange}
           value={formData.location}
         />
       </div>

       <div>
         <div>
           <input
           style={{width: "50px"}}
             type='checkbox'
             id='sale'
             onChange={handleChange}
             checked={formData.type === 'sale'}
           />
           <span>Sell</span>
         </div>
         <div>
           <input
           style={{width: "50px"}}
             type='checkbox'
             id='rent'
             onChange={handleChange}
             checked={formData.type === 'rent'}
           />
           <span>Rent</span>
         </div>
         <div>
           <input
           style={{width: "50px"}}
             type='checkbox'
             id='parking'
             onChange={handleChange}
             checked={formData.parking}
           />
           <span>Parking spot</span>
         </div>
         <div>
           <input
           style={{width: "50px"}}
             type='checkbox'
             id='furnished'
             onChange={handleChange}
             checked={formData.furnished}
           />
           <span>Furnished</span>
         </div>
         <div>
           <input
           style={{width: "50px"}}
             type='checkbox'
             id='offer'
             onChange={handleChange}
             checked={formData.offer}
           />
           <span>Offer</span>
         </div>
       </div>
       <div>
         <div>
           <input
             type='number'
             id='bedrooms'
             min='1'
             max='10'
             required
             onChange={handleChange}
             value={formData.bedrooms}
           />
           <p>Beds</p>
         </div>
         <div>
           <input
           style={{width: "50px"}}
             type='number'
             id='bathrooms'
             min='1'
             max='10'
             required
             onChange={handleChange}
             value={formData.bathrooms}
           />
           <p>Baths</p>
         </div>
         <div>
           <input
           style={{width: "50px"}}
             type='number'
             id='regularPrice'
             min='50'
             max='10000000'
             required
             onChange={handleChange}
             value={formData.regularPrice}
           />
           <div>
             <p>Regular price</p>
             {formData.type === 'rent' && (
               <span>($ / month)</span>
             )}
           </div>
         </div>
         {formData.offer && (
           <div>
             <input
             style={{width: "50px"}}
               type='number'
               id='discountPrice'
               min='0'
               max='10000000'
               required
               onChange={handleChange}
               value={formData.discountPrice}
             />
             <div>
               <p>Discounted price</p>
               {formData.type === 'rent' && (
                 <span>($ / month)</span>
               )}
             </div>
           </div>
         )}
       </div>
       <div>
         <p>Images: <span>The first image will be the cover (max 6)</span></p>
         <div>
           <input
             onChange={(e) => setFiles([...e.target.files])}
             type="file"
             id="images"
             accept="image/*"
             multiple
           />
           <button 
             type="button" 
             onClick={handleUpload}
             disabled={uploading || files.length === 0}
           >
             {uploading ? "Uploading..." : "Upload"}
           </button>
         </div>
         {formData.imageUrls.length > 0 && (
           <div>
             {formData.imageUrls.map((url, index) => (
               <div key={url}>
                 <img style={{width: "50%"}}
                   src={url}
                   alt={`Property ${index + 1}`}
                 />
                 <button
                   type="button"
                   onClick={() => handleRemoveImage(index)}
                 >
                   Remove
                 </button>
                 {index === 0 && (
                   <span>
                     Cover Image
                   </span>
                 )}
               </div>
             ))}
           </div>
         )}
       </div>
       <button type="submit">{loading ? 'creating...' : 'create Listing'}</button>
        {error && <p>{error}</p>}
     </form>
   </main>
 );
}

export default CreateListings;