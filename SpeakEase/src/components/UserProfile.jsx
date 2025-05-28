import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ userId, onClose }) => {
  const [userDetails, setUserDetails] = useState({});
  const [originalUserDetails, setOriginalUserDetails] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Fetch user details when component mounts
    axios.get(`http://localhost:4000/getuser/${userId}`)
      .then(response => {
        setUserDetails(response.data);
        setOriginalUserDetails(response.data); // Save the original details
      })
      .catch(error => console.error('Error fetching user details:', error));
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSave = () => {
    if (!userDetails.name || !userDetails.email) {
      alert('Please fill all the fields.');
      return;
    }
    axios.put(`http://localhost:4000/updateuser/${userId}`, userDetails)
      .then(result => {
        console.log(result);
        if (result.data.message === "Email already exists") {
          window.alert("Email already exists. Please use another email.");
        } else if (result.data.message === "Username already exists") {
          window.alert("Username already exists. Please use another username.");
        } else {
          setUserDetails(result.data);
          setOriginalUserDetails(result.data); // Update original details to the new saved details
          setEditMode(false); // Exit edit mode
        }
      })
      .catch(error => {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          window.alert(error.response.data.message);
        } else {
          window.alert("Something went wrong. Please try again later.");
        }
      });
  };

  return (
    <div className="user-profile-popup">
      <button onClick={onClose}>Close</button>
      {editMode ? (
        <>
          <input
            type="text"
            name="name"
            value={userDetails.name || ''}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            value={userDetails.email || ''}
            onChange={handleInputChange}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default UserProfile;
