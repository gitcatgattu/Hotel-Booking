import React, { useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const {axios,getToken,user}=useAppContext()

  const [bookings, setBookings] = React.useState([])
  
  const fetchUserBookings=async()=>{
    try{
      const {data}=await axios.get('/api/bookings.user',{headers:{Authorization:`Bearer ${await getToken()}`}})
      if (data.success){
        setBookings(data.bookings)
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }
useEffect(()=>{
  if(user){
    fetchUserBookings()

  }
  else{
    toast.error("login first")
  }
},[user])

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-5 md:px-16 lg:px-20 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your bookings in one place.Plan your trips seamlessly with just a few clicks"
        align={`left`}
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div
          className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b

border-gray-300 font-medium text-base py-3"
        >
          <div className="w-1/3">Hotels</div>

          <div className="w-1/3">Date & Timings</div>

          <div className="w-1/3">Payment</div>
        </div>

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-6 first:border-t"
          >
            {/* Hotel Details --- - */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <img
                src={booking.room.images[0]}
                alt="hotelimg"
                className="min-md:w-44 rounded shadow object-cover"
              />
              <div>
                <p className="text-2xl font-playfair">
                  {booking.hotel.name}
                  <span className="text-sm font-inter">
                    {" "}
                    ({booking.room.roomType})
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <img src={assets.locationIcon} alt="hotelimg" />
                  <span>{booking.hotel.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <img src={assets.guestsIcon} alt="hotelimg" />
                  <span>Guests: {booking.guests}</span>
                </div>
                <p className="text-base mt-2">Total: ${booking.totalPrice}</p>
              </div>
            </div>
            {/* ------ Date & Timeings ---- */}

            <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
              <div>
                <p>Check-In:</p>

                <p className='className="text-gray-500 text-sm"'>
                  {new Date(booking.checkInDate).toDateString()}
                </p>
              </div>

              <div>
                <p>Check-Out:</p>

                <p className='className="text-gray-500 text-sm"'>
                  {new Date(booking.checkOutDate).toDateString()}
                </p>
              </div>
            </div>

            {/* ------Ipayent Status */}
            <div className="flex flex-col items-start justify-center pt-3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    booking.isPaid ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>

                <p
                  className={`text-sm ${
                    booking.isPaid ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {booking.isPaid ? "Paid" : "Unpaid"}
                </p>
              </div>

              {!booking.isPaid && (
                <button
                  className="px-4 py-1.5 mt-4 text-xs border border-gray-400

rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
