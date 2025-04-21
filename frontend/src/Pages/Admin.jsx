import React from 'react'
import AddColorForm from '../Components/AddColorForm'
import AddSizeForm from '../Components/AddSizeForm'
import AddMaterialForm from '../Components/AddMaterialForm'
import AddCountForm from '../Components/AddCountForm'
import GetAllContacts from '../Components/GetAllContacts'
import Footer from '../Components/Footer'

export default function Admin() {
  return (
    <div>
      <div className='flex gap-10 pt-10 justify-evenly'>
      <AddColorForm></AddColorForm>
      <AddSizeForm></AddSizeForm>
      <AddMaterialForm></AddMaterialForm>
      <AddCountForm></AddCountForm>
      </div>
      <div>
        <GetAllContacts></GetAllContacts>
      </div>
      <Footer></Footer>
    </div>
  )
}
