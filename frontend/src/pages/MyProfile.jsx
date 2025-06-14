import React from 'react'
import { useState } from 'react'
import {assets} from '../assets/assets';
function MyProfile() {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.profile_pic,
    email: 'richardjameswap@gmail.com',
    phone: '+1 123 456 7890',
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Church Road, London"
    },
    gender: 'Male',
    dob: '2000-01-20'
  });

  const [isEdit, setIsEdit] = useState(false);
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
        <img
          src={userData.image}
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
       
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={e => e.preventDefault()}>
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
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: 4 }}
            />
          ) : (
            <div style={{ padding: '8px 0', color: '#333' }}>{userData.dob}</div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsEdit(!isEdit)}
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
