import React, { useEffect,useState } from 'react'
import useAppContext from '../context/AppContext'
import { Link, useNavigate } from 'react-router-dom';

function RelatedDoctors({docId,speciality}) {
    const { doctors } = useAppContext();
    const navigate = useNavigate();
  // Assuming you want to display related doctors based on some criteria    
  const [RelatedDoctors, setRelatedDoctors] = useState([]);
  useEffect(() => {
    const fetchRelatedDoctors = () => {
      // Filter doctors based on the speciality and exclude the current doctor
      const related = doctors.filter(doctor => 
        doctor.speciality === speciality && doctor._id !== docId
      );
      setRelatedDoctors(related);
    };

    fetchRelatedDoctors();
  }, [docId, speciality, doctors]);
  return (
            <div className='flex flex-col items-center gap-4 my-16  text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='text-center text-sm sm:w-1/3'>Simply browse through our extensive list of trusted doctors.</p>
        
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {
                    RelatedDoctors.slice(0, 5).map((doctor, index) => (
                        <Link to={`/appointments/${doctor._id}`}  className='w-full' key={index}>
                        <div className='border border-blue-200  rounded-xl overflow-hidden cursor-pointer  hover:translate-y-[-10px] transition-all duration-500' onClick={()=>{scrollTo(0,0)}}>
                            <img src={doctor.image} alt={doctor.name} className='bg-blue-50' />
                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                    <p className='bg-green-500 w-2 h-2 rounded-full'></p><p>Available</p>
                                </div>
                                <h2 className='text-lg font-semibold'>{doctor.name}</h2>
                                <p className='text-sm text-gray-600'>{doctor.speciality}</p>
                            </div>
                        </div>
                        </Link>
                    ))
                }
            </div>
         

            <button onClick={()=>{navigate("/doctors"); scrollTo(0,0)}} className='bg-blue-400 text-gray-200 px-13 py-3 rounded-full mt-10 w-32 '>more</button>
        </div>
  )
}

export default RelatedDoctors
