import { useState } from "react";
import { ColourfulTextDemo } from "../Ui/ColourfullWord/ColourfulTextDemo";
import Tcount from "../Components/Tcont";
import Tmaterial from "../Components/Tmaterial";
import Tsizes from "../Components/Tsizes";
import Tcolours from "../Components/Tcolours";
import Ttype from "../Components/Ttype";
import Footer from "../Components/Footer";

export default function Shop() {
  const [popup, setPopup] = useState(null);
  const [selectedCount, setSelectedCount] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedColours, setSelectedColours] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const handlePopupOpen = (popupNumber) => {
    setPopup(popupNumber);
  };

  const handlePopupClose = () => {
    setPopup(null);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    if (selectedCount) total += selectedCount.price || 0;
    if (selectedMaterial) total += selectedMaterial.price || 0;
    if (selectedType) total += selectedType.price || 0;
    selectedColours.forEach((c) => (total += c.price || 0));
    return total;
  };

  const averageCost = calculateTotalPrice();

  const SelectionBox = ({ label, imgSrc, onClick }) => (
    <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
      <div
        className="relative w-[150px] h-[150px] bg-white rounded-lg shadow-2xl flex justify-center items-center cursor-pointer"
        onClick={onClick}
      >
        <img src={imgSrc} alt={label} className="w-[80%]" />
      </div>
      <div className="h-[22px] mt-1 text-white">{label}</div>
    </div>
  );

  return (
    <div>
      <div className="container py-10 mx-auto px-4">
        <div className="flex flex-col gap-10">
          <div className="">
            <ColourfulTextDemo />
          </div>

          {/* Selection Grid */}
          <div className="grid gap-6 justify-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <SelectionBox label="Count" imgSrc="/s3.png" onClick={() => handlePopupOpen(1)} />
            <SelectionBox label="Type" imgSrc="/s5.png" onClick={() => handlePopupOpen(5)} />
            <SelectionBox label="Material" imgSrc="/s2.png" onClick={() => handlePopupOpen(2)} />
            <SelectionBox label="Colours" imgSrc="/s1.png" onClick={() => handlePopupOpen(3)} />
            <SelectionBox label="Sizes" imgSrc="/s4.png" onClick={() => handlePopupOpen(4)} />
          </div>

          {/* Selected Items Summary */}
          <div className="p-5 mt-5 text-white bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold">Selected Items:</h3>
            {selectedCount && <p>Count: {selectedCount.name}</p>}
            {selectedMaterial && <p>Material: {selectedMaterial.name}</p>}
            {selectedType && <p>Type: {selectedType.name}</p>}
            {selectedColours.length > 0 && (
              <p>Colours: {selectedColours.map((c) => c.name).join(", ")}</p>
            )}
            {selectedSizes.length > 0 && (
              <p>Sizes: {selectedSizes.map((s) => s.name).join(", ")}</p>
            )}
          </div>

          {/* Cost Display */}
          <div className="flex flex-col items-start justify-between gap-3 text-xl sm:flex-row">
            <h2>Average Cost: ${averageCost.toFixed(2)}</h2>
            <button
              className="text-red-500"
              onClick={() => {
                setSelectedCount(null);
                setSelectedMaterial(null);
                setSelectedColours([]);
                setSelectedSizes([]);
                setSelectedType(null);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Popups */}
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
            {popup === 5 && (
              <Ttype onClose={handlePopupClose} onSelectType={setSelectedType} />
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}