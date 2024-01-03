import React, { useEffect, useState } from 'react';
import userservice from '../Appwrite/user';
import { useSelector } from 'react-redux';
import service from '../Appwrite/post';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const myId = useSelector((state) => state.auth.userData?.$id);

  useEffect(() => {
    async function fetchProfileId() {
      try {
        const user = await userservice.getUser(myId);
        setprofileId(user.documents[0].profileId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    fetchProfileId();
  }, [myId]);

  const [formData, setFormData] = useState({
    userName: '',
    profileImg: '',
    bio: '',
  });
  const [profileId, setprofileId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImg = (e) => {
    try {
      const imgFile = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        profileImg: imgFile,
      }));
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await service.deleteFile(profileId);

      const newProfileImage = await service.createFile(formData.profileImg);
      const newProfileImageId = newProfileImage.$id;

      const updatedUser = await userservice.updateProfile({
        name: formData.userName,
        bio: formData.bio,
        documentId: myId,
        profileId: newProfileImageId,
      });

      console.log(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle the error appropriately, e.g., show a user-friendly message
    } finally {
      // Use navigate from react-router-dom to go back
      navigate(-1);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userName" className="block text-sm font-medium text-gray-600">
          Name:
        </label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          className="w-full border rounded-md p-2 mb-4"
        />

<label htmlFor="profileImg" className="block text-sm font-medium text-gray-600 mb-2">
          Profile Image:
          <div className="bg-gray-200 p-4 rounded-full text-center">
            {formData.profileImg ? 'Image Selected' : 'Choose an Image'}
          </div>
          <input
            type="file"
            
            id="profileImg"
            name="profileImg"
            onChange={handleImg}
            className="w-full hidden border rounded p-2 mt-2"
          />
        </label>

        <label htmlFor="bio" className="block text-sm font-medium text-gray-600">
          Bio:
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border overflow-scroll rounded-md p-2 mb-4"
        />

        <button
          type="submit"
          className="  py-2 px-4 rounded-full bg-blue-500 text-white  focus:outline-none"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
