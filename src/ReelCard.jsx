function ReelCard({ reel }) {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      
      {/* Video */}
      <video
        src={reel.video}
        className="w-full h-40 object-cover"
        muted
      />

      {/* Info */}
      <div className="p-2">
        <h2 className="text-sm font-semibold">{reel.title}</h2>
        <p className="text-xs text-gray-400">
          {reel.price} • ⭐ {reel.rating}
        </p>

        <button
          onClick={() => window.open("https://zomato.com", "_blank")}
          className="mt-2 w-full bg-red-500 text-sm py-1 rounded"
        >
          Order
        </button>
      </div>

    </div>
  );
}

export default ReelCard;