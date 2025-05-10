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
  FaShoppingBag,
  FaCrown,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaBox,
  FaTruck,
  FaStar,
  FaPercent
} from 'react-icons/fa';

// Sample user data
const userData = {
  name: 'Sai Kiran Naik',
  email: 'saikirannaik03@gmail.com',
  phone: '+91 8*****48',
  profileImage: 'Kiran.jpg',
  memberSince: 'June 2021',
  loyaltyPoints: 1250,
  personalInfo: {
    fullName: 'K Sai Kiran Naik',
    dob: '2003-12-03',
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
  
  // Enhanced animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    }
  };

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
  
  // Tab content components
  const PersonalInfoTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          variants={cardVariants}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaBox className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">Active Orders</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">3</h3>
          <p className="text-sm text-gray-500">2 orders in transit</p>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaTruck className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Total Orders</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">12</h3>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaStar className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-yellow-600">Loyalty Points</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">1,250</h3>
          <p className="text-sm text-gray-500">Gold member status</p>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaPercent className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">Discount</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">15%</h3>
          <p className="text-sm text-gray-500">Available on next purchase</p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <FaBox className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Order #ORD-12347</p>
              <p className="text-sm text-gray-500">Processing - Expected delivery in 2 days</p>
            </div>
            <span className="text-sm text-purple-600 font-medium">₹320.75</span>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <FaTruck className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Order #ORD-12346</p>
              <p className="text-sm text-gray-500">Delivered on April 22, 2023</p>
            </div>
            <span className="text-sm text-blue-600 font-medium">₹185.50</span>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-lg mr-4">
              <FaStar className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Loyalty Points Earned</p>
              <p className="text-sm text-gray-500">+50 points from your last purchase</p>
            </div>
            <span className="text-sm text-yellow-600 font-medium">+50</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          variants={cardVariants}
          className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-6 text-white"
        >
          <h3 className="font-bold mb-2">Track Your Order</h3>
          <p className="text-sm opacity-90 mb-4">Check the status of your recent orders</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
            Track Now
          </button>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white"
        >
          <h3 className="font-bold mb-2">View Wishlist</h3>
          <p className="text-sm opacity-90 mb-4">Check your saved items and favorites</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
            View Items
          </button>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white"
        >
          <h3 className="font-bold mb-2">Special Offers</h3>
          <p className="text-sm opacity-90 mb-4">Exclusive deals for gold members</p>
          <button className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
            View Offers
          </button>
        </motion.div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
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
      </div>
    </motion.div>
  );
  
  const OrderHistoryTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white flex flex-col items-center justify-center">
          <FaHistory className="h-8 w-8 mb-2" />
          <div className="text-lg font-bold">{userData.orders.length}</div>
          <div className="text-sm opacity-80">Total Orders</div>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white flex flex-col items-center justify-center">
          <FaBox className="h-8 w-8 mb-2" />
          <div className="text-lg font-bold">₹{userData.orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</div>
          <div className="text-sm opacity-80">Total Spent</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-6 text-white flex flex-col items-center justify-center">
          <FaTruck className="h-8 w-8 mb-2" />
          <div className="text-lg font-bold">{userData.orders.filter(o => o.status !== 'Delivered').length}</div>
          <div className="text-sm opacity-80">Active Orders</div>
        </div>
      </div>
      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userData.orders.map((order) => (
          <motion.div 
            key={order.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-lg">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status === 'Delivered' ? <FaBox className="mr-1" /> : <FaTruck className="mr-1" />} {order.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mb-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center bg-gray-50 rounded-lg p-2">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="ml-2">
                    <p className="text-sm font-medium truncate max-w-[120px]">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-bold text-gray-900">₹{order.total.toFixed(2)}</span>
              <div className="flex gap-2">
                {order.status !== 'Delivered' && (
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors">
                    Track
                  </button>
                )}
                <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-xs font-medium hover:bg-gray-300 transition-colors">
                  Reorder
                </button>
                <Link 
                  to={`/orders/${order.id}`}
                  className="text-xs font-medium text-black hover:underline flex items-center"
                >
                  Details <FaChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
  
  const AddressesTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Saved Addresses</h2>
        <motion.button 
          className="flex items-center text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 rounded-lg shadow hover:from-indigo-500 hover:to-purple-500 transition-colors"
          onClick={() => setAddingAddress(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-2 h-4 w-4" /> Add New Address
        </motion.button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userData.addresses.map((address) => (
          <motion.div 
            key={address.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`bg-white rounded-xl p-6 shadow-sm border-l-4 flex flex-col justify-between relative ${address.isDefault ? 'border-indigo-500' : 'border-transparent'}`}
          >
            <div className="flex items-center mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mr-2 ${
                address.type === 'Home' ? 'bg-blue-100 text-blue-800' : address.type === 'Work' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                <FaMapMarkerAlt className="mr-1" /> {address.type}
              </span>
              {address.isDefault && (
                <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-semibold">
                  Default
                </span>
              )}
            </div>
            <div className="mb-2">
              <p className="font-medium">{address.name}</p>
              <p className="text-sm text-gray-600">{address.address}</p>
              <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
              <p className="text-sm text-gray-600">{address.country}</p>
              <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
            </div>
            <div className="flex gap-2 mt-2">
              {!address.isDefault && (
                <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors">
                  Set as Default
                </button>
              )}
              <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-xs font-medium hover:bg-gray-300 transition-colors">
                Copy Address
              </button>
              <button className="text-gray-600 hover:text-red-500 transition-colors">
                <FaTrashAlt className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {/* Add New Address Card */}
        {addingAddress && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm col-span-full"
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
      </div>
    </motion.div>
  );
  
  const PaymentMethodsTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Payment Methods</h2>
        <motion.button 
          className="flex items-center text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 rounded-lg shadow hover:from-indigo-500 hover:to-purple-500 transition-colors"
          onClick={() => setAddingPayment(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="mr-2 h-4 w-4" /> Add New Card
        </motion.button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userData.paymentMethods.map((payment) => (
          <motion.div 
            key={payment.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`bg-white rounded-xl p-6 shadow-sm border-l-4 flex flex-col justify-between relative ${payment.isDefault ? 'border-indigo-500' : 'border-transparent'}`}
          >
            <div className="flex items-center mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mr-2 ${
                payment.type === 'Visa' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
              }`}>
                <FaCreditCard className="mr-1" /> {payment.type}
              </span>
              {payment.isDefault && (
                <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-semibold">
                  Default
                </span>
              )}
            </div>
            <div className="mb-2">
              <p className="font-medium">{payment.cardNumber}</p>
              <p className="text-sm text-gray-600">Expires: {payment.expiryDate}</p>
              <p className="text-sm text-gray-600 mt-1">{payment.cardholderName}</p>
            </div>
            <div className="flex gap-2 mt-2">
              {!payment.isDefault && (
                <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors">
                  Set as Default
                </button>
              )}
              <button className="text-gray-600 hover:text-red-500 transition-colors">
                <FaTrashAlt className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {/* Add New Card Card */}
        {addingPayment && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm col-span-full"
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
      </div>
    </motion.div>
  );
  
  const WishlistTab = () => (
    <motion.div 
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData.wishlist.map((item) => (
          <motion.div 
            key={item.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
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
              {/* Example badge for sale/stock */}
              <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                <p className="font-bold text-gray-900 mb-3">₹{item.price}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="w-full py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
                  <FaShoppingBag className="mr-2 h-4 w-4" />
                  Move to Cart
                </button>
                <button className="w-full py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors flex items-center justify-center">
                  <FaTrashAlt className="mr-2 h-4 w-4" />
                  Remove
                </button>
              </div>
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
    <motion.div 
      className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen pt-24 pb-16"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Summary */}
          <div className="lg:w-96">
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <div className="inline-block relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={userData.profileImage} 
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.button 
                    className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEdit className="h-4 w-4" />
                  </motion.button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-gray-600">{userData.email}</p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <FaCrown className="mr-1" /> Gold Member
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {userData.loyaltyPoints} Points
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 mb-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Member since</p>
                    <p className="font-semibold">{userData.memberSince}</p>
                  </div>
                  <FaCrown className="h-8 w-8 opacity-90" />
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="space-y-2">
                <button 
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 ${
                    activeTab === 'personal' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  <FaUser className={`mr-3 h-5 w-5 ${activeTab === 'personal' ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">Personal Information</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 ${
                    activeTab === 'orders' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <FaHistory className={`mr-3 h-5 w-5 ${activeTab === 'orders' ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">Order History</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 ${
                    activeTab === 'addresses' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <FaMapMarkerAlt className={`mr-3 h-5 w-5 ${activeTab === 'addresses' ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">Saved Addresses</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 ${
                    activeTab === 'payment' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => setActiveTab('payment')}
                >
                  <FaCreditCard className={`mr-3 h-5 w-5 ${activeTab === 'payment' ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">Payment Methods</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 ${
                    activeTab === 'wishlist' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => setActiveTab('wishlist')}
                >
                  <FaHeart className={`mr-3 h-5 w-5 ${activeTab === 'wishlist' ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">Wishlist</span>
                </button>
              </div>

              {/* Additional Actions */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <button className="w-full flex items-center justify-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                  <FaBell className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="font-medium">Notifications</span>
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mt-2">
                  <FaCog className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="font-medium">Settings</span>
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-2">
                  <FaSignOutAlt className="mr-2 h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
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
    </motion.div>
  );
};

export default UserProfile;