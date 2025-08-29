import React from "react";
import Footer from "../Components/Footer";
import AddColorForm from "../Components/AddColorForm";
import AddSizeForm from "../Components/AddSizeForm";
import AddMaterialForm from "../Components/AddMaterialForm";
import AddCountForm from "../Components/AddCountForm";
import AddTypeForm from "../Components/AddTypeForm";


import AddStatForm from "../Components/AddStatForm";
import AddGsmForm from "../Components/AddGsmForm";
import AddCollarForm from "../Components/AddCollarForm";

export default function AdminAddItems() {
  return (
    <div>
      <div className="p-6">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight flex items-center gap-3">
          
          Add <span className="text-blue-500 drop-shadow">TShirt Items</span>
        </h1>
        <div className="flex gap-10 pt-10 justify-evenly">
          <AddColorForm></AddColorForm>
          <AddTypeForm></AddTypeForm>
          <AddMaterialForm></AddMaterialForm>
          <AddCountForm></AddCountForm>
        </div>
        <div className="flex gap-10 p-10 justify-evenly">
          <AddSizeForm></AddSizeForm>
          <AddGsmForm></AddGsmForm>
          <AddCollarForm></AddCollarForm>
        </div>

        <div className=" w-full h-3 bg-gray-700 "></div>
        <div className=" pt-10">
          <h1 className="text-3xl font-extrabold py-5 flex items-center gap-2">
            
            Add <span className="text-yellow-400 drop-shadow">Items</span> for
            Count
          </h1>
          <AddStatForm></AddStatForm>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
