import React, { useState } from "react";

export function DraggableCardDemo() {
  // Only logos here (no names linked)
  const universityLogos = [
    { logo: "/pera.jfif" },
    { logo: "/mora.jfif" },
    { logo: "/japura.png" },
    { logo: "/sabra.jfif" },
    { logo: "/jaffna.png" },
    { logo: "/kalaniya.jfif" },
    { logo: "/ruhu.jfif" },
    { logo: "/raja.png" },
    { logo: "/colo.png" },
    { logo: "/vav.jfif" },
    // add more logos here if needed
  ];

  const manualItems = [
    { image: "/Tshirt1.jpg" },
    { image: "/Tshirt2.jpg" },
  ];

  const generatedItems = Array.from({ length: 31 }, (_, i) => ({
    image: `/t${i + 1}.jpeg`,
  }));

  const allItems = [...manualItems, ...generatedItems];
  const imagesPerRow = 4;
  const initialRows = 2;
  const [visibleCount, setVisibleCount] = useState(imagesPerRow * initialRows);

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + imagesPerRow * initialRows, allItems.length)
    );
  };

  return (
    <div className="w-full flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold text-white/80 mb-6 text-center">
        DOTS Corporations. Product Gallery
      </h2>

      {/* Grid Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-6">
        {allItems.slice(0, visibleCount).map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg transition-transform duration-500 ease-in-out hover:scale-105"
          >
            <img
              src={item.image}
              alt={`Product ${idx + 1}`}
              loading="lazy"
              className="w-full h-64 object-cover rounded-t-2xl"
            />
          </div>
        ))}
      </div>

      {/* See More button */}
      {visibleCount < allItems.length && (
        <button
          onClick={handleLoadMore}
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          See More
        </button>
      )}

      {/* University Logos */}
      <div className="w-full py-10 mt-12 bg-[#0a0a12] flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-2 px-6">
          {universityLogos.map((item, idx) => (
            <img
              key={idx}
              src={item.logo}
              alt={`University ${idx + 1}`}
              className="w-4 h-10 md:w-12 md:h-12 object-contain"
            />
          ))}
        </div>

        {/* Separate Paragraph of University Names */}
        <div className="mt-2 max-w-6xl px-6 text-center">
          <p className="text-white/60 text-xs leading-relaxed">
            University of Peradeniya, University of Moratuwa, University of Sri
            Jayewardenepura, Sabaragamuwa University of Sri Lanka, University of
            Jaffna, University of Kelaniya, University of Colombo, University of
            Ruhuna, The Open University of Sri Lanka, Eastern University, Sri
            Lanka, Rajarata University of Sri Lanka, Wayamba University of Sri
            Lanka, Uva Wellassa University, University of the Visual & Performing
            Arts, Gampaha Wickramarachchi University, University of Vavuniya, Sri
            Lanka, South Eastern University of Sri Lanka, General Sir John
            Kotelawala Defence University, ICBT Campus, NSBM Green University,
            National Institute of Business Management (NIBM), Higher National
            Diploma (HND) Institutes, Hardy College, KIU University, Ocean
            University of Sri Lanka, Sri Lanka Institute of Information Technology
            (SLIIT), Vocational Training Authority (VTA), SLTC Research University,
            ESOFT Metro Campus, Sri Lanka Institute of Advanced Technological
            Education (SLIATE), Horizon College of Business & Technology,
            Institute of Chemistry Ceylon, Saegis Campus.
          </p>
        </div>
      </div>
    </div>
  );
}
