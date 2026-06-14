"use client";
import { CalendarCheck } from "lucide-react";
import { useAllContexts } from "../contexts/AllContexts";
import { baseURL } from "../../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../../utils/emitter";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ButtonLoader from "../Loader/ButtonLoader";
import { dateConvertor } from "../../../utils/DateConvertor";
type Room = {
  _id: string;
  title: string;
  description: string;
  cleanTime: number;
  floor: number;
  capacity: number;
  image: string;
};
type Booking = {
  _id: string;
  date: string;
  slot: string;
  roomId: Room;
  bookedBy: string;
  cancelledAt: string;
  bookedAt: number;
  status: "over" | "active" | "cancel";
  refundable: boolean;
};
export default function Navbar() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const {
    userEmail,
    setUserEmail,
    setAllBookings,
    btnLoading,
    setBtnLoading,
    allBookings,
  } = useAllContexts();
  const [email, setEmail] = useState<string>(userEmail);
  const getAllBookings = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(
        `${baseURL}/booking/api/getallbookings/${email}`,
      );
      let bookingData = await response.json();
      //console.log(bookingData);
      if (bookingData.success) {
        // successEmitter(bookingData.message);
        setAllBookings(bookingData.bookings);
        localStorage.setItem("userEmail", JSON.stringify(email));
        setUserEmail(email);
        setOpenModal(false);
        router.push(`/viewmybookings/${email}`);
      } else {
        errorEmitter(bookingData.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  let finishBooking = async (bookingId: string) => {
    try {
      let response = await fetch(
        `${baseURL}/booking/api/bookingover/${bookingId}`,
        {
          method: "PATCH",
        },
      );
      let overData = await response.json();
      //console.log(overData);
      if (overData.success) {
        successEmitter(overData.message);
        setAllBookings(
          allBookings.map((booking: Booking) => {
            if (booking._id == bookingId) {
              booking.status = "over";
            }
            return booking;
          }),
        );
      } else errorEmitter(overData.message);
    } catch (error) {
      console.log(error);
    }
  };
  const checkStatus = async () => {
    await Promise.all(
      allBookings.map(async (booking: Booking) => {
        if (booking.status == "active") {
          let expired = dateConvertor(booking.date, booking.slot);
          if (expired) {
            await finishBooking(booking._id);
          }
        }
      }),
    );
  };
  useEffect(() => {
    checkStatus();
  }, [new Date().getMinutes()]);
  return (
    <>
      <nav className="bg-white border-b shadow-sm fixed z-100 top-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
            className="text-2xl flex gap-2 items-center font-bold text-black"
          >
            <img src="/logo.png" className="h-12 w-auto" alt="" /> Room IT
          </h1>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <CalendarCheck size={18} />
            View Bookings
          </button>
        </div>
        {openModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
              <h2 className="text-2xl font-semibold text-black">
                View Bookings
              </h2>

              <p className="text-gray-600 mt-2">
                Enter your email to view your bookings.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await getAllBookings();
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-5 border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 text-black"
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    disabled={btnLoading}
                    type="reset"
                    onClick={() => {
                      setOpenModal(false);
                      setEmail("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-black"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={btnLoading}
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {btnLoading ? (
                      <>
                        <div className="flex gap-2 justify-center items-center">
                          Submitting... <ButtonLoader />
                        </div>
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                  {userEmail && (
                    <button
                      disabled={btnLoading}
                      type="reset"
                      onClick={() => {
                        setOpenModal(false);
                        router.push(`/viewmybookings/${userEmail}`);
                        setEmail("");
                      }}
                      className="px-4 py-2 border border-gray-300 bg-emerald-500 rounded-md hover:bg-emerald-600 text-white"
                    >
                      View my bookings
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </nav>
      <div className="my-7"></div>
    </>
  );
}
