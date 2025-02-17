import React from 'react'

function SearchPage() {
  return (
    <div>
        <div style={{
            display: 'flex',
            maxWidth: '800px',
            margin: '0 auto',
            
            
        }} >
            <form >
                <div>
                    <label>Search Term :</label>
                    <input type="text" id='searchTerm'
                    placeholder='search...' />
                </div>

                <div>
                    <label>Type</label>
                    <div>
                        <input type="checkbox" name="" id="all" />
                        <span>Rent and sale</span>
                    </div>
                    <div>
                        <input type="checkbox" name="" id="all" />
                        <span>Rent</span>
                    </div>
                    <div>
                        <input type="checkbox" name="" id="all" />
                        <span>Sale</span>
                    </div>
                    <div>
                        <input type="checkbox" name="" id="all" />
                        <span>Offer</span>
                    </div>
                </div>
                <div>
                    <label>Amenities</label>
                    <div>
                        <input type="checkbox" name="" id="all" />
                        <span>Parking</span>
                    </div>
                    <div>
                        <input type="checkbox" name="" id="all" />
                        <span>Furnished</span>
                    </div>
                    
                </div>

                <div>
                    <label>Sort</label>
                    <select name="" id="">
                        <option value="newest">Price high to low</option>
                        <option value="oldest">Low to high</option>
                        <option value="price">Oldest</option>
                    </select>    
                </div>

                <button style={{padding: '10px', color: 'white', background: 'purple'}}>Search </button>
            </form>
        </div>
        <div>
            <h1>Listing Results:</h1>
        </div>
    </div>
  )
}

export default SearchPage