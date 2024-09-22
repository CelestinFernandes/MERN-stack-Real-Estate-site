import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');

  const [wishlistStatus, setWishlistStatus] = useState({}); // To track wishlist status for each listing

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const offerRes = await fetch('/api/listing/get?offer=true&limit=4');
        const offerData = await offerRes.json();
        setOfferListings(offerData);

        const rentRes = await fetch('/api/listing/get?type=rent&limit=4');
        const rentData = await rentRes.json();
        setRentListings(rentData);

        const saleRes = await fetch('/api/listing/get?type=sale&limit=4');
        const saleData = await saleRes.json();
        setSaleListings(saleData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchListings();

    // Initialize wishlist status from local storage
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const initialWishlistStatus = {};
    storedWishlist.forEach(item => {
      initialWishlistStatus[item._id] = true;
    });
    setWishlistStatus(initialWishlistStatus);

    return () => {
      setOfferListings([]);
      setRentListings([]);
      setSaleListings([]);
    };

  }, []);

  const toggleWishlist = (listing) => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const exists = storedWishlist.find(item => item._id === listing._id);

    if (exists) {
      // Remove from wishlist
      const updatedWishlist = storedWishlist.filter(item => item._id !== listing._id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlistStatus(prev => ({ ...prev, [listing._id]: false })); // Update the status
    } else {
      // Add to wishlist
      storedWishlist.push(listing);
      localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
      setWishlistStatus(prev => ({ ...prev, [listing._id]: true })); // Update the status
    }
  };

  const calculateMortgage = (e) => {
    e.preventDefault();
    const principal = parseFloat(loanAmount);
    const calculatedInterest = parseFloat(interestRate) / 100 / 12;
    const calculatedPayments = parseFloat(loanTerm) * 12;

    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);
    
    setMonthlyPayment(monthly ? monthly.toFixed(2) : 0);
  };

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Celestial Estates is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>
      
      {/* swiper */}
      <Swiper navigation>
        {offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div
              style={{
                background: `url(${listing.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='h-[500px]'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* listing results for offer, sale, and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <div key={listing._id} className="relative">
                  <ListingItem listing={listing} />
                  <button 
                    onClick={() => toggleWishlist(listing)} 
                    className={`absolute top-0 right-0 p-1 rounded ${wishlistStatus[listing._id] ? 'bg-green-600' : 'bg-blue-600'} text-white`}
                  >
                    {wishlistStatus[listing._id] ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <div key={listing._id} className="relative">
                  <ListingItem listing={listing} />
                  <button 
                    onClick={() => toggleWishlist(listing)} 
                    className={`absolute top-0 right-0 p-1 rounded ${wishlistStatus[listing._id] ? 'bg-green-600' : 'bg-blue-600'} text-white`}
                  >
                    {wishlistStatus[listing._id] ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <div key={listing._id} className="relative">
                  <ListingItem listing={listing} />
                  <button 
                    onClick={() => toggleWishlist(listing)} 
                    className={`absolute top-0 right-0 p-1 rounded ${wishlistStatus[listing._id] ? 'bg-green-600' : 'bg-blue-600'} text-white`}
                  >
                    {wishlistStatus[listing._id] ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Mortgage Calculator */}
      <div className="bg-gray-100 py-10">
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mortgage Calculator</h2>
          <form onSubmit={calculateMortgage}>
            <div className="mb-4">
              <label className="block text-gray-700">Loan Amount (₹)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Loan Term (years)</label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
                min="1"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Calculate
            </button>
          </form>
          {monthlyPayment && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Monthly Payment: ₹{monthlyPayment}</h3>
            </div>
          )}
        </div>
      </div>

      {/* Extra Padding Below */}
      <div className="py-10"></div>
    </div>
  );
}
