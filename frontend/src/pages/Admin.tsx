import React, { useState } from 'react';
import { FileText, BarChart3, Settings, Home } from 'lucide-react';
import QuestionManagement from '../components/admin/QuestionManagement';
import UserAnalytics from '../components/admin/UserAnalytics';
import AdminDashboard from '../components/admin/AdminDashboard';

type AdminTab = 'dashboard' | 'questions' | 'analytics' | 'settings';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const tabs = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: Home,
      component: AdminDashboard
    },
    {
      id: 'questions' as AdminTab,
      label: 'Manajemen Pertanyaan',
      icon: FileText,
      component: QuestionManagement
    },
    {
      id: 'analytics' as AdminTab,
      label: 'Analytics User',
      icon: BarChart3,
      component: UserAnalytics
    },
    {
      id: 'settings' as AdminTab,
      label: 'Pengaturan',
      icon: Settings,
      component: () => (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Pengaturan</h2>
          <p className="text-gray-600">Fitur pengaturan akan segera hadir.</p>
        </div>
      )
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || AdminDashboard;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Warum Game Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Admin</h2>
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                            activeTab === tab.id
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {tab.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;