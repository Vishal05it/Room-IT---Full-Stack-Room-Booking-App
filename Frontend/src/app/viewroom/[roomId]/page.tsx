"use client";
import { useParams, useRouter } from "next/navigation";
import { baseURL } from "../../../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../../../utils/emitter";
import { useEffect, useState } from "react";
import { useAllContexts } from "@/app/contexts/AllContexts";
import Loader from "@/app/Loader/Loader";
import BookRoomModal from "@/app/components/BookRoomModal";
type Room = {
  _id: string;
  title: string;
  description: string;
  cleanTime: number;
  floor: number;
  capacity: number;
  image: string;
};
export default function ViewRoom() {
  const router = useRouter();
  let param = useParams();
  const [openBookModal, setOpenBookModal] = useState<boolean>(false);

  let { pageLoading, setPageLoading, room, setRoom } = useAllContexts();
  const getRoomDetails = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(
        `${baseURL}/room/api/viewroom/${param.roomId}`,
      );
      let roomData = await response.json();
      //console.log(roomData);
      if (roomData.success) {
        // successEmitter(roomData.message);
        setRoom(roomData.room);
      } else {
        errorEmitter(roomData.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };
  useEffect(() => {
    let fetchRoom = async () => {
      await getRoomDetails();
    };
    if (room._id.length == 0 || room._id != param.roomId) {
      fetchRoom();
    }
  }, []);
  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen transition bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
              onClick={() => router.push("/")}
              className="mb-6 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-black"
            >
              Back to Home
            </button>

            {/* Room Card */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              {/* Image */}
              <img
                src={
                  room.image
                    ? room.image
                    : `https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200`
                }
                alt="Conference Room"
                className="w-full h-72 object-cover"
              />

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h1 className="text-3xl font-bold text-black">
                  {room.title ? room.title : "Loading title..."}
                </h1>

                {/* Description */}
                <p className="text-gray-600 mt-4 leading-7">
                  {room.description
                    ? room.description
                    : "Loading description..."}
                </p>

                {/* Room Details */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border rounded-md p-4">
                    <p className="text-sm text-gray-500">Floor</p>

                    <h2 className="text-xl font-semibold text-black mt-1">
                      {room.floor ? room.floor : "Loading floors..."}
                    </h2>
                  </div>

                  <div className="bg-gray-50 border rounded-md p-4">
                    <p className="text-sm text-gray-500">Capacity</p>

                    <h2 className="text-xl font-semibold text-black mt-1">
                      {room.capacity ? room.capacity : "Loading capacity..."}{" "}
                      People
                    </h2>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => {
                    setOpenBookModal(true);
                  }}
                  className="w-full mt-8 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
                >
                  Book Room
                </button>
              </div>
            </div>
          </div>
          {openBookModal && (
            <BookRoomModal
              roomId={param.roomId as string}
              setOpenBookModal={setOpenBookModal}
            />
          )}
        </div>
      )}
    </>
  );
}
