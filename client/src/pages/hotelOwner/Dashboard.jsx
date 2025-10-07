import React from "react";
import { assets, dashboardDummyData } from "../../assets/assets";
import Title from "../../components/Title";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = React.useState(dashboardDummyData);
  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations."
      />

      <div className="flex gap-4 my-8">
        {/* -------Total Bookings-- */}

        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt=""
            className="max-sm:hidden h-10"
          />

          <div className="flex flex-col md:ml-4 font-medium">
            <p>Total Bookings</p>
            <p className="text-neutral-400 text-base">
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>

        {/* -------Total Revenue-- */}

        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt="total revenue"
            className="max-sm:hidden h-10"
          />

          <div className="flex flex-col md:ml-4 font-medium">
            <p>Total Revenue</p>
            <p className="text-neutral-400 text-base">
              $ {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
        {/* recent bookings */}
       
      </div>
       <div className="w-full max-w-3x1 text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-gray-800 font-medium">
                  User Name
                </th>

                <th
                  className="py-3 px-4 text-gray-800 font-medium max-sm:hidden"
                >
                  Room Name
                </th>

                <th
                  className="py-3 px-4 text-gray-800 font-medium text-center"
                >
                  Total Amount
                </th>

                <th
                  className="py-3 px-4 text-gray-800 font-medium text-center"
                >
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dashboardData.bookings.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 border-b border-gray-300 text-gray-700 border-t">
                    {item.user.username}
                  </td>
                  <td className="py-3 px-4 border-b max-sm:hidden border-gray-300 text-gray-700 border-t">
                    {item.room.roomType}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-gray-700 border-t text-center">
                    {item.totalPrice}
                  </td>
                  <td className="py-3 px-4 flex border-gray-300 text-gray-700 border-t">
                  <button className={`px-3 py-1 rounded-full text-sm font-medium ${item.isPaid ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}  `}>
                    {item.isPaid?"Completed":"Pending"}
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default Dashboard;
