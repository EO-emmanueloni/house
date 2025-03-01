import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div
      className="listingItem"
      style={{
        backgroundColor: 'white',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '330px',
        transition: 'box-shadow 0.3s ease-in-out',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 6px 10px rgba(0, 0, 0, 0.15)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)')}
    >
      <Link to={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          className="listingCover"
          style={{
            width: '100%',
            height: '220px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
          }}
          src={listing.imageUrls[0]}
          alt="listing cover"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        <div
          style={{
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#475569',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {listing.name}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MdLocationOn style={{ color: '#047857', width: '16px', height: '16px' }} />
            <p
              style={{
                fontSize: '14px',
                color: '#6B7280',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
              }}
            >
              {listing.location}
            </p>
          </div>

          <p
            style={{
              fontSize: '14px',
              color: '#6B7280',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {listing.description}
          </p>

          <p style={{ color: '#64748B', marginTop: '8px', fontWeight: '600' }}>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>

          <div style={{ color: '#334155', display: 'flex', gap: '16px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}