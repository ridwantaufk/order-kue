import React, { useEffect, useState } from 'react';
import {
  Calendar,
  User,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Eye,
  EyeOff,
  Edit3,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import { useRef } from 'react';

// Mock toast for demonstration - replace with actual toast import
const toast = (options) => {
  console.log('Toast:', options);
  // Create a simple toast notification
  const toastElement = document.createElement('div');
  toastElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    options.status === 'success'
      ? 'bg-green-500'
      : options.status === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500'
  } text-white`;
  toastElement.innerHTML = `
    <div class="font-semibold">${options.title}</div>
    <div class="text-sm">${options.description}</div>
  `;
  document.body.appendChild(toastElement);

  setTimeout(() => {
    document.body.removeChild(toastElement);
  }, options.duration || 3000);
};

export default function ModernUserProfile() {
  const [userData, setUserData] = useState({
    id: null,
    username: '',
    name: '',
    age: null,
    birth_date: null,
    phone_number: '',
    address: '',
    role: '',
    created_at: '',
    updated_at: '',
    password: '',
    editing: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({}); // Di dalam komponen ProfileField, tambahkan:
  const textareaRef = useRef(null);

  // Required fields based on database schema
  const requiredFields = ['name', 'username', 'password', 'role'];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('user_id') || '6';
        const token = localStorage.getItem('token') || 'mock-token';

        const response = await axios.get(
          `${
            process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'
          }/api/users/privateUser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );

        console.log('responseData : ', response.data);

        // Process data and set defaults for null/empty values
        const processedData = {
          id: response.data.id || null,
          username: response.data.username || '',
          name: response.data.name || '',
          age: response.data.age || null,
          birth_date: response.data.birth_date || null,
          phone_number: response.data.phone_number || '',
          address: response.data.address || '',
          role: response.data.role || '',
          created_at: response.data.created_at || '',
          updated_at: response.data.updated_at || '',
          password: response.data.password || '',
          editing: null,
        };

        setUserData(processedData);
        setOriginalData(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
        toast({
          title: 'Error',
          description: 'Gagal memuat data pengguna',
          status: 'error',
          duration: 3000,
        });
      }
    };

    fetchUserData();
  }, []);

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    const hari = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      timeZone: 'Asia/Jakarta',
    }).format(date);
    const tanggal = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(date);
    const bulan = new Intl.DateTimeFormat('id-ID', {
      month: 'long',
      timeZone: 'Asia/Jakarta',
    }).format(date);
    const tahun = new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(date);

    const jam = date
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
      })
      .replace(':', '.');

    return `${hari}, ${tanggal} ${bulan} ${tahun} pukul ${jam}`;
  };

  const formatInputDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const validateField = (field, value) => {
    const errors = { ...validationErrors };

    if (requiredFields.includes(field)) {
      if (!value || value.toString().trim() === '') {
        errors[field] = 'Field ini wajib diisi';
      } else {
        delete errors[field];
      }
    }

    if (field === 'username' && value) {
      if (value.length < 3) {
        errors[field] = 'Username minimal 3 karakter';
      } else if (value.length > 50) {
        errors[field] = 'Username maksimal 50 karakter';
      } else {
        delete errors[field];
      }
    }

    if (field === 'name' && value) {
      if (value.length > 100) {
        errors[field] = 'Nama maksimal 100 karakter';
      } else {
        delete errors[field];
      }
    }

    if (field === 'phone_number' && value) {
      if (value.length > 20) {
        errors[field] = 'Nomor telepon maksimal 20 karakter';
      } else {
        delete errors[field];
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = (field) => {
    // For password field, start with empty value for editing
    if (field === 'password') {
      setUserData({ ...userData, editing: field, password: '' });
    } else {
      setUserData({ ...userData, editing: field });
    }
  };

  const handleCancel = (field) => {
    setUserData({
      ...userData,
      [field]: originalData[field],
      editing: null,
    });
    // Clear validation errors for this field
    const errors = { ...validationErrors };
    delete errors[field];
    setValidationErrors(errors);
  };

  const handleSave = async (field) => {
    const value = userData[field];

    // Validate field
    if (!validateField(field, value)) {
      return;
    }

    try {
      const userId = userData.id || localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      // Prepare update data - send only the field being updated plus required fields
      const updatedData = {};

      // Handle different field updates
      if (field === 'birth_date') {
        updatedData.birth_date = value || null;
        const calculatedAge = calculateAge(value);
        updatedData.age = calculatedAge;
      } else if (field === 'password') {
        // Only send password if it's not empty
        if (value && value.trim() !== '') {
          updatedData.password = value;
        } else {
          toast({
            title: 'Error',
            description: 'Password tidak boleh kosong',
            status: 'error',
            duration: 3000,
          });
          return;
        }
      } else {
        // For other fields, send the updated value
        updatedData[field] = value || null;
      }

      // Always include all current values to prevent null overwrites
      const completeData = {
        name: field === 'name' ? value : userData.name,
        username: field === 'username' ? value : userData.username,
        age: field === 'birth_date' ? calculateAge(value) : userData.age,
        birth_date:
          field === 'birth_date' ? value || null : userData.birth_date,
        phone_number:
          field === 'phone_number' ? value || null : userData.phone_number,
        address: field === 'address' ? value || null : userData.address,
        role: field === 'role' ? value : userData.role,
      };

      // Add password only if being updated
      if (field === 'password' && value && value.trim() !== '') {
        completeData.password = value;
      }

      console.log('req.body update : ', completeData);

      const response = await axios.put(
        `${
          process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'
        }/api/users/privateUser/${userId}`,
        completeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Update response:', response.data);

      toast({
        title: 'Berhasil Disimpan',
        description: `Field ${field} telah diperbarui.`,
        status: 'success',
        duration: 2000,
      });

      // Update local state with new values
      const newUserData = { ...userData, editing: null };
      if (field === 'birth_date') {
        const calculatedAge = calculateAge(value);
        newUserData.age = calculatedAge;
        newUserData.birth_date = value;
      } else {
        newUserData[field] = value;
      }

      setUserData(newUserData);
      setOriginalData(newUserData);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      console.error('Error details:', error.response?.data);

      const errorMessage =
        error.response?.data?.message || `Gagal memperbarui ${field}`;

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleChange = (field, value) => {
    let processedValue = value;

    if (field === 'phone_number') {
      // Only allow numbers
      processedValue = value.replace(/\D/g, '');
    } else if (field === 'birth_date') {
      processedValue = value;
      // Calculate age when birth date changes
      const age = calculateAge(value);
      setUserData((prev) => ({ ...prev, [field]: processedValue, age }));
      return;
    }

    setUserData({ ...userData, [field]: processedValue });

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      const errors = { ...validationErrors };
      delete errors[field];
      setValidationErrors(errors);
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(field);
    } else if (e.key === 'Escape') {
      handleCancel(field);
    }
  };

  const ProfileField = ({
    label,
    field,
    icon: Icon,
    type = 'text',
    options = null,
    readonly = false,
  }) => {
    const isEditing = userData.editing === field;
    const value = userData[field];
    const isRequired = requiredFields.includes(field);
    const hasError = validationErrors[field];

    const renderEditingField = () => {
      if (readonly) return null;

      if (type === 'select') {
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            autoFocus
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }

      if (type === 'textarea') {
        return (
          <textarea
            ref={textareaRef}
            value={value || ''}
            onChange={(e) => {
              const cursorPosition = e.target.selectionStart;
              handleChange(field, e.target.value);

              // Restore cursor position after state update
              setTimeout(() => {
                if (textareaRef.current) {
                  textareaRef.current.setSelectionRange(
                    cursorPosition,
                    cursorPosition,
                  );
                }
              }, 0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel(field);
              }
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            autoFocus
            placeholder="Masukkan alamat lengkap..."
          />
        );
      }

      if (type === 'date') {
        return (
          <input
            type="date"
            value={formatInputDate(value)}
            onChange={(e) => handleChange(field, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            autoFocus
          />
        );
      }

      return (
        <input
          type={type}
          value={field === 'password' && isEditing ? value : value || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, field)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
            hasError ? 'border-red-500' : 'border-gray-300'
          }`}
          autoFocus
          placeholder={`Masukkan ${label.toLowerCase()}...`}
        />
      );
    };

    const renderDisplayValue = () => {
      if (field === 'password') {
        if (!value) return '-';
        return showPassword ? value : '••••••••';
      }
      if (field === 'created_at' || field === 'updated_at') {
        return formatDate(value);
      }
      if (field === 'birth_date' && value) {
        return new Date(value).toLocaleDateString('id-ID');
      }
      if (field === 'age' && value !== null) {
        return `${value} tahun`;
      }

      // Return '-' for null, empty, or undefined values
      if (value === null || value === undefined || value === '') {
        return '-';
      }

      return value;
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center">
                {label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {hasError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {hasError}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {field === 'password' && !isEditing && (
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}

            {!readonly && !isEditing && (
              <button
                onClick={() => handleEdit(field)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            {renderEditingField()}
            <div className="flex space-x-2">
              <button
                onClick={() => handleSave(field)}
                disabled={hasError}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                  hasError
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Simpan</span>
              </button>
              <button
                onClick={() => handleCancel(field)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Batal</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-700 font-medium">
            {renderDisplayValue()}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-xl from-blue-50 via-white to-purple-50">
      {/* Header with Banner */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Profile Avatar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/8.x/icons/svg?seed=${
                userData.id || '6'
              }`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {userData.name || '-'}
            </h1>
            <p className="text-gray-600 mb-1">{userData.role || '-'}</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>ID: {userData.id || '-'}</span>
              <span>•</span>
              <span>Status: Aktif</span>
            </div>
          </div>

          {/* Profile Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Username" field="username" icon={User} />

            <ProfileField label="Nama Lengkap" field="name" icon={User} />

            <ProfileField
              label="Tanggal Lahir"
              field="birth_date"
              icon={Calendar}
              type="date"
            />

            <ProfileField
              label="Umur"
              field="age"
              icon={Calendar}
              readonly={true}
            />

            <ProfileField
              label="Nomor Telepon"
              field="phone_number"
              icon={Phone}
              type="tel"
            />

            <ProfileField
              label="Jabatan"
              field="role"
              icon={Briefcase}
              type="select"
              options={['Admin', 'Developer', 'Super User']}
            />

            <div className="md:col-span-2">
              <ProfileField
                label="Alamat"
                field="address"
                icon={MapPin}
                type="textarea"
              />
            </div>

            <ProfileField
              label="Tanggal Dibuat"
              field="created_at"
              icon={Clock}
              readonly={true}
            />

            <ProfileField
              label="Terakhir Diperbarui"
              field="updated_at"
              icon={Clock}
              readonly={true}
            />

            <div className="md:col-span-2">
              <ProfileField
                label="Kata Sandi"
                field="password"
                icon={User}
                type="password"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
