import React from 'react'
import { useEffect ,useState} from 'react'
import useAppContext from '../../context/AppContext'
import useDoctorContext from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function DoctorProfile() {
    const {  currency } = useAppContext();
    const { dToken, fetchDoctorProfile, docData,setDocData,backendUrl } = useDoctorContext();
    const [isEdit, setIsEdit] = useState(false);

    

  const handleInputChange = (field, value) => {
    setDocData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setDocData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    // TODO: submit docData to backend
    try {
      const {data} = await axios.patch(`${backendUrl}/api/v1/doctor/update-profile`, docData, {
        headers: {
          dtoken: dToken,
        }
      });
      if (data.success) {
        console.log("Profile updated successfully:", data.data);
        setDocData(data.data);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
    setIsEdit(false);
  };

  useEffect(() => {
     console.log("from here 1");
        if (dToken&&dToken !== "") {
         
          console.log("dToken:", dToken);
        fetchDoctorProfile();
        } 

    
    }, [dToken]);

  useEffect(() => {
    console.log("component mounted or isEdit changed");
    console.log("from here 2");
  if (!isEdit) {
     
    fetchDoctorProfile();
  }

  return ()=>{
    console.log("Cleaning up effect");
  }
}, [isEdit]);
 



if(!docData) return <div className="text-center text-gray-500">Loading...</div>;

  return docData && (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
      {/* Toggle Edit Button */}
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => {setIsEdit((prev) => !prev); }} >
          {isEdit ? "Cancel" : "Edit"}
        </button>
        {isEdit && (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>

      {/* Doctor Image and Name */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={docData.image}
          alt={docData.name}
          className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
        />
        <div>
          {isEdit ? (
            <>
              <input
                className="text-2xl font-bold text-gray-800 border-b w-full"
                value={docData.name || ""}
                onChange={e => handleInputChange("name", e.target.value)}
              />
              <input
                className="text-blue-600 font-semibold border-b w-full mt-1"
                value={docData.speciality || ""}
                onChange={e => handleInputChange("speciality", e.target.value)}
              />
              <input
                className="text-sm text-gray-500 border-b w-full mt-1"
                value={docData.degree || ""}
                onChange={e => handleInputChange("degree", e.target.value)}
              />
              <input
                className="text-sm text-gray-500 border-b w-full mt-1"
                value={docData.experience || ""}
                onChange={e => handleInputChange("experience", e.target.value)}
              />
            </>
          ) : (
            <> 
              <h2 className="text-2xl font-bold text-gray-800">{docData.name}</h2>
              <p className="text-blue-600 font-semibold">{docData.speciality}</p>
              <p className="text-sm text-gray-500">{docData.degree} • {docData.experience}</p>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">About</h3>
        {isEdit ? (
          <textarea
            className="text-gray-600 mt-1 border rounded w-full"
            value={docData.about || ""}
            onChange={e => handleInputChange("about", e.target.value)}
          />
        ) : (
          <p className="text-gray-600 mt-1">{docData.about}</p>
        )}
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Contact</h3>
        {isEdit ? (
          <>
            <input
              className="text-gray-600 border-b w-full"
              value={docData.email || ""}
              onChange={e => handleInputChange("email", e.target.value)}
            />
            <input
              className="text-gray-600 border-b w-full mt-1"
              value={docData.address?.line1 || ""}
              onChange={e => handleAddressChange("line1", e.target.value)}
            />
            <input
              className="text-gray-600 border-b w-full mt-1"
              value={docData.address?.line2 || ""}
              onChange={e => handleAddressChange("line2", e.target.value)}
            />
          </>
        ) : (
          <>
            <p className="text-gray-600">Email: {docData.email}</p>
            <p className="text-gray-600">Address: {docData.address?.line1}, {docData.address?.line2}</p>
          </>
        )}
      </div>

      {/* Fees and Availability */}
      <div className="flex flex-col sm:flex-row justify-between">
        {isEdit ? (
          <>
            <input
              className="text-green-700 font-semibold border-b w-32"
              value={docData.fees || ""}
              onChange={e => handleInputChange("fees", e.target.value)}
            />
            <select
              className="font-semibold border rounded ml-2"
              value={docData.available ? "available" : "unavailable"}
              onChange={e => handleInputChange("available", e.target.value === "available")}
            >
              <option value="available">Available for Appointment</option>
              <option value="unavailable">Currently Unavailable</option>
            </select>
          </>
        ) : (
          <>
            <p className="text-green-700 font-semibold">Fees: {currency}{docData.fees}</p>
            <p className={`font-semibold ${docData.available ? "text-green-600" : "text-red-500"}`}>
              {docData.available ? "Available for Appointment" : "Currently Unavailable"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorProfile
