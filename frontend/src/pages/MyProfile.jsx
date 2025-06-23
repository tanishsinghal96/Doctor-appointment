import React, { use } from 'react'
import { useState,useEffect } from 'react'
import { assets } from '../assets/assets';
import useAppContext from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
function MyProfile() {

  const { userData, setUserData, backendUrl, token,fetchUserData } = useAppContext();
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(userData?.image || null);
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'line1' || name === 'line2') {
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the updated userData to your backend
    // using axios:
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('phone', userData.phone);
    formData.append('gender', userData.gender);
    console.log("type of date object is ....-->",typeof userData.dob);
    formData.append('dob', userData.dob);
    formData.append('address',JSON.stringify({ line1:userData.address.line1, line2:userData.address.line2 }));

    if (image && image !== userData.image) {
      formData.append('image', image);
    }
    const updatedData = formData;
    // If image is selected, update it
    try {
      const { data } = await axios.patch(`${backendUrl}/api/v1/user/update-profile`, updatedData, {
        headers: {
          token: token
        }
      });
      if (data.success) {
        toast.success("Profile updated successfully");
        await fetchUserData()
        setIsEdit(false);
        setImage(false);

      }
      else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");

    }


  };

  useEffect(() => {
    // Fetch user data if token is available
   if(userData){
    setImage(userData.image);
   }
   else{
    console.log("userData is not available");
   }
  }, [userData]);     


  if (!userData) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }
 
  return (
    <div style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      background: '#fff'
    }}>


      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {isEdit && (
          <input
            type="file"
            name="image"
            onChange={(e) => { setImage(e.target.files[0]) }}
            placeholder="Image URL"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginBottom: '1rem'
            }}
          />
        )} 
        <img
          src={image instanceof File ? URL.createObjectURL(image) :  userData?.image || assets.profile_pic}
          alt="Profile"
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1rem',
            border: '3px solid #e0e0e0'
          }}
        />

        <h2 style={{ margin: 0 }}>{userData.name}</h2>
        <p style={{ color: '#888', margin: 0 }}>{userData.email}</p>
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={handleSubmit}>
        <div>
          <label style={{ fontWeight: 500 }}>Name</label>
          {isEdit ? (
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: 4 }}
            />
          ) : (
            <div style={{ padding: '8px 0', color: '#333' }}>{userData.name}</div>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Email</label>
          {isEdit ? (
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: 4 }}
            />
          ) : (
            <div style={{ padding: '8px 0', color: '#333' }}>{userData.email}</div>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Phone</label>
          {isEdit ? (
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: 4 }}
            />
          ) : (
            <div style={{ padding: '8px 0', color: '#333' }}>{userData.phone}</div>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Address Line 1</label>
          {isEdit ? (
            <input
              type="text"
              name="line1"
              value={userData.address.line1}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: 4 }}
            />
          ) : (
            <div style={{ padding: '8px 0', color: '#333' }}>{userData.address.line1}</div>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Address Line 2</label>
          {isEdit ? (
            <input
              type="text"
              name="line2"
              value={userData.address.line2}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: 4 }}
            />
          ) : (
            <div style={{ padding: '8px 0', color: '#333' }}>{userData.address.line2}</div>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Gender</label>
          {isEdit ? (
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: 4 }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <div style={{ padding: '8px 0', color: '#333' }}>{userData.gender}</div>
          )}
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Date of Birth</label>
          {isEdit ? (
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={()=>(onchange,console.log("date changed",typeof userData.dob,userData.dob))}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: 4 }}
            />
          ) : (
            <div style={{ padding: '8px 0', color: '#333' }}>{userData.dob}</div>
          )}
        </div>

<button
  type={isEdit ? 'submit' : 'button'}
  onClick={(e) => {
    if (!isEdit) {
      e.preventDefault(); // Prevent form submission when switching to edit mode
      setIsEdit(true);
    }
  }}
  style={{
    marginTop: '1.5rem',
    padding: '10px 0',
    background: isEdit ? '#1976d2' : '#43a047',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }}
>
  {isEdit ? 'Save' : 'Edit'}
</button>

      </form>
    </div>
  );
}


export default MyProfile
