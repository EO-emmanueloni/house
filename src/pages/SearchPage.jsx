import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function SearchPage() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setSidebardata({
      searchTerm: urlParams.get('searchTerm') || '',
      type: urlParams.get('type') || 'all',
      parking: urlParams.get('parking') === 'true',
      furnished: urlParams.get('furnished') === 'true',
      offer: urlParams.get('offer') === 'true',
      sort: urlParams.get('sort') || 'createdAt',
      order: urlParams.get('order') || 'desc',
    });
    fetchListings();
  }, [location.search]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setShowMore(false);
      
      const jsonServerParams = new URLSearchParams();
      Object.entries(sidebardata).forEach(([key, value]) => {
        if (value !== '' && value !== false && value !== 'all') {
          jsonServerParams.set(key, value);
        }
      });
      
      jsonServerParams.set('_limit', 9);
      const searchQuery = jsonServerParams.toString();
      const res = await fetch(`http://localhost:3001/listingData?${searchQuery}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    setSidebardata((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([key, value]) => {
      urlParams.set(key, value);
    });
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`http://localhost:3001/listingData?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings((prev) => [...prev, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Search Term:</label>
            <input type='text' id='searchTerm' className='border rounded-lg p-3 w-full' 
              value={sidebardata.searchTerm} onChange={handleChange} placeholder='Search...'/>
          </div>
          <div className='flex gap-2 flex-wrap'>
            <label className='font-semibold'>Type:</label>
            {['all', 'rent', 'sale'].map((t) => (
              <div key={t} className='flex gap-2'>
                <input type='checkbox' id='type' className='w-5' value={t} checked={sidebardata.type === t} 
                  onChange={handleChange}/>
                <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
              </div>
            ))}
          </div>
          <div className='flex gap-2 flex-wrap'>
            <label className='font-semibold'>Amenities:</label>
            {['parking', 'furnished'].map((a) => (
              <div key={a} className='flex gap-2'>
                <input type='checkbox' id={a} className='w-5' checked={sidebardata[a]} 
                  onChange={handleChange}/>
                <span>{a.charAt(0).toUpperCase() + a.slice(1)}</span>
              </div>
            ))}
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select id='sort' className='border rounded-lg p-3' value={`${sidebardata.sort}_${sidebardata.order}`} 
              onChange={(e) => {
                const [sort, order] = e.target.value.split('_');
                setSidebardata((prev) => ({ ...prev, sort, order }));
              }}>
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {loading ? <p className='text-xl text-center w-full'>Loading...</p> : 
            (listings.length === 0 ? <p className='text-xl'>No listing found!</p> : 
              listings.map((listing) => <ListingItem key={listing._id} listing={listing} />))}
          {showMore && <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full'>Show more</button>}
        </div>
      </div>
    </div>
  );
}
