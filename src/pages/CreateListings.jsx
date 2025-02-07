import React from "react";

function CreateListings() {
  return (
    <main className="listing-container">
      <h1>Create Listing</h1>
      <form className="listing-form">
        <div className="form-group">
          <label htmlFor="name">Title</label>
          <input
            type="text"
            id="title"
            placeholder="name"
            maxLength="62"
            minLength="10"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            required
          ></textarea>

          <label htmlFor="location">Location</label>
          <input type="text" id="location" placeholder="Location" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <input
                type="checkbox"
                name=""
                id="sale"
                className="checkbox"
                style={{ width: "20px" }}
              />
              <span>sell</span>
            </div>
            <div>
              <input
                type="checkbox"
                name=""
                id="rent"
                className="checkbox"
                style={{ width: "20px" }}
              />
              <span>Rent</span>
            </div>
            <div>
              <input
                type="checkbox"
                name=""
                id="Parking spot"
                className="checkbox"
                style={{ width: "20px" }}
              />
              <span>parking spot</span>
            </div>
            <div>
              <input
                type="checkbox"
                name=""
                id="Furnished"
                className="Furnished"
                style={{ width: "20px" }}
              />
              <span>sell</span>
            </div>
            <div>
              <input
                type="checkbox"
                name=""
                id="Offer"
                className="checkbox"
                style={{ width: "20px" }}
              />
              <span>Offer</span>
            </div>

            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>  
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  style={{
                    padding: "10px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                    width: "50px",
                  }}
                  type="number"
                  id="bedrooms"
                  required
                  min="1"
                />
                <p>Beds</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  style={{
                    padding: "10px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                    width: "50px",
                  }}
                  type="number"
                  id="bathrooms"
                  required
                  min="1"
                />
                <p>Bath</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  style={{
                    padding: "10px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                    width: "50px",
                  }}
                  type="number"
                  id="regular-price"
                  required
                  min="1"
                />
                <div>
                  <p>Regular Price</p>
                  <span>($/ month)</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  style={{
                    padding: "10px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                    width: "50px",
                  }}
                  type="number"
                  id="discount-price"
                  required
                  min="1"
                />

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <p>Discount Price</p>
                  <span>($/ year)</span>
                </div>
              </div>
            </div>

          
        </div>
        <div style={{display: 'flex', flexDirection: 'column', flex: '1'}} >
          <p>Images: 
            <span>The first image will be the cover(max 6)</span>
          </p>
          <div style={{display: 'flex', gap: '10px'}}>
            <input type="file" name="file-upload" id="images" accepts='images/*' multiple />
            <button style={{color: 'green', padding: '7px'}}>Upload</button>
          </div>
         
        </div>
        <button>Create Listing</button>
      </form>
    </main>
  );
}

export default CreateListings;
