import { IoIosBookmarks } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { LuAlarmClock } from "react-icons/lu";

function Services() {
    return(
        <section id="services" className="px-16 py-45">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gaya Belajar Card - Featured */}
            <div className="bg-gradient-to-br from-[#0798C5] to-[#7FD8E8] text-white p-6 rounded-3xl relative overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold mb-1">Gaya</h3>
                    <h3 className="text-xl font-bold">Belajar</h3>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl">
                    <IoIosBookmarks />
                </div>
                </div>
                <p className="text-md mb-6 text-white/90">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <button className="px-6 py-2 rounded-full bg-white text-[#0798C5] text-sm transition duration-200 hover:bg-white hover:text-[#0798C5] border-2 border-transparent hover:border-[#0798C5] rounded-full cursor-pointer">
                Test Now
                </button>
            </div>

            {/* Cari Teman Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Cari</h3>
                    <h3 className="text-xl font-bold text-gray-800">Teman</h3>
                </div>
                <div className="bg-[#0798C5] p-3 rounded-2xl">
                    <FaUserFriends />
                </div>
                </div>
                <p className="text-md mb-6 text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <button className="px-6 py-2 rounded-full bg-[#0798C5] text-white text-sm transition duration-200 hover:bg-white hover:text-[#0798C5] border-2 border-transparent hover:border-[#0798C5] rounded-full cursor-pointer">
                Friends
                </button>
            </div>

            {/* Belajar Bersama Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Belajar</h3>
                    <h3 className="text-xl font-bold text-gray-800">Bersama</h3>
                </div>
                <div className="bg-[#0798C5] p-3 rounded-2xl">
                    <RiTeamFill />
                </div>
                </div>
                <p className="text-md mb-6 text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <button className="px-6 py-2 rounded-full bg-[#0798C5] text-white text-sm transition duration-200 hover:bg-white hover:text-[#0798C5] border-2 border-transparent hover:border-[#0798C5] rounded-full cursor-pointer">
                Learn
                </button>
            </div>

            {/* Timer Belajar Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:scale-105 transition-transform duration-300 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Timer</h3>
                    <h3 className="text-xl font-bold text-gray-800">Belajar</h3>
                </div>
                <div className="bg-[#0798C5] p-3 rounded-2xl">
                    <LuAlarmClock />
                </div>
                </div>
                <p className="text-md mb-6 text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <button className="px-6 py-2 rounded-full bg-[#0798C5] text-white text-sm transition duration-200 hover:bg-white hover:text-[#0798C5] border-2 border-transparent hover:border-[#0798C5] rounded-full cursor-pointer">
                Timer
                </button>
            </div>
            </div>
        </section>
    )
}

export default Services;