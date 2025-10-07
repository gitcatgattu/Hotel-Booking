import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({room,index}) => {
  return (
    <Link to={`/rooms/${room._id}`} onClick={()=>scrollTo(0,0)} key={room._id} className={`group relative  max-w-60 w-full rounded-xl bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]  overflow-hidden ${index===0?"col-span-2 md:col-span-3":"col-span-1"} cursor-pointer`}>
      <img src={room.images[0]} alt="" />
      {index%2===0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>Best Seller</p>}

      <div className='p-4 pt-5'>
        <div className='flex items-center justify-between mt-2'>
          <p className='font-playfair text-xl font-medium text-gray-800'>{room.hotel.name}</p>
          <div className='flex items-center gap-1'>
            <img src={assets.starIconFilled} alt="" />4.5
          </div>
        </div>
        <div className='flex items-center gap-1'>
            <img src={assets.locationIcon} alt="" />
            <span>{room.hotel.address}</span>
          </div>
          <div className='mt-4 flex items-center justify-between'>
            <p><span>${room.pricePerNight}</span>/night</p>
            <button className='px-4 py-2 text-sm font-medium border border-gray-300  rounded hover:bg-gray-50 transition-all cursor-pointer'>Book Now</button>
          </div>
      </div>
    </Link>
  )
}

export default HotelCard