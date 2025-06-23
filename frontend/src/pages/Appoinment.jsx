import React, { use } from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAppContext from '../context/AppContext.jsx'
import { assets } from '../assets/assets.js'
import {RelatedDoctors} from './index.js'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Appoinment() {
  const { id } = useParams();
  const { doctors, currencySymbol,backendUrl,token,fetchDoctorsList } = useAppContext();
  const [docInfo, setdocInfo] = useState(null);
  
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const fetchInfo = async () => {
    const doc_Info = await doctors.find((doctor) => (doctor._id === id))
    console.log(doc_Info);
    if (doc_Info) {
      setdocInfo(doc_Info);
    } else {
      toast.error("Doctor not found for the given id")
      setdocInfo(null);
      navigate('/'); // Redirect to home if doctor not found
      console.log("Doctor not found for id ", id);
      return ;
    }
  }

  const getDocSlots = async () => {
    setDocSlots([]);
    if (!docInfo) return;
    //get the current date
    const today = new Date();
    
    // Loop through the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      //set the end time  to 9 pm 
      const endDate = new Date();
      endDate.setDate(today.getDate() + i);
      endDate.setHours(21, 0, 0, 0); // Set to 9 PM

      //set the start date to 10 am
      if (today.getDate() === date.getDate()) {
        date.setHours(today.getHours() > 9 ? (today.getHours() + 1) : 10); // Set to current time hours
        date.setMinutes(today.getMinutes() > 30 ? 30: 0,0,0); // Set to current time minutes
      }
      else {
        date.setHours(10, 0, 0, 0); // Set to 10 AM
        date.setMinutes(0,0,0); // Set to 0 minutes
      }

      // Loop through the time slots from date to endDate
      let timeSlot = [];
      while (date < endDate) {
        // Format the date and time
        const formattedDate = date.toLocaleString([], {
          hour: "2-digit", minute: "2-digit"
        });
        //check if slot time for slot date is already booked or not
        let format= `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        if( docInfo.slots_Booked && docInfo.slots_Booked[format] && docInfo.slots_Booked[format].includes(formattedDate)) {
          // If the slot is already booked, skip to the next slot
          date.setMinutes(date.getMinutes() + 30); 
          continue;
        }
        // Push the formatted date and time to the slots array
        timeSlot.push({
          dateTime: new Date(date),
          time: formattedDate,
        });
        // Increment the time by 30 minutes
        date.setMinutes(date.getMinutes() + 30); 
      }


      //at the end we push the slots to the docSlots array 
      setDocSlots((prevSlots) => [
        ...prevSlots,
        timeSlot,
      ]);

    }


  }

  //now book the appointment
   const bookAppointment = async () => {
      //first slot time and slot index should be selected
      if (!slotTime || slotIndex < 0) {
      toast.warn("Please select a slot time and date");
        return;
      }

      //now we will make the slot_date from the index and docSlots
      const slotDate = docSlots[slotIndex][0].dateTime;
      //now we will make the backend request 
      try {
        const {data}=await axios.post(`${backendUrl}/api/v1/user/book-appointment`, {
          docId: id,
          slotDate: slotDate,
          slotTime: slotTime,
        }, {
          headers: {
            token: token,
          }
        });    
  
        if (data.success) {
          toast.success("Appointment booked successfully");
          //now we will update the doctor slots also
          setSlotTime('');
          setSlotIndex(0);
          //fetch the doctors list again to update the slots  
          fetchDoctorsList();
        }
        else {
          toast.error(data.message || "Failed to book appointment. Please try again later.");
          console.error("Failed to book appointment:", data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        console.log("Error booking appointment:", error.response?.data?.message || error.message);
        
      }
   }

  useEffect(() => {
    getDocSlots();
  }, [docInfo]);

  useEffect(() => {
    if(!docSlots.length) return;
    console.log(docSlots);
  }, [docSlots]) 

  useEffect(() => {
    if(!id || !doctors || !doctors.length) return;
    fetchInfo();
  }, [id, doctors]);
  


  return docInfo && (
    <div>
      {/* ----------- Doctor Details ----------- */}
      <div className='flex flex-col sm:flex-row gap-4'>

        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt='' />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* ----------- Doc Info : name, degree, experience ----------- */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt='' />
          </p>

          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>

          {/* doctors about */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt='' />
            </p>

            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
              {docInfo.about}
            </p>
          </div>

          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>
              {currencySymbol}{docInfo.fees}
            </span>
          </p>

        </div>

      </div>


      {/* ----- Booking slots ----- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div key={index} onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 border  border-gray-300'}`}>
                <p>{item[0] && daysOfWeek[item[0].dateTime?.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p
              key={index}
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${slotTime === item.time ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 border  border-gray-300'}`}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 my-6 rounded-full  '>Book an appointment</button>
      </div>

     {/* Listign the related doctors */}
   <RelatedDoctors docId={id} speciality={docInfo.speciality} />
    </div>


  );
}

export default Appoinment
