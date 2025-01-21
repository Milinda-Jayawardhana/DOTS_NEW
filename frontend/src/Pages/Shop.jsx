import { useState } from "react";
import { ColourfulTextDemo } from "../Ui/ColourfullWord/ColourfulTextDemo";
import Tcount from "../Components/Tcont";

export default function Shop() {
  const [popup, setPopup] = useState(null);

  const handlePopupOpen = (popupNumber) => {
    setPopup(popupNumber);
  };

  const handlePopupClose = () => {
    setPopup(null);
  };

  return (
    <div className="">
      <div className="container py-10 mx-auto">
        <div className="flex flex-col gap-10 px-10">
          <div className="justify-start text-3xl">
            <ColourfulTextDemo></ColourfulTextDemo>
          </div>

          <div className="flex gap-10 pt-5 justify-evenly">
            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center "
                onClick={() => handlePopupOpen(1)}
              >
                <img src="/s3.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px]   z-50 rounded-sm flex justify-center items-center ">
                Count
              </div>
            </div>

            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center "
                onClick={() => handlePopupOpen(2)}
              >
                <img src="/s2.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px]   z-50 rounded-sm flex justify-center items-center ">
                Material
              </div>
            </div>

            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center "
                onClick={() => handlePopupOpen(3)}
              >
                <img src="/s1.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px]   z-50 rounded-sm flex justify-center items-center ">
                Colours
              </div>
            </div>

            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center "
                onClick={() => handlePopupOpen(4)}
              >
                <img src="/s4.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px]   z-50 rounded-sm flex justify-center items-center ">
                Sizes
              </div>
            </div>

          </div>

          <div className="flex gap-10 pt-5 justify-evenly">
            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center "
                onClick={() => handlePopupOpen(1)}
              >
                <img src="/s3.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px]   z-50 rounded-sm flex justify-center items-center ">
                Count
              </div>
            </div>

            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center "
                onClick={() => handlePopupOpen(2)}
              >
                <img src="/s2.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px]   z-50 rounded-sm flex justify-center items-center ">
                Material
              </div>
            </div>

            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center "
                onClick={() => handlePopupOpen(3)}
              >
                <img src="/s1.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px]   z-50 rounded-sm flex justify-center items-center ">
                Colours
              </div>
            </div>

            <div className="w-[150px] h-[160px] bg-gray-700 rounded-lg flex flex-col items-center">
              <div
                className="relative z-40 w-[150px] h-[150px] bg-white rounded-lg shadow-2xl shadow-stone-950 flex justify-center items-center "
                onClick={() => handlePopupOpen(4)}
              >
                <img src="/s4.png" alt="" className="w-[80%]" />
              </div>
              <div className="w-[50%] h-[22px]   z-50 rounded-sm flex justify-center items-center ">
                Sizes
              </div>
            </div>

          </div>



          <div className="flex justify-between text-xl">
            <h2>Average Cost:</h2>
            <h2>Reset</h2>
          </div>
        </div>

        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center h-screen bg-black bg-opacity-50 backdrop-blur-lg">
            <Tcount onClose={handlePopupClose} />
          </div>
        )}
      </div>
    </div>
  );
}
