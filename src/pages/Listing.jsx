import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaParking,
  FaChair,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  loadingError: {
    padding: "16px",
    margin: "10px 0",
  },
  errorText: {
    color: "#dc2626",
  },
  imageSlide: {
    height: "300px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "16px 0",
  },
  badge: {
    display: "inline-block",
    padding: "8px 16px",
    color: "white",
    borderRadius: "4px",
    marginRight: "8px",
  },
  priceBadge: {
    backgroundColor: "#dc2626",
  },
  discountBadge: {
    backgroundColor: "#16a34a",
  },
  description: {
    margin: "16px 0",
    lineHeight: "1.5",
  },
  featuresList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    margin: "16px 0",
    padding: 0,
    listStyle: "none",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  icon: {
    color: "#16a34a",
    fontSize: "1.25rem",
  },
  contactButton: {
    padding: "8px 16px",
    backgroundColor: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};

export default function Listing() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(
          `http://localhost:3001/listingData/${params.listingId}`
        );

        if (!res.ok) throw new Error("Failed to fetch listing");

        const data = await res.json();
        setListing(data);
      } catch (error) {
        setError(true);
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  if (loading)
    return (
      <div role="alert" style={styles.loadingError}>
        Loading...
      </div>
    );
  if (error)
    return (
      <div role="alert" style={{ ...styles.loadingError, ...styles.errorText }}>
        Something went wrong. Please try again.
      </div>
    );
  if (!listing)
    return (
      <div role="alert" style={styles.loadingError}>
        No listing found.
      </div>
    );

  const discountAmount =
    listing.regularPrice && listing.discountPrice
      ? +listing.regularPrice - +listing.discountPrice
      : 0;

  return (
    <main style={styles.container}>
      {/* Image Slider */}
      <Swiper modules={[Navigation]} navigation>
        {(listing.imageUrls || []).map((url, index) => (
          <SwiperSlide key={`${url}-${index}`}>
            <div
              style={{
                ...styles.imageSlide,
                backgroundImage: `url(${url})`,
              }}
              role="img"
              aria-label={`Property image ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Location */}
      {listing.location && (
        <div style={styles.location}>
          <FaMapMarkerAlt style={styles.icon} aria-hidden="true" />
          <span>{listing.location}</span>
        </div>
      )}

      {/* Price Information */}
      <div>
        <span style={{ ...styles.badge, ...styles.priceBadge }}>
          {listing.type === "rent" ? "For Rent" : "For Sale"} - $
          {listing.price?.toLocaleString() ?? "Price not specified"}
        </span>

        {listing.offer && discountAmount > 0 && (
          <span style={{ ...styles.badge, ...styles.discountBadge }}>
            ${discountAmount.toLocaleString()} Discount
          </span>
        )}
      </div>

      {/* Description */}
      {listing.description && (
        <p style={styles.description}>{listing.description}</p>
      )}

      {/* Property Features */}
      <ul style={styles.featuresList}>
        {listing.bedrooms !== undefined && (
          <li style={styles.featureItem}>
            <FaBed style={styles.icon} aria-hidden="true" />
            <span>
              {listing.bedrooms}{" "}
              {listing.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
            </span>
          </li>
        )}

        {listing.bathrooms !== undefined && (
          <li style={styles.featureItem}>
            <FaBath style={styles.icon} aria-hidden="true" />
            <span>
              {listing.bathrooms}{" "}
              {listing.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
            </span>
          </li>
        )}

        <li style={styles.featureItem}>
          <FaParking style={styles.icon} aria-hidden="true" />
          <span>{listing.parking ? "Parking Available" : "No Parking"}</span>
        </li>

        <li style={styles.featureItem}>
          <FaChair style={styles.icon} aria-hidden="true" />
          <span>{listing.furniture ? "Furnished" : "Not Furnished"}</span>
        </li>
      </ul>

      {/* Contact Button */}
      {currentUser && listing.userRef !== currentUser.id && !contact && (
        <button
          onClick={() => setContact(true)}
          style={styles.contactButton}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#7e22ce")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#9333ea")}
          aria-label="Contact property owner"
        >
          Contact Landlord
        </button>
      )}

      {contact && <Contact listing={listing} />}
    </main>
  );
}