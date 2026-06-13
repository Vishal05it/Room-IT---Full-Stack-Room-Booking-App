import { useRouter } from "next/navigation";

type Props = {
  _id: string;
  title: string;
  description: string;
  cleanTime: number;
  floor: number;
  capacity: number;
  image: string;
};
export default function RoomCard({
  _id,
  title,
  description,
  capacity,
  cleanTime,
  floor,
  image,
}: Props) {
  const router = useRouter();
  return (
    <div className="bg-white roombox border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
      {/* Room Image */}
      <div className="overflow-hidden transition">
        <img
          src={
            image
              ? image
              : `https://images.unsplash.com/photo-1497366754035-f200968a6e72`
          }
          alt="Meeting Room"
          className="w-full roomimage h-48 object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Room Title */}
        <h2 className="text-xl text-gray-800 font-semibold">
          {title ? title : "Loading..."}
        </h2>

        {/* Short Description */}
        <p className="text-gray-600 text-sm mt-2">
          {description ? description : "Loading..."}
        </p>

        {/* Extra Details */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>Floor {floor ? floor : "Loading..."}</span>

          <span>Capacity: {capacity ? capacity : "Loading..."}</span>
        </div>

        {/* Button */}
        <button
          onClick={() => router.push(`/viewroom/${_id}`)}
          className="w-full mt-5 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          View Room Details
        </button>
      </div>
    </div>
  );
}
