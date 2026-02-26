import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom'; // Thay useNavigate bằng useHistory
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser, updateProfile } from '../services/api';
import { fetchUserStats, redeemPoints, getUserOrders, cancelOrder } from '../services/userService'; // Import từ userService mới tạo
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { isDark } = useTheme();
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState({
    orderCount: 0,
    totalPoints: 0,
    averageRating: 0,
    tier: 'bronze'
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const history = useHistory(); // Sử dụng useHistory thay vì useNavigate

  // 1. Khai báo tất cả state trước
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    is_default: false
  });
  const [addressError, setAddressError] = useState(null);
  const [addressSuccess, setAddressSuccess] = useState(false);

  // 2. Định nghĩa tất cả các hàm callback trước khi sử dụng
  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setAddressesLoading(true);
      // Trong thực tế, cần gọi API để lấy danh sách địa chỉ
      // const response = await getUserAddresses(user.id);
      
      // Giả lập dữ liệu
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockAddresses = [
        {
          id: 1,
          name: "Nhà riêng",
          phone: "0123456789",
          address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
          is_default: true
        }
      ];
      
      setAddresses(mockAddresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setAddressesLoading(false);
    }
  }, [user?.id]);
  
  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      
      const response = await getUserOrders();
      
      if (response.success) {
        const ordersData = response.data || [];
        // Chỉ hiển thị đơn hàng không ở trạng thái "cancelled"
        const nonCancelledOrders = ordersData.filter(order => order.status !== 'cancelled');
        setOrders(nonCancelledOrders);
      } else {
        setOrdersError('Không thể tải danh sách đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersError('Đã có lỗi khi tải danh sách đơn hàng');
    } finally {
      setOrdersLoading(false);
    }
  }, []);
  
  // Các hàm xử lý khác
  const handleSetDefaultAddress = async (addressId) => {
    try {
      // Giả lập gọi API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setAddresses(prevAddresses => 
        prevAddresses.map(addr => ({
          ...addr,
          is_default: addr.id === addressId
        }))
      );
      
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Đã xảy ra lỗi khi thiết lập địa chỉ mặc định');
    }
  };
  
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }
    
    try {
      // Giả lập gọi API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAddresses(prevAddresses => 
        prevAddresses.filter(addr => addr.id !== addressId)
      );
      
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Đã xảy ra lỗi khi xóa địa chỉ');
    }
  };
  
  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      setAddressError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    try {
      // Giả lập gọi API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Thêm địa chỉ mới vào danh sách
      const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
      const addressToAdd = {
        ...newAddress,
        id: newId
      };
      
      // Nếu địa chỉ mới là mặc định, cập nhật tất cả các địa chỉ khác
      if (newAddress.is_default) {
        setAddresses(prev => 
          prev.map(addr => ({...addr, is_default: false})).concat(addressToAdd)
        );
      } else {
        setAddresses(prev => [...prev, addressToAdd]);
      }
      
      setAddressSuccess(true);
      
      // Làm trống form
      setTimeout(() => {
        setNewAddress({
          name: '',
          phone: '',
          address: '',
          is_default: false
        });
        
        // Đóng modal sau 1.5s
        setTimeout(() => {
          setShowAddressModal(false);
          setAddressSuccess(false);
          setAddressError(null);
        }, 1500);
      }, 500);
      
    } catch (error) {
      console.error('Error adding address:', error);
      setAddressError('Đã xảy ra lỗi khi thêm địa chỉ');
    }
  };

  // 3. Định nghĩa effects sau khi đã định nghĩa tất cả hàm callback
  // CHỈ load user data 1 lần khi component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Kiểm tra token trước
        const token = localStorage.getItem('token');
        if (!token) {
          history.push('/login'); // Sử dụng history.push thay vì navigate
          return;
        }

        // Lấy user từ localStorage trước (nhanh hơn)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setProfileData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            date_of_birth: userData.date_of_birth || ''
          });
          return; // Không cần gọi API
        }

        // Nếu không có trong localStorage thì mới gọi API
        const userData = await getCurrentUser();
        setUser(userData);
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          date_of_birth: userData.date_of_birth || ''
        });
        
      } catch (error) {
        console.error('Error loading user data:', error);
        // CHỈ redirect nếu thực sự là lỗi auth
        if (error.message.includes('401') || error.message.includes('Session expired')) {
          localStorage.clear();
          history.push('/login'); // Sử dụng history.push
        }
      }
    };

    loadUserData();
  }, [history, setUser]); // Thêm setUser vào đây

  // Sửa đổi đoạn useEffect để tránh đệ quy
  useEffect(() => {
    if (user && user.id) {
      // Gọi hàm từ userService
      fetchUserStats(user.id).then(response => {
        if (response.success) {
          setUserStats({
            orderCount: response.data.orderCount || 0,
            totalPoints: response.data.totalPoints || 0, 
            averageRating: response.data.averageRating || 0,
            tier: response.data.tier || 'bronze'
          });
        }
        setStatsLoading(false);
      }).catch(err => {
        console.error('Error fetching stats:', err);
        setStatsLoading(false);
      });
    }
  }, [user]); // Chỉ gọi lại khi user thay đổi

  // Sử dụng useCallback để tránh lỗi dependency
  const loadUserStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      
      // Gọi API để lấy thống kê người dùng
      const response = await fetchUserStats(user.id);
      
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [user?.id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCurrentUser();
      
      if (response.success) {
        const userData = response.data;
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          date_of_birth: userData.date_of_birth || ''
        });
        setUser(userData);
      } else {
        setError(response.message || 'Không thể tải thông tin hồ sơ');
      }
    } catch (err) {
      console.error('Lỗi khi tải hồ sơ:', err);
      setError(err.message || 'Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit form');
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      // Kiểm tra dữ liệu trước khi gửi
      if (!profileData.name.trim()) {
        setError('Họ và tên không được để trống');
        setSaving(false);
        return;
      }
      
      if (!profileData.email.trim()) {
        setError('Email không được để trống');
        setSaving(false);
        return;
      }
      
      // Gọi API để cập nhật
      const response = await updateProfile(profileData);
      
      if (response.success) {
        // Cập nhật thông tin user trong context
        const updatedUser = {...user, ...profileData};
        setUser(updatedUser);
        
        // Cập nhật localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Hiển thị thông báo thành công
        setSuccess(true);
        
        // Tắt chế độ chỉnh sửa
        setIsEditing(false);
        
        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Không thể cập nhật hồ sơ');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật hồ sơ:', err);
      setError('Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = (e) => {
    if (e) e.preventDefault();
    setIsEditing(prev => !prev);
    if (isEditing) {
      setProfileData({
        name: user.full_name || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        date_of_birth: user.date_of_birth || ''
      });
    }
  };

  const handleRedeemPoints = async () => {
    if (userStats.totalPoints < 1000) {
      alert('Bạn cần ít nhất 1000 điểm để đổi ưu đãi');
      return;
    }
    
    try {
      // Đổi điểm thành mã giảm giá
      const pointsToRedeem = 1000; // Có thể thay đổi thành input từ người dùng
      const response = await redeemPoints(user.id, pointsToRedeem);
      
      if (response.success) {
        alert(`Đã đổi thành công ${pointsToRedeem} điểm!\nMã giảm giá của bạn: ${response.data.couponCode}\nGiá trị: ${response.data.discountAmount.toLocaleString('vi-VN')}đ\nHết hạn: ${new Date(response.data.expiresAt).toLocaleDateString('vi-VN')}`);
        
        // Cập nhật lại điểm sau khi đổi
        // Gọi API lại để cập nhật số điểm mới
        fetchUserStats(user.id).then(response => {
          if (response.success) {
            setUserStats({
              ...userStats,
              totalPoints: response.data.totalPoints || 0
            });
          }
        });
      } else {
        alert(response.message || 'Đã xảy ra lỗi khi đổi điểm');
      }
    } catch (error) {
      console.error('Error redeeming points:', error);
      alert('Đã xảy ra lỗi khi đổi điểm');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    
    try {
      setPasswordLoading(true);
      setPasswordError(null);
      setPasswordSuccess(false);
      
      // Giả lập gọi API thay đổi mật khẩu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Đặt trạng thái thành công
      setPasswordSuccess(true);
      
      // Xóa dữ liệu form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Đóng modal sau 2 giây nếu thành công
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      setPasswordError('Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Hàm xử lý xóa tài khoản
  const handleDeleteAccount = async () => {
    try {
      // Giả lập gọi API xóa tài khoản
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Xóa dữ liệu người dùng khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Cập nhật state user trong context
      setUser(null);
      
      // Chuyển hướng về trang chủ sau khi xóa
      history.push('/');
      
    } catch (error) {
      console.error('Lỗi khi xóa tài khoản:', error);
      alert('Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại sau.');
    }
  };

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }
    
    try {
      const response = await cancelOrder(orderId);
      
      if (response.success) {
        // Cập nhật lại danh sách đơn hàng
        fetchOrders();
      } else {
        alert(response.message || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Đã xảy ra lỗi khi hủy đơn hàng');
    }
  };
  
  // Thêm useEffect để tải đơn hàng khi tab thay đổi
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);
  
  // Thêm hàm chuyển đổi trạng thái đơn hàng sang tiếng Việt
  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Đang xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };
  
  // Thêm hàm lấy màu trạng thái
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#3b82f6';
      case 'confirmed': return '#8b5cf6';
      case 'shipping': return '#f59e0b';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };
  
  const tabs = [
    { id: 'profile', label: 'Thông Tin Cá Nhân', icon: '👤' },
    { id: 'orders', label: 'Đơn Hàng', icon: '📦' },
    { id: 'favorites', label: 'Yêu Thích', icon: '❤️' },
    { id: 'addresses', label: 'Địa Chỉ', icon: '📍' },
    { id: 'settings', label: 'Cài Đặt', icon: '⚙️' }
  ];

  // Thêm state cho modal đổi mật khẩu và xóa tài khoản
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 4. Gọi fetchAddresses khi tab thay đổi
  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab, fetchAddresses]);

  // Sửa lỗi "Thành viên từ NaN"
  const getMembershipYear = () => {
    if (!user?.created_at) return new Date().getFullYear();
    
    try {
      const date = new Date(user.created_at);
      const year = date.getFullYear();
      return isNaN(year) ? new Date().getFullYear() : year;
    } catch (error) {
      return new Date().getFullYear();
    }
  };

  if (!user) {
    return (
      <div className={`profile-page ${isDark ? 'dark' : ''}`}>
        <div className="auth-required">
          <div className="auth-icon">🔒</div>
          <h2>Cần Đăng Nhập</h2>
          <p>Vui lòng đăng nhập để xem thông tin hồ sơ của bạn.</p>
          <div className="auth-actions">
            <Link to="/login" className="btn btn-primary">
              <span className="btn-icon">🔑</span>
              Đăng Nhập
            </Link>
            <Link to="/register" className="btn btn-secondary">
              <span className="btn-icon">📝</span>
              Đăng Ký
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`profile-page ${isDark ? 'dark' : ''}`}>
        <LoadingSpinner text="Đang tải thông tin hồ sơ..." />
      </div>
    );
  }

  return (
    <div className={`profile-page ${isDark ? 'dark' : ''}`}>
      <div className="container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="user-info">
              <div className="avatar-section">
                <div className="avatar-container">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <button className="avatar-edit-btn" title="Thay đổi ảnh đại diện">
                    📷
                  </button>
                </div>
              </div>
              
              <div className="user-details">
                <h1 className="user-name-profile">
                  {user.name || user.full_name || 'Người dùng'}
                </h1>
                <p className="user-email">{user.email}</p>
                <div className="user-badges">
                  <span className="badge member">
                    🌟 Thành viên từ {getMembershipYear()}
                  </span>
                  {user.is_active && (
                    <span className="badge active">✅ Tài khoản đã xác thực</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">
                  {statsLoading ? (
                    <span className="loading-placeholder">...</span>
                  ) : (
                    userStats.orderCount
                  )}
                </div>
                <div className="stat-label">Đơn hàng hợp lệ</div>
                <div className="stat-subtitle">(không bao gồm đơn đã hủy)</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {statsLoading ? (
                    <span className="loading-placeholder">...</span>
                  ) : (
                    userStats.totalPoints
                  )}
                </div>
                <div className="stat-label">Điểm tích lũy</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {statsLoading ? (
                    <span className="loading-placeholder">...</span>
                  ) : (
                    `${userStats.averageRating.toFixed(1)}⭐`
                  )}
                </div>
                <div className="stat-label">Đánh giá</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-navigation">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-form-section">
              <div className="section-header">
                <h2>Thông Tin Cá Nhân</h2>
                <p>Quản lý thông tin tài khoản của bạn</p>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                {error && (
                  <div className="alert alert-error">
                    <span className="alert-icon">❌</span>
                    <span>{error}</span>
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success">
                    <span className="alert-icon">✅</span>
                    <span>Cập nhật thông tin thành công!</span>
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">
                      <span className="label-icon">👤</span>
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập họ và tên đầy đủ"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <span className="label-icon">📧</span>
                      Địa Chỉ Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="email@example.com"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <span className="label-icon">📱</span>
                      Số Điện Thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="0123 456 789"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date_of_birth">
                      <span className="label-icon">🎂</span>
                      Ngày Sinh
                    </label>
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={profileData.date_of_birth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">
                    <span className="label-icon">📍</span>
                    Địa Chỉ
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Nhập địa chỉ chi tiết của bạn"
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-actions">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="btn btn-primary"
                    >
                      <span className="btn-icon">✏️</span>
                      Chỉnh Sửa
                    </button>
                  ) : (
                    <>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="btn-icon">⏳</span>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <span className="btn-icon">💾</span>
                            Lưu Thay Đổi
                          </>
                        )}
                      </button>
                      
                      <button 
                        type="button" 
                        onClick={handleEditToggle}
                        className="btn btn-secondary"
                        disabled={loading}
                      >
                        <span className="btn-icon">❌</span>
                        Hủy
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="section-header">
                <h2>Lịch Sử Đơn Hàng</h2>
                <p>Theo dõi các đơn hàng của bạn</p>
              </div>
              
              {/* Bỏ phần orders-filters hiện tại và thay thế bằng phần header mô tả */}
              <div className="orders-description">
                <p className="orders-note">
                  {/* <span className="note-icon">📋</span>
                  Hiển thị tất cả đơn hàng hợp lệ của bạn */}
                </p>
              </div>
              
              {/* Phần còn lại giữ nguyên */}
              {ordersLoading ? (
                <div className="orders-loading">
                  <LoadingSpinner text="Đang tải đơn hàng..." />
                </div>
              ) : ordersError ? (
                <div className="orders-error">
                  <div className="error-icon">⚠️</div>
                  <h3>Không thể tải đơn hàng</h3>
                  <p>{ordersError}</p>
                  <button onClick={fetchOrders} className="btn btn-primary">
                    Thử lại
                  </button>
                </div>
              ) : orders.length > 0 ? (
                <div className="profile-orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="profile-order-card">
                      <div className="profile-order-header">
                        <div className="profile-order-id">#{order.order_number || order.id}</div>
                        <div 
                          className="profile-order-status"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusLabel(order.status)}
                        </div>
                      </div>
                      
                      <div className="profile-order-details">
                        <div className="order-date">
                          <span className="label">Ngày đặt:</span> {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="order-total">
                          <span className="label">Tổng cộng:</span> {order.final_amount?.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                      
                      <div className="profile-order-items">
                        {order.items && order.items.map((item, index) => (
                          <div key={index} className="profile-order-item">
                            <div className="profile-item-name">{item.product_name || item.name}</div>
                            <div className="profile-item-quantity">x{item.quantity}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="profile-order-actions">
                        <button 
                          className="profile-btn-view"
                          onClick={() => history.push(`/orders`)}
                        >
                          Đi xem đơn hàng
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="orders-placeholder">
                  <div className="placeholder-icon">📦</div>
                  <h3>Chưa có đơn hàng nào</h3>
                  <p>Bạn chưa đặt đơn hàng nào. Hãy khám phá thực đơn ngon của chúng tôi!</p>
                  <Link to="/products" className="btn btn-primary">
                    <span className="btn-icon">🍔</span>
                    Đặt Hàng Ngay
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-section">
              <div className="section-header">
                <h2>Món Ăn Yêu Thích</h2>
                <p>Danh sách các món ăn bạn đã lưu</p>
              </div>
              
              <div className="favorites-placeholder">
                <div className="placeholder-icon">❤️</div>
                <h3>Chưa có món yêu thích</h3>
                <p>Hãy thêm những món ăn yêu thích để dễ dàng đặt hàng lần sau!</p>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="addresses-section">
              <div className="section-header">
                <h2>Sổ Địa Chỉ</h2>
                <p>Quản lý các địa chỉ giao hàng</p>
              </div>
              
              {addressesLoading ? (
                <div className="loading-container">
                  <LoadingSpinner text="Đang tải danh sách địa chỉ..." />
                </div>
              ) : addresses.length > 0 ? (
                <>
                  <div className="address-list">
                    {addresses.map(address => (
                      <div key={address.id} className={`address-card ${address.is_default ? 'default' : ''}`}>
                        <div className="address-content">
                          <div className="address-header">
                            <h4 className="address-name">{address.name}</h4>
                            {address.is_default && <span className="default-badge">Mặc định</span>}
                          </div>
                          <div className="address-phone">{address.phone}</div>
                          <div className="address-full">{address.address}</div>
                        </div>
                        <div className="address-actions">
                          {!address.is_default && (
                            <button 
                              className="btn-address-default" 
                              onClick={() => handleSetDefaultAddress(address.id)}
                            >
                              Đặt làm mặc định
                            </button>
                          )}
                          <button 
                            className="btn-address-delete"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="address-add">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowAddressModal(true)}
                    >
                      <span className="btn-icon">➕</span>
                      Thêm Địa Chỉ Mới
                    </button>
                  </div>
                </>
              ) : (
                <div className="addresses-placeholder">
                  <div className="placeholder-icon">📍</div>
                  <h3>Chưa có địa chỉ nào</h3>
                  <p>Thêm địa chỉ để giao hàng nhanh chóng và chính xác hơn!</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddressModal(true)}
                  >
                    <span className="btn-icon">➕</span>
                    Thêm Địa Chỉ Mới
                  </button>
                </div>
              )}
              
              {/* Modal thêm địa chỉ mới */}
              {showAddressModal && (
                <div className="modal-overlay">
                  <div className="modal-container">
                    <div className="modal-header address-header">
                      <h3>Thêm địa chỉ mới</h3>
                      <button className="modal-close" onClick={() => setShowAddressModal(false)}>×</button>
                    </div>
                    
                    <form onSubmit={handleAddAddress} className="address-form">
                      {addressError && (
                        <div className="alert alert-error">
                          <span className="alert-icon">❌</span>
                          <span>{addressError}</span>
                        </div>
                      )}
                      
                      {addressSuccess && (
                        <div className="alert alert-success">
                          <span className="alert-icon">✅</span>
                          <span>Đã thêm địa chỉ mới thành công!</span>
                        </div>
                      )}
                      
                      <div className="form-group">
                        <label htmlFor="address-name">Tên địa chỉ</label>
                        <input
                          id="address-name"
                          type="text"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                          placeholder="Nhà riêng, Công ty..."
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="address-phone">Số điện thoại</label>
                        <input
                          id="address-phone" 
                          type="text"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          placeholder="Số điện thoại nhận hàng"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="address-full">Địa chỉ chi tiết</label>
                        <textarea
                          id="address-full"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          rows="3"
                          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                          required
                        />
                      </div>
                      
                      <div className="form-group checkbox">
                        <input
                          id="address-default"
                          type="checkbox"
                          checked={newAddress.is_default}
                          onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                        />
                        <label htmlFor="address-default">Đặt làm địa chỉ mặc định</label>
                      </div>
                      
                      <button 
                        type="submit" 
                        className={`btn-primary ${addressSuccess ? 'success' : ''}`}
                        disabled={addressSuccess}
                      >
                        {addressSuccess ? 'Đã lưu thành công!' : 'Lưu địa chỉ'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Cài Đặt Tài Khoản</h2>
                <p>Tùy chỉnh trải nghiệm của bạn</p>
              </div>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-icon">🔔</span>
                    <div>
                      <h4>Thông Báo</h4>
                      <p>Nhận thông báo về đơn hàng và khuyến mãi</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-icon">🔒</span>
                    <div>
                      <h4>Bảo Mật</h4>
                      <p>Đổi mật khẩu và cài đặt bảo mật</p>
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Đổi mật khẩu
                  </button>
                </div>
                
                <div className="setting-item danger">
                  <div className="setting-info">
                    <span className="setting-icon">🗑️</span>
                    <div>
                      <h4>Xóa Tài Khoản</h4>
                      <p>Xóa vĩnh viễn tài khoản và dữ liệu</p>
                    </div>
                  </div>
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Xóa Tài Khoản
                  </button>
                </div>
              </div>
              
              {/* Modal đổi mật khẩu */}
              {showPasswordModal && (
                <div className="modal-overlay">
                  <div className="modal-container">
                    <div className="modal-header">
                      <h3>Đổi mật khẩu</h3>
                      <button 
                        className="modal-close"
                        onClick={() => {
                          setShowPasswordModal(false);
                          setPasswordError(null);
                          setPasswordSuccess(false);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                    
                    <form onSubmit={handlePasswordChange} className="password-form">
                      {passwordError && (
                        <div className="alert alert-error">
                          <span className="alert-icon">❌</span>
                          <span>{passwordError}</span>
                        </div>
                      )}
                      
                      {passwordSuccess && (
                        <div className="alert alert-success">
                          <span className="alert-icon">✅</span>
                          <span>Đổi mật khẩu thành công!</span>
                        </div>
                      )}
                      
                      <div className="form-group">
                        <label>Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={passwordLoading}
                      >
                        {passwordLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
              
              {/* Modal xác nhận xóa tài khoản */}
              {showDeleteModal && (
                <div className="modal-overlay">
                  <div className="modal-container">
                    <div className="modal-header">
                      <h3>Xác nhận xóa tài khoản</h3>
                      <button 
                        className="modal-close"
                        onClick={() => setShowDeleteModal(false)}
                      >
                        &times;
                      </button>
                    </div>
                    
                    <div className="modal-body">
                      <div className="warning-icon">⚠️</div>
                      <h4>Cảnh báo: Hành động này không thể hoàn tác</h4>
                      <p>
                        Tài khoản của bạn sẽ bị xóa vĩnh viễn. Tất cả dữ liệu liên quan đến 
                        tài khoản như lịch sử đơn hàng, điểm tích lũy và thông tin cá nhân sẽ bị mất.
                      </p>
                      
                      <div className="modal-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => setShowDeleteModal(false)}
                        >
                          Hủy
                        </button>
                        
                        <button 
                          className="btn btn-danger"
                          onClick={handleDeleteAccount}
                        >
                          Xác nhận xóa tài khoản
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Điểm tích lũy và ưu đãi */}
          <div className="reward-points-section">
            <h3 className="section-title">Điểm tích lũy và ưu đãi</h3>
            
            <div className="points-card">
              <div className="points-header">
                <h4>Điểm của bạn</h4>
                <span className="points-value">{userStats.totalPoints}</span>
              </div>
              
              <div className="tier-info">
                <div className={`tier-badge ${userStats.tier}`}>
                  {userStats.tier === 'bronze' && '🥉'}
                  {userStats.tier === 'silver' && '🥈'}
                  {userStats.tier === 'gold' && '🥇'}
                  Hạng {userStats.tier === 'bronze' ? 'Đồng' : userStats.tier === 'silver' ? 'Bạc' : 'Vàng'}
                </div>
                
                <div className="tier-benefits">
                  {userStats.tier === 'bronze' && <span>Tiêu chuẩn</span>}
                  {userStats.tier === 'silver' && <span>Giảm thêm 5% mỗi đơn</span>}
                  {userStats.tier === 'gold' && <span>Giảm thêm 10% + Miễn phí giao hàng</span>}
                </div>
              </div>
              
              <div className="points-progress">
                <div className="progress-text">
                  {userStats.tier === 'bronze' && (
                    <span>Còn {5000 - userStats.totalPoints} điểm để lên hạng Bạc</span>
                  )}
                  {userStats.tier === 'silver' && (
                    <span>Còn {15000 - userStats.totalPoints} điểm để lên hạng Vàng</span>
                  )}
                  {userStats.tier === 'gold' && (
                    <span>Bạn đã đạt hạng cao nhất!</span>
                  )}
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: userStats.tier === 'bronze' 
                        ? `${(userStats.totalPoints / 5000) * 100}%`
                        : userStats.tier === 'silver'
                          ? `${(userStats.totalPoints / 15000) * 100}%`
                          : '100%'
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="points-actions">
                <button 
                  className="redeem-btn"
                  disabled={userStats.totalPoints < 1000}
                  onClick={handleRedeemPoints}
                >
                  Đổi điểm lấy ưu đãi
                </button>
              </div>
              
              <div className="points-info">
                <h5>Cách tích điểm</h5>
                <ul>
                  <li>100 điểm cho mỗi đơn hàng thành công</li>
                  <li>10 điểm cho mỗi 10,000đ chi tiêu</li>
                  <li>Thưởng thêm 50 điểm cho mỗi đơn hàng thứ 5</li>
                  <li>Nhân đôi điểm vào cuối tuần</li>
                </ul>
                <h5>Quy đổi điểm</h5>
                <p>1,000 điểm = 10,000đ giảm giá</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Đổi Mật Khẩu</h3>
              <button className="close-modal" onClick={() => setShowPasswordModal(false)}>✖️</button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="password-form">
              {passwordError && (
                <div className="alert alert-error">
                  <span className="alert-icon">❌</span>
                  <span>{passwordError}</span>
                </div>
              )}
              
              {passwordSuccess && (
                <div className="alert alert-success">
                  <span className="alert-icon">✅</span>
                  <span>Đổi mật khẩu thành công!</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="currentPassword">Mật khẩu hiện tại *</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới *</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <span className="btn-icon">⏳</span>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🔑</span>
                      Đổi Mật Khẩu
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa tài khoản */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Xóa Tài Khoản</h3>
              <button className="close-modal" onClick={() => setShowDeleteModal(false)}>✖️</button>
            </div>
            
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác.</p>
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Xóa Tài Khoản
              </button>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm/sửa địa chỉ */}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header address-header">
              <h3>Thêm địa chỉ mới</h3>
              <button className="modal-close" onClick={() => setShowAddressModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddAddress} className="address-form">
              {addressError && (
                <div className="alert alert-error">
                  <span className="alert-icon">❌</span>
                  <span>{addressError}</span>
                </div>
              )}
              
              {addressSuccess && (
                <div className="alert alert-success">
                  <span className="alert-icon">✅</span>
                  <span>{newAddress.id ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ thành công!'}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="addressName">Tên địa chỉ *</label>
                <input
                  type="text"
                  id="addressName"
                  name="addressName"
                  value={newAddress.name}
                  onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                  required
                  placeholder="Nhập tên địa chỉ (Nhà riêng, Công ty,...)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="addressPhone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="addressPhone"
                  name="addressPhone"
                  value={newAddress.phone}
                  onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                  required
                  placeholder="Nhập số điện thoại liên hệ"
                />
              </div>

              <div className="form-group">
                <label htmlFor="addressDetail">Địa chỉ chi tiết *</label>
                <textarea
                  id="addressDetail"
                  name="addressDetail"
                  value={newAddress.address}
                  onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                  required
                  placeholder="Nhập địa chỉ cụ thể (số nhà, đường, phường, quận, thành phố)"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newAddress.is_default}
                    onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  />
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className={`btn-primary ${addressSuccess ? 'success' : ''}`}
                  disabled={addressSuccess}
                >
                  {addressSuccess ? 'Đã lưu thành công!' : 'Lưu địa chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;