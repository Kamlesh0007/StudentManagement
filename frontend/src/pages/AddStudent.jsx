import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/api';
import toast from 'react-hot-toast';
import { FiCamera, FiCheckCircle, FiX } from 'react-icons/fi';

function AddStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    date_of_birth: '',
    gender: 'Male',
    course: '',
    year: '1',
    address: ''
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email';

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile_number)) newErrors.mobile_number = 'Please enter a valid 10-digit mobile number';

    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    else {
      const dob = new Date(formData.date_of_birth);
      const today = new Date();
      const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 15 || age > 60) newErrors.date_of_birth = 'Age must be between 15 and 60 years';
    }

    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (formData.address.length < 10) newErrors.address = 'Address must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
  if (key !== "photo_url") {
    if (key === "date_of_birth") {
      data.append(
        key,
        value ? value.split("T")[0] : ""
      );
    } else {
      data.append(key, value);
    }
  }
});
      if (photo) {
        data.append('photo', photo);
      }

      await studentService.create(data);
      toast.success('Student added successfully!');
      navigate('/students');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Add New Student</div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Photo Upload */}
        <div className="form-group form-group-full" style={{ marginBottom: '24px' }}>
          <label>Student Photo</label>
          <div className="photo-upload-area">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
              id="photo-input"
            />
            <label htmlFor="photo-input" style={{ cursor: 'pointer', width: '100%' }}>
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="preview" className="photo-preview" />
                  <div className="photo-hint">Click to change photo</div>
                </>
              ) : (
                <>
                  <div className="photo-placeholder"><FiCamera /></div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Click to upload photo</div>
                  <div className="photo-hint">JPEG, PNG, WebP • Max 5MB</div>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="form-grid">
          {/* Name */}
          <div className="form-group">
            <label className="required">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-msg">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="required">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label className="required">Mobile Number</label>
            <input
              type="tel"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleInputChange}
              placeholder="9876543210"
              className={errors.mobile_number ? 'error' : ''}
            />
            {errors.mobile_number && <div className="error-msg">{errors.mobile_number}</div>}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label className="required">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className={errors.date_of_birth ? 'error' : ''}
            />
            {errors.date_of_birth && <div className="error-msg">{errors.date_of_birth}</div>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="required">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={errors.gender ? 'error' : ''}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <div className="error-msg">{errors.gender}</div>}
          </div>

          {/* Course */}
          <div className="form-group">
            <label className="required">Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              placeholder="e.g., Bachelor of Technology"
              className={errors.course ? 'error' : ''}
            />
            {errors.course && <div className="error-msg">{errors.course}</div>}
          </div>

          {/* Year */}
          <div className="form-group">
            <label className="required">Year of Study</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className={errors.year ? 'error' : ''}
            >
           {[1, 2, 3, 4, 5, 6].map((y) => (
  <option key={y} value={y}>
    {y === 1
      ? "1st Year"
      : y === 2
      ? "2nd Year"
      : y === 3
      ? "3rd Year"
      : `${y}th Year`}
  </option>
))}
            </select>
            {errors.year && <div className="error-msg">{errors.year}</div>}
          </div>

          {/* Address */}
          <div className="form-group form-group-full">
            <label className="required">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter full residential address..."
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <div className="error-msg">{errors.address}</div>}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/students')}
            disabled={loading}
          >
            <FiX /> Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            <FiCheckCircle /> {loading ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudent;