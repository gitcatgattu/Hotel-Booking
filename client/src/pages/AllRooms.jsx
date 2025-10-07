import { useState } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
const CheckBox=({label,selected=false,onChange})=>{
  return(
    <div className="flex items-center gap-2">
      <input type="checkbox" id={label} checked={selected} onChange={e=>onChange(e.target.checked,label)} className="w-4 h-4 accent-blue-600 cursor-pointer"/>
      <label htmlFor={label} className="text-gray-600 text-sm cursor-pointer">{label}</label>
    </div>
  )
}

const RadioButton=({label,selected=false,onChange})=>{
  return(
    <div className="flex items-center gap-2">
      <input type="radio" name="SortOption" id={label} checked={selected} onChange={e=>onChange(e.target.checked,label)} className="w-4 h-4 accent-blue-600 cursor-pointer"/>
      <label htmlFor={label} className="text-gray-600 text-sm cursor-pointer">{label}</label>
    </div>
  )
} 




const AllRooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);

  const roomTypes=["Single Bed","Double Bed","Luxury Room","Family Suite"]

  const priceRanges=['0 to 500','500 to 1000','1000 to 1500','1500 to 2000','2000+']
  const sortbyOptions=['Price - Low to High','Price - High to Low','Rating - High to Low','Rating - Low to High']



  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 1g:px-24 x1:px-32">
      <div>
        <div>
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>

          <p
            className="text-sm md:text-base text-gray-500/90 mt-2

max-w-174"
          >
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>
        {roomsDummyData.map((room) => (
          <div
            className="flex flex-col md:flex-row gap-4 mt-8 items-start py-10 border-b border-gray-300 last:pb-30 last:border-0"
            key={room._id}
          >
            <img
              src={room.images[0]}
              alt="hotelimg"
              title="View Room Details"
              className="max-h-65 max-w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
            />
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city} </p>
              <p
                className="text-gray-800 text-3xl font-playfair cursor-pointer "
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
              >
                {room.hotel.name}{" "}
              </p>
              <div className="flex items-center">
                <span>⭐⭐⭐⭐⭐</span>
                <span className="ml-2">4.9 (200+ reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="" />
                <span className="text-gray-500 text-sm">
                  {room.hotel.address}
                </span>
              </div>

              {/* room amenities below */}
              <div className=" flex flex-wrap mt-3 mb-6 gap-4 text-xs  rounded-full">
                {room.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className=" flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5ff]/70 text-gray-800"
                  >
                    <img
                      src={facilityIcons[amenity]}
                      className="-w5 h-5"
                      alt=""
                    />
                    <p className="text-xs">{amenity}</p>
                  </div>
                ))}
              </div>

              {/* room price  */}
              <p className="text-xl font-medium text-gray-700 ">
                ${room.pricePerNight}/night{" "}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}

      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>

          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>

            <span className="hidden lg:block">CLEAR</span>
          </div>
        </div>

        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700}`}
        >
          <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
              {roomTypes.map((type,index)=>(
                <CheckBox key={index} label={type} />
              ))}
          </div>
           <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Price Range</p>
              {priceRanges.map((range,index)=>(
                <CheckBox key={index} label={`$ ${range}`} />
              ))}
          </div>
           <div className="px-5 pt-5 pb-10  ">
              <p className="font-medium text-gray-800 pb-2">Sort By</p>
              {sortbyOptions.map((option,index)=>(
                <RadioButton key={index} label={option} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AllRooms;
