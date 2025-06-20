import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import  useAdminContext  from '../../context/AdminContext';
const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const { backendUrl,aToken } = useAdminContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //check if nay field is empty
    if ( [docImg, name, email, password, experience, fees, about, speciality, degree, address1].some(field => field === "" || field == null)) {
      toast('Please fill all the fields');
      return;
    }
    //check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast('Please enter a valid email address');
      return;
    }
    //check if password is strong
    if (password.length < 8) {
      toast('Password must be at least 8 characters long');
      return;
    }
    //check if fees is a number
    if (isNaN(fees) || fees <= 0) {
      toast('Please enter a valid fees amount');
      return;
    }
    //now send the data to the backend 
    const formData = new FormData();
    formData.append('docImg', docImg);  
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('experience', experience);
    formData.append('fees', fees);
    formData.append('about', about);
    formData.append('speciality', speciality);
    formData.append('degree', degree);
    //address is an object so we need to convert it to a string
    formData.append('address', JSON.stringify({ line1:address1, line2:address2 }));
    //now using the try catch and axios to send the data 
    try {
      const response = await axios.post(`${backendUrl}/api/v1/admin/add-doctors`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          'aToken': aToken // Assuming you store the admin token in localStorage
        }
      });
      
      console.log(response?.data);
      if (response?.data?.success) {
        toast.success('Doctor added successfully');
        //reset the form
        setDocImg(null);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('');
        setFees('');
        setAbout('');
        setSpeciality('');
        setDegree('');
        setAddress1('');
        setAddress2('');
      } else {
        toast.error(response?.data?.message || 'Failed to add doctor ok');
      } 
    } catch (error) {
      console.log(error.response?.data);
       toast.error(error?.response?.data?.message || 'Failed to add doctor');
    }

  }

  return (
    <form className='m-5 w-full' onSubmit={handleSubmit}>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-4 text-gray-500'>
          <label htmlFor="doc-img" className="flex flex-col items-center cursor-pointer">
            <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              <img
                className='object-cover w-full h-full'
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt="Upload Area"
              />
            </div>
            <input
              type="file"
              id="doc-img"
              hidden
              accept="image/*"
              onChange={(e) => setDocImg(e.target.files[0])}
            />
          </label>
          <div>
            <p>Upload doctor <br /> picture</p>
            {docImg && (
              <div className="mt-1 text-xs text-gray-600">
                <span className="block">File: {docImg.name}</span>
                <span className="block">Type: {docImg.type}</span>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor name</p>
              <input className='border rounded px-3 py-2' type="text" placeholder='Name' required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input className='border rounded px-3 py-2' type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input className='border rounded px-3 py-2' type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select className='border rounded px-3 py-2' name=""  value={experience} onChange={(e) => setExperience(e.target.value)}>
                <option value="" disabled >Select Experience*</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input className='border rounded px-3 py-2' type="number" placeholder='fees' value={fees} onChange={(e) => setFees(e.target.value)} />
            </div>
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select className='border rounded px-3 py-2' name=""  value={speciality} onChange={(e) => setSpeciality(e.target.value)}>
                <option value="" disabled >Select Speciality*</option>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input className='border rounded px-3 py-2' type="text" placeholder='Education' value={degree} onChange={(e) => setDegree(e.target.value)} />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input className='border rounded px-3 py-2' type="text" placeholder='address 1' value={address1} onChange={(e) => setAddress1(e.target.value)} />
              <input className='border rounded px-3 py-2' type="text" placeholder='address 2' value={address2} onChange={(e) => setAddress2(e.target.value)} />
            </div>
          </div>
        </div>

        <div className='mt-4 mb-2'>
          <p>About Doctor</p>
          <textarea className='w-full px-4 pt-2 border rounded' placeholder='write about doctor' rows="4" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
        </div>

        <button className='bg-primary px-10 py-3 mt-4 text-white rounded-full' type='submit'>Add doctor</button>
      </div>
    </form>
  );
};

export default AddDoctor;