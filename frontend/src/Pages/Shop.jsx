import { useState, useEffect } from "react";
import { ColourfulTextDemo } from "../Ui/ColourfullWord/ColourfulTextDemo";
import Tcount from "../Components/Tcont";
import Tmaterial from "../Components/Tmaterial";
import Tsizes from "../Components/Tsizes";
import Tcolours from "../Components/Tcolours";

export default function Shop() {
  const [popup, setPopup] = useState(null);
  const [selectedCount, setSelectedCount] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedColours, setSelectedColours] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const handlePopupOpen = (popupNumber) => {
    setPopup(popupNumber);
  };

  const handlePopupClose = () => {
    setPopup(null);
  };

  // Calculate total price for selected items
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    if (selectedCount) totalPrice += selectedCount.price || 0; // Add count price
    if (selectedMaterial) totalPrice += selectedMaterial.price || 0; // Add material price
    selectedColours.forEach((colour) => {
      totalPrice += colour.price || 0; // Add price for each selected colour
    });

    return totalPrice;
  };

  // Calculate the average cost (you can divide by number of selected items if needed)
  const averageCost = calculateTotalPrice();

  return (
    <div className="">
      <div className="container py-10 mx-auto">
        <div className="flex flex-col gap-10 px-10">
          <div className="justify-start text-3xl">
            <ColourfulTextDemo />
          </div>

          <div className="flex gap-10 pt-10 justify-evenly">
            {/* Count Selection */}
            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center cursor-pointer"
                onClick={() => handlePopupOpen(1)}
              >
                <img src="/s3.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px] z-50 rounded-sm flex justify-center items-center">
                Count
              </div>
            </div>

            {/* Material Selection */}
            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center cursor-pointer"
                onClick={() => handlePopupOpen(2)}
              >
                <img src="/s2.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px] z-50 rounded-sm flex justify-center items-center">
                Material
              </div>
            </div>

            {/* Colours Selection */}
            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center cursor-pointer"
                onClick={() => handlePopupOpen(3)}
              >
                <img src="/s1.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px] z-50 rounded-sm flex justify-center items-center">
                Colours
              </div>
            </div>

            {/* Sizes Selection */}
            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center cursor-pointer"
                onClick={() => handlePopupOpen(4)}
              >
                <img src="/s4.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px] z-50 rounded-sm flex justify-center items-center">
                Sizes
              </div>
            </div>
          </div>

          {/* Display Selected Items */}
          <div className="p-5 mt-5 text-white bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold">Selected Items:</h3>
            {selectedCount && <p>Count: {selectedCount.name}</p>}
            {selectedMaterial && <p>Material: {selectedMaterial.name}</p>}
            {selectedColours.length > 0 && (
              <p>Colours: {selectedColours.map(c => c.name).join(", ")}</p>
            )}
            {selectedSizes.length > 0 && (
              <p>Sizes: {selectedSizes.map(s => s.name).join(", ")}</p>
            )}
          </div>

          {/* Average Cost Display */}
          <div className="flex justify-between text-xl">
            <h2>Average Cost: ${averageCost.toFixed(2)}</h2>
            <button
              className="text-red-500"
              onClick={() => {
                setSelectedCount(null);
                setSelectedMaterial(null);
                setSelectedColours([]);
                setSelectedSizes([]);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center h-screen bg-opacity-50 backdrop-blur-lg">
            {popup === 1 && (
              <Tcount onClose={handlePopupClose} onSelectCount={setSelectedCount} />
            )}
            {popup === 2 && (
              <Tmaterial onClose={handlePopupClose} onSelectMaterial={setSelectedMaterial} />
            )}
            {popup === 3 && (
              <Tcolours onClose={handlePopupClose} onSelectColours={setSelectedColours} />
            )}
            {popup === 4 && (
              <Tsizes onClose={handlePopupClose} onSelectSizes={setSelectedSizes} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
