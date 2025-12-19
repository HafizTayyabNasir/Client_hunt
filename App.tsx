
import React, { useState } from 'react';
import { LayoutDashboard, Globe, Mail, Settings, Menu, X, Rocket, User, Briefcase, Phone, AtSign, Save } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LeadFinder from './components/LeadFinder';
import Inbox from './components/Inbox';
import CampaignConfig from './components/CampaignConfig';
import { AppView, Lead, CampaignStats, UserProfile } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Global State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats] = useState<CampaignStats>({
    totalLeads: 1240,
    emailsSent: 850,
    openRate: 42,
    replyRate: 12,
    activeLeads: 45
  });

  // Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
      name: 'John Doe',
      jobTitle: 'Lead Developer',
      companyName: 'Orbit Agency',
      personalEmail: 'john@gmail.com',
      businessEmail: 'john@orbitagency.com',
      phone: '+1 234 567 8900'
  });

  // Temporary state for editing profile
  const [editProfile, setEditProfile] = useState<UserProfile>(userProfile);

  const handleSaveProfile = () => {
      setUserProfile(editProfile);
      setIsProfileOpen(false);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
          <div className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
                  <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <User className="text-indigo-500" /> Edit Profile
                      </h3>
                      <button onClick={() => setIsProfileOpen(false)} className="text-slate-400 hover:text-white">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                          <div className="relative">
                              <User className="absolute left-3 top-3 text-slate-500" size={16} />
                              <input 
                                type="text" 
                                value={editProfile.name}
                                onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 text-slate-500" size={16} />
                                <input 
                                    type="text" 
                                    value={editProfile.jobTitle}
                                    onChange={(e) => setEditProfile({...editProfile, jobTitle: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 text-slate-500" size={16} />
                                <input 
                                    type="text" 
                                    value={editProfile.companyName}
                                    onChange={(e) => setEditProfile({...editProfile, companyName: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Business Email (SMTP)</label>
                          <div className="relative">
                              <AtSign className="absolute left-3 top-3 text-slate-500" size={16} />
                              <input 
                                type="email" 
                                value={editProfile.businessEmail}
                                onChange={(e) => setEditProfile({...editProfile, businessEmail: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                          </div>
                      </div>

                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Personal Email</label>
                          <div className="relative">
                              <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
                              <input 
                                type="email" 
                                value={editProfile.personalEmail}
                                onChange={(e) => setEditProfile({...editProfile, personalEmail: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                          </div>
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                          <div className="relative">
                              <Phone className="absolute left-3 top-3 text-slate-500" size={16} />
                              <input 
                                type="text" 
                                value={editProfile.phone}
                                onChange={(e) => setEditProfile({...editProfile, phone: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                          </div>
                      </div>
                  </div>

                  <div className="p-6 border-t border-slate-700 bg-slate-900 flex justify-end gap-3">
                      <button onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                      <button 
                        onClick={handleSaveProfile}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg"
                      >
                          <Save size={18} /> Save Changes
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            <Rocket size={18} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            HuntFlow AI
          </h1>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={AppView.LEAD_FINDER} icon={Globe} label="Lead Finder" />
          <NavItem view={AppView.INBOX} icon={Mail} label="Intelligent Inbox" />
          <NavItem view={AppView.CAMPAIGN_CONFIG} icon={Settings} label="Campaign Settings" />
        </nav>

        {/* Profile Footer - Clickable */}
        <div 
            className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors group"
            onClick={() => {
                setEditProfile(userProfile); // Reset edit state to current actual state
                setIsProfileOpen(true);
            }}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <span className="font-bold">{userProfile.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{userProfile.name}</p>
                    <p className="text-xs text-emerald-400 truncate">Pro Plan Active</p>
                </div>
                <Settings size={16} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (Mobile Only) */}
        <header className="lg:hidden p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Rocket size={16} className="text-white" />
                </div>
                <span className="font-bold text-white">HuntFlow AI</span>
             </div>
             <button onClick={() => setMobileMenuOpen(true)} className="text-white">
                 <Menu size={24} />
             </button>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-900 relative">
           {/* Background decorative elements */}
           <div className="absolute top-0 left-0 w-full h-96 bg-indigo-900/10 rounded-full blur-3xl -z-10 transform -translate-y-1/2 pointer-events-none"></div>

          {currentView === AppView.DASHBOARD && <Dashboard stats={stats} />}
          {currentView === AppView.LEAD_FINDER && <LeadFinder leads={leads} setLeads={setLeads} userProfile={userProfile} />}
          {currentView === AppView.INBOX && <Inbox leads={leads} />}
          {currentView === AppView.CAMPAIGN_CONFIG && <CampaignConfig />}
        </div>
      </main>
    </div>
  );
};

export default App;
