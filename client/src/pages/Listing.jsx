import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${params.listingId}`)) || [];
    setReviews(storedReviews);
  }, [params.listingId]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.trim() && rating > 0) {
      const updatedReviews = [
        ...reviews,
        {
          user: currentUser.name,
          text: newReview,
          rating,
          profilePic: currentUser.profilePic || 'https://freesvg.org/img/abstract-user-flat-4.png', // Use a default pic if none
        },
      ];
      setReviews(updatedReviews);
      localStorage.setItem(`reviews_${params.listingId}`, JSON.stringify(updatedReviews));
      setNewReview('');
      setRating(0); // Reset rating
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen py-5">
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl text-red-500'>Something went wrong!</p>}
      {listing && !loading && !error && (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='p-5'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-gray-800'>{listing.name}</h2>
              <div className='flex items-center'>
                <FaShare
                  className='text-gray-500 cursor-pointer'
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                />
                {copied && <p className='ml-2 text-green-600'>Link copied!</p>}
              </div>
            </div>
            <p className='text-xl font-semibold mt-2'>
              Rs. {listing.offer ? listing.discountPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-3 gap-2 text-gray-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4 mt-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  Rs. {+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-gray-800 mt-4'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 mt-4'>
              <li className='flex items-center gap-1'>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              </li>
              <li className='flex items-center gap-1'>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              </li>
              <li className='flex items-center gap-1'>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1'>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-4'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}

            {/* Reviews Section */}
            <div className='mt-6'>
              <h3 className='text-xl font-semibold'>Reviews</h3>
              <form onSubmit={handleReviewSubmit} className='flex gap-2 my-4'>
                <div className='flex items-center'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`cursor-pointer text-${rating >= star ? 'gold-500' : 'gray-400'}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <input
                  type='text'
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder='Write your review...'
                  className='flex-1 p-2 border rounded'
                  required
                />
                <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
                  Submit
                </button>
              </form>
              <div className='border-t mt-4 pt-2'>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => {
                    // Validate that review.rating is a number and within 1-5
                    const validRating = Math.max(1, Math.min(5, Number(review.rating) || 0)); // Fallback to 0 if invalid
                    return (
                      <div key={index} className='flex items-start my-2 p-2 bg-gray-50 rounded-md shadow-sm'>
                        <img
                          src={review.profilePic || 'https://freesvg.org/img/abstract-user-flat-4.png'} // Fallback image if not provided
                          alt={`${review.user}'s profile`}
                          className='w-10 h-10 rounded-full mr-3'
                        />
                        <div>
                          <strong className='text-gray-800'>{review.user || 'Anonymous'}</strong>
                          <div className='flex'>
                            {[...Array(validRating)].map((_, i) => (
                              <span key={i} className='text-yellow-500'>★</span>
                            ))}
                            {[...Array(5 - validRating)].map((_, i) => (
                              <span key={i} className='text-gray-400'>★</span>
                            ))}
                          </div>
                          <p className='text-gray-600'>{review.text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
