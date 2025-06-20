import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Logo from 'public/images/logo.png';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <Image src={Logo} alt="Photodit Logo" width={120} height={40} />
          </div>
          <button className="admin-sidebar__close" onClick={toggleSidebar}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          <ul className="admin-sidebar__menu">
            <li className="admin-sidebar__menu-item">
              <Link href="/admin" className={router.pathname === '/admin' ? 'active' : ''}>
                <i className="fa-solid fa-dashboard"></i>
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Pages Section */}
            <li className="admin-sidebar__section-title">
              <span>Pages</span>
            </li>
            <li className="admin-sidebar__menu-item">
              <Link href="/admin/home" className={router.pathname.startsWith('/admin/home') ? 'active' : ''}>
                <i className="fa-solid fa-home"></i>
                <span>Home Page</span>
              </Link>
            </li>
            <li className="admin-sidebar__menu-item">
              <Link href="/admin/about" className={router.pathname.startsWith('/admin/about') ? 'active' : ''}>
                <i className="fa-solid fa-info-circle"></i>
                <span>About Us</span>
              </Link>
            </li>
            <li className="admin-sidebar__menu-item">
              <Link href="/admin/services" className={router.pathname.startsWith('/admin/services') ? 'active' : ''}>
                <i className="fa-solid fa-cogs"></i>
                <span>Services</span>
              </Link>
            </li>

            <li className="admin-sidebar__menu-item">
              <Link href="/admin/portfolio" className={router.pathname.startsWith('/admin/portfolio') ? 'active' : ''}>
                <i className="fa-solid fa-images"></i>
                <span>Portfolio</span>
              </Link>
            </li>
            <li className="admin-sidebar__menu-item">
              <Link href="/admin/pricing" className={router.pathname.startsWith('/admin/pricing') ? 'active' : ''}>
                <i className="fa-solid fa-tags"></i>
                <span>Pricing</span>
              </Link>
            </li>
            <li className="admin-sidebar__menu-item">
              <Link href="/admin/contact" className={router.pathname.startsWith('/admin/contact') ? 'active' : ''}>
                <i className="fa-solid fa-envelope"></i>
                <span>Contact</span>
              </Link>
            </li>
            <li className="admin-sidebar__menu-item">
              <Link href="/admin/teams" className={router.pathname.startsWith('/admin/teams') ? 'active' : ''}>
                <i className="fa-solid fa-users"></i>
                <span>Our Teams</span>
              </Link>
            </li>
            <li className="admin-sidebar__menu-item">
              <Link href="/admin/get-quote" className={router.pathname.startsWith('/admin/get-quote') ? 'active' : ''}>
                <i className="fa-solid fa-file-invoice-dollar"></i>
                <span>Get A Quote</span>
              </Link>
            </li>

            {/* Content Section */}
            <li className="admin-sidebar__section-title">
              <span>Content</span>
            </li>
            <li className="admin-sidebar__menu-item">
              <Link href="/admin/news" className={router.pathname.startsWith('/admin/news') ? 'active' : ''}>
                <i className="fa-solid fa-newspaper"></i>
                <span>News</span>
              </Link>
            </li>

            {/* Settings Section */}
            <li className="admin-sidebar__section-title">
              <span>Configuration</span>
            </li>
            <li className="admin-sidebar__menu-item">
              <Link href="/admin/settings" className={router.pathname === '/admin/settings' ? 'active' : ''}>
                <i className="fa-solid fa-gear"></i>
                <span>Settings</span>
              </Link>
            </li>

          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <i className="fa-solid fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <button className="admin-header__toggle" onClick={toggleSidebar}>
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="admin-header__actions">
            <Link href="/" className="admin-header__view-site" target="_blank">
              <i className="fa-solid fa-external-link"></i>
              <span>View Site</span>
            </Link>

            <button className="admin-header__logout" onClick={handleLogout}>
              <i className="fa-solid fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="admin-main">
          {children}
        </main>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar Styles */
        .admin-sidebar {
          width: 280px;
          background-color: #ffffff;
          color: #333333;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
          border-radius: 0 16px 16px 0;
          overflow: hidden;
        }

        .admin-sidebar__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          background-color: #f8fafc;
        }

        .admin-sidebar__close {
          display: none;
          background: none;
          color: #333333;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

        .admin-sidebar__nav {
          flex: 1;
          padding: 24px 0;
          overflow-y: auto; /* Add vertical scrolling */
          overflow-x: auto; /* Add horizontal scrolling for mobile */
          -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        }

        .admin-sidebar__menu {
          list-style: none;
          padding: 0;
          margin: 0;
          min-width: 280px; /* Ensure menu has minimum width */
        }

        .admin-sidebar__section-title {
          padding: 0 16px;
          margin: 20px 0 10px;
        }

        .admin-sidebar__section-title span {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 1px;
          padding: 0 20px;
        }

        .admin-sidebar__menu-item {
          margin-bottom: 8px;
          padding: 0 16px;
        }

        .admin-sidebar__menu-item a {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          color: #4b5563;
          text-decoration: none;
          transition: all 0.3s ease;
          border-radius: 12px;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .admin-sidebar__menu-item a::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background-color: rgba(69, 105, 231, 0.1);
          transition: width 0.3s ease;
          z-index: 0;
        }

        .admin-sidebar__menu-item a:hover::before {
          width: 100%;
        }

        .admin-sidebar__menu-item a:hover {
          color: #4569e7;
          transform: translateX(5px);
        }

        .admin-sidebar__menu-item a.active {
          background-color: #4569e7;
          color: white;
          box-shadow: 0 4px 12px rgba(69, 105, 231, 0.25);
        }

        .admin-sidebar__menu-item a.active:hover {
          transform: translateX(0);
          background-color: #3a5bc7;
        }

        .admin-sidebar__menu-item a.active::before {
          display: none;
        }

        .admin-sidebar__menu-item i {
          margin-right: 16px;
          width: 20px;
          text-align: center;
          font-size: 18px;
          position: relative;
          z-index: 1;
        }

        .admin-sidebar__footer {
          padding: 24px 16px;
          border-top: 1px solid #e2e8f0;
        }

        .admin-sidebar__logout {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 14px 20px;
          background-color: #fee2e2;
          color: #b91c1c;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(185, 28, 28, 0.1);
        }

        .admin-sidebar__logout:hover {
          background-color: #fecaca;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(185, 28, 28, 0.15);
        }

        .admin-sidebar__logout i {
          margin-right: 16px;
          font-size: 18px;
        }

        /* Content Styles */
        .admin-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #f8fafc;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-header__toggle {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .admin-header__toggle:hover {
          background-color: #f1f5f9;
        }

        .admin-header__actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-header__view-site,
        .admin-header__logout {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border: none;
          border-radius: 8px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .admin-header__view-site {
          background-color: #e0e7ff;
          color: #4338ca;
        }

        .admin-header__view-site:hover {
          background-color: #c7d2fe;
          transform: translateY(-2px);
        }

        .admin-header__logout:hover {
          background-color: #e2e8f0;
          transform: translateY(-2px);
        }

        .admin-header__view-site i,
        .admin-header__logout i {
          margin-right: 8px;
          font-size: 16px;
        }

        .admin-main {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        /* Scrollbar Styling */
        .admin-main::-webkit-scrollbar {
          width: 8px;
        }

        .admin-main::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .admin-main::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .admin-main::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 100;
            transform: translateX(-100%);
            border-radius: 0;
            width: 85%;
            max-width: 320px;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-x: auto; /* Enable horizontal scrolling */
          }

          .admin-sidebar__nav {
            padding-bottom: 16px; /* Add some padding at the bottom for scrolling */
          }

          .admin-sidebar__nav::-webkit-scrollbar {
            height: 4px; /* Height of the scrollbar */
            width: 4px; /* Width of the scrollbar */
          }

          .admin-sidebar__nav::-webkit-scrollbar-track {
            background: #f1f5f9; /* Track color */
            border-radius: 4px;
          }

          .admin-sidebar__nav::-webkit-scrollbar-thumb {
            background: #cbd5e1; /* Handle color */
            border-radius: 4px;
          }

          .admin-sidebar__nav::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; /* Handle color on hover */
          }

          .admin-sidebar--open {
            transform: translateX(0);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
          }

          .admin-sidebar__close {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #f1f5f9;
            transition: all 0.3s ease;
          }

          .admin-sidebar__close:hover {
            background-color: #e2e8f0;
          }

          .admin-header__toggle {
            display: flex;
          }

          .admin-main {
            padding: 24px 16px;
          }

          .admin-header {
            padding: 12px 16px;
          }

          .admin-header__view-site span,
          .admin-header__logout span {
            display: none;
          }

          .admin-header__view-site i,
          .admin-header__logout i {
            margin-right: 0;
            font-size: 18px;
          }

          .admin-header__view-site,
          .admin-header__logout {
            padding: 10px;
            width: 40px;
            height: 40px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
