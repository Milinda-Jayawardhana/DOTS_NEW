import React from "react";
import Footer from "../Components/Footer";
import AddColorForm from "../Components/AddColorForm";
import AddSizeForm from "../Components/AddSizeForm";
import AddMaterialForm from "../Components/AddMaterialForm";
import AddCountForm from "../Components/AddCountForm";
import AddTypeForm from "../Components/AddTypeForm";

import AddStatForm from "../Components/AddStatForm";

export default function AdminAddItems() {
  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Add TShirt Items</h1>
        <div className="flex gap-10 pt-10 justify-evenly">
          <AddColorForm></AddColorForm>
          <AddTypeForm></AddTypeForm>
          <AddMaterialForm></AddMaterialForm>
          <AddCountForm></AddCountForm>
        </div>
        <div className="flex gap-10 p-10 justify-evenly">
          <AddSizeForm></AddSizeForm>
        </div>

        <div className=" w-full h-3 bg-gray-700 "></div>
        <div className=" pt-10">
          <h1 className="text-2xl font-bold py-5">
            Add Items for Count Section
          </h1>
          <AddStatForm></AddStatForm>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
