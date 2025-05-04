import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Icons
import { 
  FaUser, 
  FaHistory, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaHeart, 
  FaEdit, 
  FaTrashAlt, 
  FaPlus, 
  FaChevronRight,
  FaShoppingBag
} from 'react-icons/fa';

// Sample user data
const userData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  memberSince: 'June 2021',
  loyaltyPoints: 1250,
  personalInfo: {
    fullName: 'Alexander Johnson',
    dob: '1990-05-15',
    gender: 'Male',
    address: '123 Main Street, Apt 4B, New York, NY 10001'
  },
  orders: [
    {
      id: 'ORD-12345',
      date: '2023-05-10',
      status: 'Delivered',
      total: 245.99,
      items: [
        {
          id: 1,
          name: 'Gradient Graphic T-shirt',
          price: 120,
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        },
        {
          id: 3,
          name: 'Women\'s Floral Dress',
          price: 125.99,
          image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        }
      ]
    },
    {
      id: 'ORD-12346',
      date: '2023-04-22',
      status: 'Delivered',
      total: 185.50,
      items: [
        {
          id: 5,
          name: 'Modern Minimalist Shirt',
          price: 125,
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        },
        {
          id: 8,
          name: 'Lightweight Jacket',
          price: 60.50,
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        }
      ]
    },
    {
      id: 'ORD-12347',
      date: '2023-05-28',
      status: 'Processing',
      total: 320.75,
      items: [
        {
          id: 6,
          name: 'Women\'s Summer Dress',
          price: 145,
          image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        },
        {
          id: 4,
          name: 'Women\'s Blazer',
          price: 175.75,
          image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        }
      ]
    }
  ],
  addresses: [
    {
      id: 1,
      type: 'Home',
      name: 'Alex Johnson',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      name: 'Alex Johnson',
      address: '456 Business Ave, Suite 200',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false
    }
  ],
  paymentMethods: [
    {
      id: 1,
      type: 'Visa',
      cardNumber: '**** **** **** 4567',
      expiryDate: '05/25',
      cardholderName: 'Alex Johnson',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      cardNumber: '**** **** **** 8901',
      expiryDate: '09/24',
      cardholderName: 'Alex Johnson',
      isDefault: false
    }
  ],
  wishlist: [
    {
      id: 1,
      name: 'Gradient Graphic T-shirt',
      price: 120,
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    },
    {
      id: 3,
      name: 'Women\'s Floral Dress',
      price: 135,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    },
    {
      id: 5,
      name: 'Modern Minimalist Shirt',
      price: 125,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    }
  ]
};

const UserProfile: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('personal');
  
  // State for edit modes
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);
  
  // Animation variants
  // const fadeIn = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { 
  //     opacity: 1, 
  //     y: 0,
  //     transition: { duration: 0.4 }
  //   }
  // };
  
  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };
  
  // Tab content components
  const PersonalInfoTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Personal Information</h2>
        <button 
          className="text-gray-600 hover:text-black transition-colors"
          onClick={() => setEditingPersonal(!editingPersonal)}
        >
          <FaEdit className="h-5 w-5" />
        </button>
      </div>
      
      {editingPersonal ? (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              defaultValue={userData.personalInfo.fullName}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input 
              type="date" 
              defaultValue={userData.personalInfo.dob}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select 
              defaultValue={userData.personalInfo.gender}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              defaultValue={userData.email}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input 
              type="tel" 
              defaultValue={userData.phone}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div className="flex space-x-4">
            <button 
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => setEditingPersonal(false)}
            >
              Cancel
            </button>
            <button 
              type="button"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setEditingPersonal(false)}
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1">{userData.personalInfo.fullName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
              <p className="mt-1">{new Date(userData.personalInfo.dob).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Gender</h3>
              <p className="mt-1">{userData.personalInfo.gender}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{userData.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1">{userData.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1">{userData.personalInfo.address}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
  
  const OrderHistoryTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <h2 className="text-xl font-bold">Order History</h2>
      
      {userData.orders.map((order) => (
        <motion.div 
          key={order.id}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h3 className="font-medium">Order #{order.id}</h3>
              <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="mt-2 md:mt-0">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
              <p className="text-sm font-medium mt-1">${order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="w-12 h-12 rounded-md overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium truncate max-w-[150px]">{item.name}</p>
                  <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Link 
              to={`/orders/${order.id}`}
              className="text-sm font-medium text-black hover:underline flex items-center"
            >
              View Details <FaChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
  
  const AddressesTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Saved Addresses</h2>
        <motion.button 
          className="flex items-center text-sm font-medium text-black hover:text-gray-700 transition-colors"
          onClick={() => setAddingAddress(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-1 h-3 w-3" /> Add New Address
        </motion.button>
      </div>
      
      {addingAddress && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="font-medium mb-4">Add New Address</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black">
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-700">Set as default address</span>
              </label>
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button 
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setAddingAddress(false)}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                onClick={() => setAddingAddress(false)}
              >
                Save Address
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      <div className="space-y-4">
        {userData.addresses.map((address) => (
          <motion.div 
            key={address.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${address.isDefault ? 'border-black' : 'border-transparent'}`}
          >
            {editingAddress === address.id ? (
              <div className="p-2">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                    <select 
                      defaultValue={address.type}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={address.name}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input 
                      type="text" 
                      defaultValue={address.address}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input 
                      type="text" 
                      defaultValue={address.city}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input 
                      type="text" 
                      defaultValue={address.state}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input 
                      type="text" 
                      defaultValue={address.zip}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input 
                      type="text" 
                      defaultValue={address.country}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      defaultValue={address.phone}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        defaultChecked={address.isDefault}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" 
                      />
                      <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                    </label>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button 
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      onClick={() => setEditingAddress(null)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                      onClick={() => setEditingAddress(null)}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{address.type}</h3>
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1">{address.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                    <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="text-gray-600 hover:text-black transition-colors"
                      onClick={() => setEditingAddress(address.id)}
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-red-500 transition-colors">
                      <FaTrashAlt className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
  
  const PaymentMethodsTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Payment Methods</h2>
        <motion.button 
          className="flex items-center text-sm font-medium text-black hover:text-gray-700 transition-colors"
          onClick={() => setAddingPayment(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-1 h-3 w-3" /> Add New Card
        </motion.button>
      </div>
      
      {addingPayment && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="font-medium mb-4">Add New Payment Method</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input type="text" placeholder="**** **** **** ****" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input type="text" placeholder="***" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black" />
              </div>
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-700">Set as default payment method</span>
              </label>
            </div>
            <div className="flex space-x-4">
              <button 
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setAddingPayment(false)}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                onClick={() => setAddingPayment(false)}
              >
                Save Card
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      <div className="space-y-4">
        {userData.paymentMethods.map((payment) => (
          <motion.div 
            key={payment.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${payment.isDefault ? 'border-black' : 'border-transparent'}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{payment.type}</h3>
                  {payment.isDefault && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{payment.cardNumber}</p>
                <p className="text-sm text-gray-600">Expires: {payment.expiryDate}</p>
                <p className="text-sm text-gray-600 mt-1">{payment.cardholderName}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-600 hover:text-black transition-colors">
                  <FaEdit className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:text-red-500 transition-colors">
                  <FaTrashAlt className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
  
  const WishlistTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <h2 className="text-xl font-bold">My Wishlist</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userData.wishlist.map((item) => (
          <motion.div 
            key={item.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white rounded-xl overflow-hidden shadow-sm"
          >
            <div className="relative h-48">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-2 right-2 text-red-500 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <FaHeart className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
              <p className="font-bold text-gray-900 mb-3">${item.price}</p>
              <button className="w-full py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center">
                <FaShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <Link 
          to="/wishlist" 
          className="text-black font-medium hover:underline"
        >
          View All Wishlist Items
        </Link>
      </div>
    </motion.div>
  );
  
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Summary */}
          <div className="lg:w-80">
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-sm sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <div className="inline-block relative">
                  <img 
                    src={userData.profileImage} 
                    alt={userData.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  <motion.button 
                    className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEdit className="h-3 w-3" />
                  </motion.button>
                </div>
                <h2 className="text-xl font-bold mt-4">{userData.name}</h2>
                <p className="text-gray-600 text-sm">{userData.email}</p>
                <p className="text-gray-600 text-sm">{userData.phone}</p>
              </div>
              
              {/* <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Loyalty Points</p>
                    <p className="text-lg font-bold">{userData.loyaltyPoints}</p>
                  </div>
                  <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
                    GOLD
                  </div>
                </div>
              </div> */}
              
              <p className="text-sm text-gray-500 text-center mb-6">
                Member since {userData.memberSince}
              </p>
              
              <motion.button 
                className="w-full py-2 border border-black text-black rounded-md font-medium hover:bg-black hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit Profile
              </motion.button>
              
              {/* Navigation Tabs */}
              <div className="mt-8 space-y-2">
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                    activeTab === 'personal' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  <FaUser className="mr-3 h-4 w-4" />
                  <span>Personal Information</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                    activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <FaHistory className="mr-3 h-4 w-4" />
                  <span>Order History</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                    activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <FaMapMarkerAlt className="mr-3 h-4 w-4" />
                  <span>Saved Addresses</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                    activeTab === 'payment' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('payment')}
                >
                  <FaCreditCard className="mr-3 h-4 w-4" />
                  <span>Payment Methods</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                    activeTab === 'wishlist' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('wishlist')}
                >
                  <FaHeart className="mr-3 h-4 w-4" />
                  <span>Wishlist</span>
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Tab Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && <PersonalInfoTab key="personal" />}
              {activeTab === 'orders' && <OrderHistoryTab key="orders" />}
              {activeTab === 'addresses' && <AddressesTab key="addresses" />}
              {activeTab === 'payment' && <PaymentMethodsTab key="payment" />}
              {activeTab === 'wishlist' && <WishlistTab key="wishlist" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;