import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  assets,
  facilityIcons,
  roomCommonData,
  roomsDummyData,
} from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const {rooms,getToken,axios,navigate}=useAppContext()
  const [room, setRoom] = useState(null);

  const [mainImage, setMainImage] = useState(null);
  const [checkInDate,setCheckInDate]=useState(null)
  const [checkOutDate,setCheckOutDate]=useState(null)
  const [guests,setGuests]=useState(1)
  const [isAvailable,setIsAvailable]=useState(false)
  useEffect(() => {
    const room = rooms.find((room) => {
      return room._id === id

    });
    room && setRoom(room);

    room && setMainImage(room.images[0]);
  }, [rooms]);

  const checkAvailability=async ()=>{
    try{
      if(checkInDate>=checkOutDate){
        toast.error("Check In date should be less than check out date")
      }
      const {data}=await axios.post('/api/bookings/check-availability',{room:id,checkInDate,checkOutDate})
      if (data.success){
        if(data.isAvailable){
          setIsAvailable(true)
          toast.success('Room is available')
        }
        else{
          setIsAvailable(false)
          toast.error("room is not available")
        }
      }else{
        toast.error('success:false')
      }
    }catch(error){
      toast.error(error.message)
    }
  }
  //booki the room
  const onSubmitHandler=async(e)=>{
    try{
      e.preventDefault()
      if(!isAvailable){
        return checkAvailability()
      }else{
        const {data}=await  axios.post('/api/bookins/book',{room:id,checkInDate,checkOutDate,guests,paymentMethod:"Pay At Hotel"},{headers:{Authorization:`Bearer ${await getToken()}`}})
        if (data.success){
          toast.success(data.message)
          navigate('/my-bookings')
          scrollTo(0,0)
        }else{
          toast.error(data.message)
        }
      }
    }catch(error){
          toast.error(error.message)

    }
  }
  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 1g:px-24 xl:px-32">
        {/* Room Details */}

        <div className="flex flex-col md:flex-row gap-2 md:items-center items-start">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>

          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>
        {/* rating */}
        <div className="flex items-center">
          <span>⭐⭐⭐⭐⭐</span>
          <span className="ml-2">4.9 (200+ reviews)</span>
        </div>
        {/* address */}
        <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
          <img src={assets.locationIcon} alt="" />
          <span className="text-gray-500 text-sm">{room.hotel.address}</span>
        </div>

        {/* room images */}
        {/* Room Images */}

        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="Room Image"
              className="w-full rounded-x1 shadow-lg object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="Room Image"
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* room highlights */}
        {/* Room Highlights */}

        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>

            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2

rounded-1g bg-gray-100"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />

                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          {/* room price */}
          <p className="text-2xl font-medium text-gray-900 ">
            ${room.pricePerNight}/night{" "}
          </p>
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col md:flex-row items-start md:items-center
          justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-6 max-w-6xl"
        >
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>

              <input
                type="date"
                id="checkInDate"
                 onChange={e=>setCheckInDate(e.target.value)}  min={new Date().toISOString().split('T')[0]}
                placeholder="Check-In"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-500/9 max-md:hidden"></div>

            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>

              <input
                type="date"
                id="checkOutDate" onChange={e=>setCheckOutDate(e.target.value)}
                min={checkOutDate} disabled={!checkInDate}
                placeholder="Check-Out"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-500/7 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>

              <input
                type="number"
                onChange={e=>setGuests(e.target.value)}
                value={guests}
                id="guests"
                placeholder="1"
                className=" max-w-20  rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-10 md:px-4 py-3 md:py-2 text-base cursor-pointer"
          >
            {isAvailable?"Book Now":"Check Availability"}
          </button>
        </form>

        {/* common specifications */}
        <div className="mt-25 space-y-2">
          {roomCommonData.map((item, index) => (
            <div key={index} className="mt-2 flex items-start gap-2">
              <img src={item.icon} alt="" className="w-6.5 pt-1" />
              <div className="flex flex-col ">
                <h2 className="text-2xl font-playfair mb-0 pb-0">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* room details */}
        <div className="max-w-3xl border-y border-gray-300  my-15 py-10 text-gray-500">
          <p>
            Guests will be allocated on the ground floor according to
            availability. You get a comfortable Two bedroom apartment has a true
            city feeling. The price quoted is for two guest, at the guest slot
            please mark the number of guests to get the exact price for groups.
            The Guests will be allocated ground floor according to availability.
            You get the comfortable two bedroom apartment that has a true city
            feeling.
          </p>
        </div>

        {/* Hosted by */}

        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <img
              src={room.hotel.owner.image}
              alt="Host"
              className="h-14 w-14 md:h-18 md:w-18 rounded-full"
            />

            <div>
              <p className="text-lg md:text-xl"> Hosted by {room.hotel.name}</p>

              <div className="flex items-center mt-1">
                <span>⭐⭐⭐⭐⭐</span>
                <span className="ml-2">4.9 (200+ reviews)</span>
              </div>
            </div>
          </div>

        </div>
        <button className="px-3 py-1.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">Contact Now</button>
      </div>
    )
  );
};

export default RoomDetails;
