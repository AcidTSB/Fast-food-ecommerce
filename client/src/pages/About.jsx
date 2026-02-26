import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './About.css';

const About = () => {
  const { isDark } = useTheme();

  const stats = [
    { icon: '🍕', number: '10K+', label: 'Khách Hàng Hài Lòng' },
    { icon: '⭐', number: '4.9', label: 'Điểm Đánh Giá' },
    { icon: '🚚', number: '30 phút', label: 'Thời Gian Giao Hàng' },
    { icon: '🏪', number: '50+', label: 'Cửa Hàng' }
  ];

  const team = [
    {
      name: 'Nguyễn Văn Minh',
      role: 'Trưởng Bếp',
      image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=300&h=300&fit=crop&crop=face',
      description: 'Hơn 15 năm kinh nghiệm trong nghệ thuật ẩm thực'
    },
    {
      name: 'Trần Thị Hương',
      role: 'Giám Đốc Vận Hành',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b631?w=300&h=300&fit=crop&crop=face',
      description: 'Chuyên gia vận hành nhà hàng và dịch vụ khách hàng'
    },
    {
      name: 'Lê Văn Thành',
      role: 'Kiểm Soát Chất Lượng',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      description: 'Đảm bảo mọi món ăn đều đạt tiêu chuẩn cao của chúng tôi'
    },
    {
      name: 'Phạm Thị Linh',
      role: 'Chăm Sóc Khách Hàng',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      description: 'Tận tâm mang đến trải nghiệm khách hàng đặc biệt'
    }
  ];

  const values = [
    {
      icon: '🌟',
      title: 'Chất Lượng Hàng Đầu',
      description: 'Chúng tôi chỉ sử dụng nguyên liệu tươi ngon nhất và duy trì tiêu chuẩn chất lượng cao nhất trong mỗi món ăn.'
    },
    {
      icon: '⚡',
      title: 'Phục Vụ Nhanh Chóng',
      description: 'Hệ thống bếp và giao hàng hiệu quả đảm bảo bạn nhận được thức ăn nóng hổi trong thời gian kỷ lục.'
    },
    {
      icon: '💚',
      title: 'Lựa Chọn Tốt Cho Sức Khỏe',
      description: 'Chúng tôi cung cấp đa dạng các lựa chọn lành mạnh và bổ dưỡng mà không làm giảm hương vị.'
    },
    {
      icon: '🌍',
      title: 'Phát Triển Bền Vững',
      description: 'Chúng tôi cam kết thực hiện các hoạt động bền vững và giảm thiểu tác động đến môi trường.'
    }
  ];

  return (
    <div className={`about-page ${isDark ? 'dark' : ''}`}>
      {/* Phần Hero */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop"
            alt="Nội thất nhà hàng"
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Về FastFood</h1>
            <p className="hero-subtitle">
              Giao hàng thức ăn ngon và chất lượng từ năm 2010. Chúng tôi đam mê 
              mang đến cho bạn trải nghiệm thức ăn nhanh tốt nhất với nguyên liệu tươi ngon và dịch vụ đặc biệt.
            </p>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-icon">{stat.icon}</span>
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phần Câu Chuyện Của Chúng Tôi */}
      <section className="our-story">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <h2 className="section-title">Câu Chuyện Của Chúng Tôi</h2>
              <div className="story-text">
                <p>
                  Được thành lập vào năm 2010 bởi một nhóm những người đam mê ẩm thực, FastFood Express 
                  bắt đầu như một nhà hàng địa phương nhỏ với sứ mệnh đơn giản: phục vụ thức ăn chất lượng cao, 
                  ngon miệng một cách nhanh chóng và giá cả phải chăng.
                </p>
                <p>
                  Qua nhiều năm, chúng tôi đã phát triển từ một địa điểm duy nhất đến hơn 50 cửa hàng trên toàn quốc, 
                  nhưng cam kết của chúng tôi về chất lượng và sự hài lòng của khách hàng vẫn không thay đổi. 
                  Mỗi bánh burger, pizza và món phụ đều được chuẩn bị cẩn thận với nguyên liệu tươi ngon, 
                  có nguồn gốc địa phương.
                </p>
                <p>
                  Ngày nay, chúng tôi tự hào phục vụ hơn 10.000 khách hàng hài lòng mỗi tháng, 
                  duy trì điểm đánh giá 4.9 sao thông qua chất lượng nhất quán và dịch vụ đặc biệt.
                </p>
              </div>
              <div className="story-highlights">
                <div className="highlight">
                  <span className="highlight-year">2010</span>
                  <span className="highlight-text">Thành lập nhà hàng đầu tiên</span>
                </div>
                <div className="highlight">
                  <span className="highlight-year">2015</span>
                  <span className="highlight-text">Ra mắt đặt hàng trực tuyến</span>
                </div>
                <div className="highlight">
                  <span className="highlight-year">2020</span>
                  <span className="highlight-text">Mở rộng đến 50+ địa điểm</span>
                </div>
                <div className="highlight">
                  <span className="highlight-year">2023</span>
                  <span className="highlight-text">Giới thiệu bao bì thân thiện môi trường</span>
                </div>
              </div>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=700&fit=crop"
                alt="Bếp của chúng tôi"
                className="story-img"
              />
              <div className="image-badge">
                <span className="badge-text">Tươi Mỗi Ngày</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phần Giá Trị Cốt Lõi */}
      <section className="our-values">
        <div className="container">
          <h2 className="section-title centered">Giá Trị Cốt Lõi Của Chúng Tôi</h2>
          <p className="section-subtitle">
            Những nguyên tắc này hướng dẫn mọi việc chúng tôi làm, từ tìm nguồn nguyên liệu đến phục vụ khách hàng.
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phần Đội Ngũ */}
      <section className="our-team">
        <div className="container">
          <h2 className="section-title centered">Gặp Gỡ Đội Ngũ Của Chúng Tôi</h2>
          <p className="section-subtitle">
            Những con người đầy đam mê đứng sau những món ăn yêu thích của bạn.
          </p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                  <div className="team-overlay">
                    <div className="social-links">
                      <span className="social-link">📧</span>
                      <span className="social-link">📱</span>
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phần Kêu Gọi Hành Động */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn Sàng Trải Nghiệm Sự Khác Biệt?</h2>
            <p className="cta-subtitle">
              Tham gia cùng hàng ngàn khách hàng hài lòng đã chọn FastFood Express vì chất lượng và sự tiện lợi.
            </p>
            <div className="cta-buttons">
              <a href="/products" className="cta-btn primary">
                <span className="btn-icon">🍔</span>
                <span className="btn-text">Đặt Hàng Ngay</span>
              </a>
              <a href="/contact" className="cta-btn secondary">
                <span className="btn-icon">📞</span>
                <span className="btn-text">Liên Hệ Chúng Tôi</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;