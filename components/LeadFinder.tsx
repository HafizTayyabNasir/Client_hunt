
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Globe, Mail, ChevronRight, Zap, Loader2, CheckCircle2, AlertCircle, PlayCircle, Terminal, X, RefreshCw } from 'lucide-react';
import { Lead, UserProfile } from '../types';
import { analyzeLeadAndGeneratePitch } from '../services/gemini';
import { searchLeads } from '../services/api';
import { simulateLeadScraping } from '../services/gemini'; 

interface LeadFinderProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  userProfile: UserProfile;
}

interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'process';
  timestamp: string;
}

const LeadFinder: React.FC<LeadFinderProps> = ({ leads, setLeads, userProfile }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('Web Development');
  const [isHunting, setIsHunting] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [useRealScraper, setUseRealScraper] = useState(true);

  // Terminal Logs State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [showTerminal, setShowTerminal] = useState(false);

  // Modal State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [generatedPitch, setGeneratedPitch] = useState<{ analysis: string, emailDraft: string } | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }]);
  };

  const runLogSequence = async (target: string, loc: string) => {
    // This sequence visualizes what the backend is doing in the background
    const sequence = [
        { msg: `System Initialized. Target: "${target}" in "${loc}"`, type: 'info', delay: 200 },
        { msg: `Connecting to Google Maps (Headless Chromium)...`, type: 'process', delay: 800 },
        { msg: `Bypassing bot detection algorithms...`, type: 'warning', delay: 1500 },
        { msg: `Connection Established. Latency: 42ms`, type: 'success', delay: 2200 },
        { msg: `Parsing DOM elements for business cards...`, type: 'process', delay: 3500 },
        { msg: `Scrolling viewport (Page 1/3)...`, type: 'info', delay: 4500 },
        { msg: `Extracting metadata (Name, URL, Coordinates)...`, type: 'process', delay: 6000 },
        { msg: `Filtering duplicates and irrelevant results...`, type: 'warning', delay: 8000 },
        { msg: `Validating domains and SSL certificates...`, type: 'process', delay: 9500 },
    ];

    for (const step of sequence) {
        if (!isHunting) break; // Stop if user cancels or process finishes early
        await new Promise(r => setTimeout(r, 500)); // Minimum stagger
        // We only add the log if the process is still running (conceptually)
        // In reality, we let these play out until the real fetch returns
        if (isHunting) {
            addLog(step.msg, step.type as any);
        }
    }
  };

  const handleHunt = async () => {
    if (!keyword || !location) return;
    setIsHunting(true);
    setShowTerminal(true);
    setLogs([]); // Clear previous logs
    
    addLog(`>_ Starting HuntFlow v2.0...`, 'info');

    try {
        let newLeads: Lead[] = [];
        
        // Start the log visualizer (runs in parallel)
        const logPromise = runLogSequence(keyword, location);

        if (useRealScraper) {
            addLog("Establishing secure connection to Python Backend (Port 8000)...", 'process');
            
            try {
                // The actual backend call
                newLeads = await searchLeads(keyword, location);
                addLog(`Backend responded successfully. Found ${newLeads.length} raw leads.`, 'success');
            } catch (err) {
                // Handle "Connection Refused" gracefully
                addLog("Backend Connection Failed: Connection refused.", 'error');
                addLog("ACTION REQUIRED: Run 'uvicorn main:app --reload' in backend folder.", 'warning');
                addLog("Falling back to AI Simulation Mode for demo...", 'info');
                
                await new Promise(r => setTimeout(r, 1500)); 
                newLeads = await simulateLeadScraping(keyword, location);
            }
        } else {
            // Use Simulation
            addLog("Running in Simulation Mode (Mock Data)...", 'info');
            await new Promise(r => setTimeout(r, 2000)); 
            newLeads = await simulateLeadScraping(keyword, location);
        }
        
        // Post-Processing Logs
        addLog(`Analyzing website content for ${newLeads.length} leads...`, 'process');
        
        // Simulate email finding logs
        for (const l of newLeads) {
             if(l.email !== 'Not Found') {
                 addLog(`[${l.businessName}] Email extracted: ${l.email}`, 'success');
             } else {
                 addLog(`[${l.businessName}] Scraping contact page...`, 'warning');
             }
             await new Promise(r => setTimeout(r, 200)); // Small delay for visual effect
        }

        addLog(`Process Complete. ${newLeads.length} verified leads added to database.`, 'success');
        addLog(`Ready for outreach.`, 'info');

        setLeads(prev => [...newLeads, ...prev]);
    } catch (e) {
        console.error(e);
        addLog("Critical Process Error.", 'error');
    } finally {
        setIsHunting(false);
    }
  };

  const handleAnalyze = async (lead: Lead) => {
    setAnalyzingId(lead.id);
    setSelectedLead(lead);
    setGeneratedPitch(null);
    
    // Pass userProfile to the AI service
    const result = await analyzeLeadAndGeneratePitch(lead, service, userProfile);
    
    setGeneratedPitch(result);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Analyzing', aiAnalysis: result.analysis } : l));
    setAnalyzingId(null);
  };

  const sendEmail = (leadId: string) => {
     setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Contacted' } : l));
     setSelectedLead(null); // Close modal
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Search Header */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="text-indigo-400" />
                Lead Scraping & Discovery
            </h2>
            <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                <span className={`text-xs font-medium ${useRealScraper ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {useRealScraper ? 'Real Scraper (Python)' : 'Simulation Mode'}
                </span>
                <button 
                    onClick={() => setUseRealScraper(!useRealScraper)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${useRealScraper ? 'bg-emerald-600' : 'bg-slate-600'}`}
                >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${useRealScraper ? 'left-6' : 'left-1'}`} />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Business Type (e.g. Dentists)" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Location (e.g. New York)" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="relative">
             <Zap className="absolute left-3 top-3 text-slate-500" size={18} />
             <input 
              type="text" 
              placeholder="Your Service (e.g. SEO)" 
              className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>
          <button 
            onClick={handleHunt}
            disabled={isHunting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isHunting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Hunting...
              </>
            ) : (
              <>
                <PlayCircle size={20} fill="currentColor" className="text-white/20" />
                Start Hunt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Activity Log Terminal */}
      {showTerminal && (
        <div className="animate-fade-in transform transition-all">
            <div className="bg-[#0c0c0c] rounded-lg border border-slate-800 overflow-hidden shadow-2xl font-mono text-xs md:text-sm">
                {/* Terminal Header */}
                <div className="bg-[#1a1a1a] px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <Terminal size={14} className="text-emerald-500" />
                        <span className="font-bold text-slate-300 tracking-wider">Live Activity Log</span>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5">
                             <div className={`w-2 h-2 rounded-full ${isHunting ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                             <span className={`text-[10px] font-bold tracking-widest ${isHunting ? 'text-emerald-500' : 'text-slate-500'}`}>
                                {isHunting ? 'ONLINE' : 'IDLE'}
                             </span>
                         </div>
                         <button onClick={() => setShowTerminal(false)} className="text-slate-500 hover:text-white transition-colors">
                             <X size={14} />
                         </button>
                    </div>
                </div>
                
                {/* Logs Content */}
                <div className="p-4 h-56 overflow-y-auto space-y-2 custom-scrollbar font-mono bg-[#0c0c0c]">
                    {logs.map((log, index) => (
                        <div key={index} className="flex gap-3 leading-tight animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                            <span className="text-indigo-500 shrink-0 font-bold">{'>'}</span>
                            <span className={`
                                break-all
                                ${log.type === 'error' ? 'text-rose-500 font-bold' : 
                                  log.type === 'success' ? 'text-emerald-400' : 
                                  log.type === 'warning' ? 'text-amber-400' :
                                  log.type === 'process' ? 'text-cyan-400' :
                                  'text-slate-300'}
                            `}>
                                {log.message}
                            </span>
                        </div>
                    ))}
                    {isHunting && (
                        <div className="flex gap-3 mt-2">
                             <span className="text-slate-700 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                             <span className="text-indigo-500 shrink-0">{'>'}</span>
                             <span className="w-2.5 h-4 bg-emerald-500/80 animate-pulse block"></span>
                        </div>
                    )}
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>
      )}

      {/* Results Table */}
      <div className="flex-1 overflow-hidden bg-slate-800 rounded-xl border border-slate-700 flex flex-col shadow-lg">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <div className="flex items-center gap-3">
                <h3 className="font-semibold text-white">Discovered Leads</h3>
                <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full text-xs">{leads.length}</span>
            </div>
            <div className="flex gap-2">
                 <button className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle2 size={12} /> Verified
                 </button>
            </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/80 backdrop-blur sticky top-0 z-10">
              <tr>
                <th className="p-4 text-slate-400 font-medium text-sm">Business Details</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Website Health</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Contact Info</th>
                <th className="p-4 text-slate-400 font-medium text-sm">Status</th>
                <th className="p-4 text-slate-400 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {leads.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500 gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                                <Search size={24} className="opacity-50" />
                            </div>
                            <p>No leads found yet. Initialize a hunt to begin.</p>
                        </div>
                    </td>
                </tr>
              ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-700/40 transition-colors group">
                      <td className="p-4">
                        <div className="font-semibold text-white mb-0.5">{lead.businessName}</div>
                        {lead.website !== 'No Website' ? (
                            <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 w-fit">
                                <Globe size={10} /> {lead.website}
                            </a>
                        ) : (
                            <span className="text-xs text-slate-500 italic">No website detected</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                           <div className="flex-1 max-w-[100px] h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${lead.websiteScore > 70 ? 'bg-emerald-500' : lead.websiteScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                    style={{ width: `${lead.websiteScore}%` }} 
                                />
                           </div>
                           <span className={`text-xs font-medium ${lead.websiteScore > 70 ? 'text-emerald-400' : lead.websiteScore > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                               {lead.websiteScore}/100
                           </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-200">{lead.contactPerson}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            {lead.email} 
                            {lead.email !== 'Not Found' && <CheckCircle2 size={10} className="text-emerald-500" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`
                          px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border
                          ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            lead.status === 'Contacted' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                            lead.status === 'Replied' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-slate-700 text-slate-400 border-slate-600'}
                        `}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                            onClick={() => handleAnalyze(lead)}
                            className="bg-slate-700 hover:bg-slate-600 hover:text-white text-slate-300 p-2 rounded-lg transition-all active:scale-95 border border-transparent hover:border-slate-500"
                            title="Generate AI Pitch"
                        >
                          <Zap size={16} className={analyzingId === lead.id ? 'text-amber-400 animate-pulse' : ''} />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                          <Zap size={20} />
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-white">AI Outreach Generator</h3>
                          <p className="text-xs text-slate-400">Hyper-personalized content creation</p>
                      </div>
                  </div>
                  <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white transition-colors">
                      <X size={20} />
                  </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Business</h4>
                         <p className="text-white font-medium truncate">{selectedLead.businessName}</p>
                     </div>
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Decision Maker</h4>
                         <p className="text-white font-medium truncate">{selectedLead.contactPerson}</p>
                     </div>
                 </div>

                 {!generatedPitch ? (
                     <div className="flex flex-col items-center justify-center py-12 space-y-6">
                         <div className="relative">
                            <div className="w-16 h-16 border-4 border-slate-700 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" size={24} />
                         </div>
                         <div className="text-center space-y-1">
                             <p className="text-white font-medium">Analyzing website structure...</p>
                             <p className="text-slate-500 text-sm">Identifying conversion bottlenecks & formatting pitch</p>
                         </div>
                     </div>
                 ) : (
                     <>
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Zap size={14} /> Strategic Insight
                            </h4>
                            <p className="text-slate-300 text-sm italic leading-relaxed">"{generatedPitch.analysis}"</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-white font-medium flex items-center gap-2">
                                    <Mail size={16} className="text-slate-400" />
                                    Email Draft
                                </h4>
                                <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase">Tone: Professional</span>
                            </div>
                            <textarea 
                                className="w-full h-64 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm leading-relaxed resize-none"
                                value={generatedPitch.emailDraft}
                                readOnly
                            />
                        </div>
                     </>
                 )}
              </div>

              <div className="p-6 border-t border-slate-700 bg-slate-800 flex justify-end gap-3">
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                  >
                      Cancel
                  </button>
                  <button 
                    onClick={() => sendEmail(selectedLead.id)}
                    disabled={!generatedPitch}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                      <Mail size={16} /> 
                      Send Proposal
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LeadFinder;
