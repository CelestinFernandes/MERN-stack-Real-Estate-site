import React from 'react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  // Retrieve wishlist items from local storage
  const [wishlistItems, setWishlistItems] = React.useState(
    JSON.parse(localStorage.getItem('wishlist')) || []
  );

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlistItems.filter(item => item._id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] relative'
            >
              <Link to={`/listing/${item._id}`}>
                <img
                  src={
                    item.imageUrls[0] ||
                    'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
                  }
                  alt='listing cover'
                  className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                />
                <div className='p-3 flex flex-col gap-2 w-full'>
                  <p className='truncate text-lg font-semibold text-slate-700'>
                    {item.name}
                  </p>
                  <p className='text-sm text-gray-600 truncate w-full'>
                    {item.address}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Price: ₹{item.price}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Description: {item.description}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Location: {item.location}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Type: {item.type} {/* Assuming there's a type field */}
                  </p>
                </div>
              </Link>
              <button 
                className="bg-red-500 text-white py-1 px-2 rounded-md absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from triggering the Link
                  removeFromWishlist(item._id);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
