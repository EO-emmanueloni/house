import React, { useState } from "react";
import { uploadToCloudinary } from "../components/cloudinaryUpload";

function CreateListings() {
 const [files, setFiles] = useState([]);
 const [formData, setFormData] = useState({
   imageUrls: [],
 });
 const [uploading, setUploading] = useState(false);

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
       setFiles([]); // Clear the file input
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

 return (
   <main className="listing-container">
     <h1>Create Listing</h1>
     <form className="listing-form">
       <div className="form-group">
         <label htmlFor="title">Title</label>
         <input 
           type="text" 
           id="title" 
           placeholder="Property name"
           maxLength="62" 
           minLength="10" 
           required 
         />

         <label htmlFor="description">Description</label>
         <textarea 
           id="description" 
           placeholder="Description" 
           required
         />

         <label htmlFor="location">Location</label>
         <input 
           type="text" 
           id="location" 
           placeholder="Location" 
         />
       </div>

       <div className="images-section">
         <p>Images: <span>The first image will be the cover (max 6)</span></p>
         
         <div className="upload-controls">
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
           <div className="images-grid">
             {formData.imageUrls.map((url, index) => (
               <div key={url} className="image-container">
                 <img style={{width: "50%"}}
                   src={url}
                   alt={`Property ${index + 1}`}
                 />
                 <button
                   type="button"
                   onClick={() => handleRemoveImage(index)}
                   className="remove-btn"
                 >
                   Remove
                 </button>
                 {index === 0 && (
                   <span className="cover-badge">
                     Cover Image
                   </span>
                 )}
               </div>
             ))}
           </div>
         )}
       </div>

       <button type="submit">Create Listing</button>
     </form>
   </main>
 );
}

export default CreateListings;