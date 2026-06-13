"use client";
import { useEffect, useMemo, useState } from "react";
import { baseURL } from "../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../utils/emitter";
import RoomCard from "./components/RoomCard";
import { useAllContexts } from "./contexts/AllContexts";
import Loader from "./Loader/Loader";
import { useRouter } from "next/navigation";
import ButtonLoader from "./Loader/ButtonLoader";
type Room = {
  _id: string;
  title: string;
  description: string;
  cleanTime: number;
  floor: number;
  capacity: number;
  image: string;
};
export default function Dashboard() {
  const { allRooms, setAllRooms, pageLoading, setPageLoading } =
    useAllContexts();
  const [showRooms, setShowRooms] = useState<Room[]>(allRooms);
  const [keyWord, setKeyWord] = useState<string>("");
  const getAllRooms = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(`${baseURL}/room/api/getallrooms`);
      let roomsData = await response.json();
      //console.log(roomsData);
      if (roomsData.success) {
        // successEmitter(roomsData.message);
        setAllRooms(roomsData.rooms);
      } else errorEmitter(roomsData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };
  const filteredRooms = useMemo(() => {
    if (keyWord == "") {
      return allRooms;
    }
    let filtered = allRooms.filter((room) => {
      if (
        room.title.toLowerCase().includes(keyWord.toLowerCase()) ||
        room.description.toLowerCase().includes(keyWord.toLowerCase())
      ) {
        return room;
      }
    });
    return filtered;
  }, [keyWord]);
  useEffect(() => {
    const fetchRooms = async () => {
      if (allRooms.length == 0) {
        await getAllRooms();
      }
    };
    fetchRooms();
  }, []);
  useEffect(() => {
    setShowRooms(allRooms);
  }, [allRooms]);
  useEffect(() => {
    setShowRooms(filteredRooms as Room[]);
  }, [keyWord]);
  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Heading */}
            <div className="mb-8 flex px-12 justify-between">
              <div>
                {" "}
                <h1 className="text-3xl text-black font-bold">
                  Meeting Room Booking
                </h1>
                <p className="text-gray-600 mt-2">
                  Browse available meeting rooms and reserve your preferred
                  slot.
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white border rounded-lg p-4 mb-8">
              <input
                value={keyWord}
                onChange={(e) => {
                  setKeyWord(e.target.value);
                }}
                type="text"
                placeholder="Search rooms..."
                className="w-full text-black border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Room Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showRooms.length > 0 ? (
                showRooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    _id={room._id}
                    title={room.title}
                    description={room.description}
                    image={room.image}
                    floor={room.floor}
                    capacity={room.capacity}
                    cleanTime={room.cleanTime}
                  />
                ))
              ) : (
                <>
                  <div className="flex text-black w-screen h-screen absolute left-0 justify-center items-center">
                    <h1 className="mb-24">Sorry no rooms to book yet.</h1>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
