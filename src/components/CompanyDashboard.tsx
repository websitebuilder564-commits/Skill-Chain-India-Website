import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Opportunity } from '../types';
import { 
  Plus, 
  Users, 
  Briefcase, 
  Star, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  UserPlus, 
  Sparkles, 
  X,
  FileText,
  MessageSquare
} from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const { 
    currentCompany, 
    opportunities, 
    applications, 
    postOpportunity, 
    updateApplicationStatus, 
    completeOpportunityProject 
  } = useApp();

  // Filter opportunities posted by this company
  const companyOpps = opportunities.filter(o => o.companyId === currentCompany?.id);
  const activeOppsCount = companyOpps.filter(o => o.status === 'open' || o.status === 'ongoing').length;

  // Filter applications received for this company's gigs
  const companyApps = applications.filter(a => 
    companyOpps.some(o => o.id === a.opportunityId) && a.status !== 'completed' && a.status !== 'rejected'
  );

  // Active contracts (hired state)
  const activeContracts = applications.filter(a => 
    companyOpps.some(o => o.id === a.opportunityId) && a.status === 'hired'
  );

  // State for posting modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('Remote');
  const [remote, setRemote] = useState(true);
  const [skills, setSkills] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [preferredSkills, setPreferredSkills] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'Crypto' | 'Razorpay'>('Crypto');

  // State for Project Completion / Rating modal
  const [showRateModal, setShowRateModal] = useState<string | null>(null); // holds opportunityId
  const [studentRating, setStudentRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('');

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || budget <= 0 || !deadline || !description) return;

    postOpportunity({
      title,
      budget,
      duration,
      location,
      remote,
      requiredSkills: skills.split(',').map(s => s.trim()).filter(Boolean),
      difficulty,
      deadline,
      description,
      responsibilities: responsibilities.split('\n').map(r => r.trim()).filter(Boolean),
      preferredSkills: preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
      deliverables: deliverables.split('\n').map(d => d.trim()).filter(Boolean),
      paymentMethod,
    });

    // Reset Form
    setTitle('');
    setBudget(0);
    setDuration('');
    setSkills('');
    setDescription('');
    setResponsibilities('');
    setPreferredSkills('');
    setDeliverables('');
    setShowPostModal(false);
    triggerToast("Opportunity posted successfully! Sent to moderation.");
  };

  const handleCompleteProject = (oppId: string) => {
    completeOpportunityProject(oppId, studentRating, reviewText);
    setShowRateModal(null);
    setStudentRating(5);
    setReviewText('');
    triggerToast("Milestone approved! Bounty released and achievement logged.");
  };

  return (
    <div className="bg-transparent text-slate-300 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="company-dashboard">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400 text-sm font-medium animate-bounce">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20 animate-pulse">⚡</span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">{currentCompany?.name} Portal</h1>
              <p className="text-slate-400 text-sm mt-1">{currentCompany?.industry} • Global Web3 Partner</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPostModal(true)}
            className="px-5 py-3 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] text-white"
          >
            <Plus className="w-4 h-4" />
            Post New Opportunity
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" id="company-metrics">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Active projects</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">{activeOppsCount}</span>
              <span className="text-xs text-cyan-400 font-mono">active</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Students Hired</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">{currentCompany?.studentsHired}</span>
              <span className="text-xs text-cyan-400 font-mono">builders</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Milestones Funded</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">12</span>
              <span className="text-xs text-cyan-400 font-mono">proofs</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Company Rating</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight text-white">★ {currentCompany?.rating}</span>
              <span className="text-xs text-amber-400 font-mono">/5</span>
            </div>
          </div>
        </div>

        {/* Central columns */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Candidate reviewers & Active contracts */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Candidate reviewer */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-slate-200">Pending Candidate Reviewer</h3>
              
              <div className="space-y-4">
                {companyApps.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">No active applicants needing review at this time.</p>
                ) : (
                  companyApps.map(app => (
                    <div 
                      key={app.id}
                      className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4 hover:border-white/10 transition duration-300"
                      id={`candidate-card-${app.id}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                          <img src={app.studentAvatar} alt={app.studentName} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="font-bold text-slate-100">{app.studentName}</h4>
                            <p className="text-xs text-cyan-400 font-mono">Reputation Score: {app.studentReputation} pts</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${app.status === 'shortlisted' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/10' : 'bg-black/40 text-slate-400 border border-white/5'}`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="space-y-1 bg-black/30 p-3 rounded-lg border border-white/5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Project applying for</span>
                        <span className="text-xs text-slate-300 font-medium">{app.opportunityTitle}</span>
                      </div>

                      {app.submissionText && (
                        <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-cyan-500 pl-3">
                          &ldquo;{app.submissionText}&rdquo;
                        </p>
                      )}

                      <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
                        {app.status === 'applied' && (
                          <button 
                            onClick={() => {
                              updateApplicationStatus(app.id, 'shortlisted');
                              triggerToast(`${app.studentName} shortlisted!`);
                            }}
                            className="bg-white/5 hover:bg-white/10 text-slate-300 px-3.5 py-1.5 rounded-lg border border-white/10 transition cursor-pointer"
                          >
                            Shortlist
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            updateApplicationStatus(app.id, 'hired');
                            triggerToast(`Contract initiated with ${app.studentName}!`);
                          }}
                          className="bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        >
                          Hire Candidate
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Active contracts pipeline */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-slate-200">Active Contracts & Milestone Verification</h3>
              
              <div className="space-y-4">
                {activeContracts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">No ongoing contract works currently registered.</p>
                ) : (
                  activeContracts.map(contract => (
                    <div 
                      key={contract.id}
                      className="bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-100">{contract.opportunityTitle}</h4>
                        <p className="text-xs text-slate-400">Assigned Student: <span className="font-semibold text-slate-300">{contract.studentName}</span></p>
                      </div>

                      <button 
                        onClick={() => setShowRateModal(contract.opportunityId)}
                        className="px-4 py-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 rounded-xl text-xs font-bold text-white transition flex items-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Deliverables
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Posted jobs summary & Reviews */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Posted jobs summary */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-slate-200">Your Posted Positions ({companyOpps.length})</h3>
              
              <div className="space-y-3">
                {companyOpps.map(opp => (
                  <div key={opp.id} className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-xs text-slate-200 truncate max-w-[150px]">{opp.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono ${opp.status === 'completed' ? 'bg-emerald-900/20 text-emerald-300' : 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/10'}`}>
                        {opp.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>Bounty: ${opp.budget}</span>
                      <span>Applicants: {opp.applicantsCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent student reviews */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-slate-200">Recent Builder Reviews</h3>
              
              <div className="space-y-3">
                {!currentCompany?.reviews || currentCompany.reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No completed feedback reviews registered.</p>
                ) : (
                  currentCompany.reviews.map(rev => (
                    <div key={rev.id} className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-300">{rev.authorName}</span>
                        <span className="text-amber-400 font-mono text-xs">★ {rev.rating}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed italic">&ldquo;{rev.comment}&rdquo;</p>
                      <span className="text-[9px] text-slate-600 block text-right font-mono">{rev.createdAt}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Posting Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-slate-300">
          <div className="bg-[#0a0a0f] border border-white/10 w-full max-w-2xl p-6 rounded-3xl space-y-6 relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 text-slate-300" id="opportunity-post-modal">
            <button 
              onClick={() => setShowPostModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Post New Web3 Opportunity</h3>
              <p className="text-xs text-slate-400">Specify details, required tech stacks, and verify the milestone budget escrow.</p>
            </div>

            <form onSubmit={handlePost} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Project / Gig Title</label>
                <input required type="text" placeholder="e.g. Solidity Staking Audit, React UI..." value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Budget Escrow ($)</label>
                <input required type="number" placeholder="500" value={budget || ''} onChange={e => setBudget(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs cursor-pointer text-slate-300 focus:outline-none focus:border-cyan-500">
                  <option value="Crypto" className="bg-[#0a0a0f]">Polygon Crypto (USDC/MATIC)</option>
                  <option value="Stripe" className="bg-[#0a0a0f]">Stripe Credit Card</option>
                  <option value="Razorpay" className="bg-[#0a0a0f]">Razorpay UPI Rails</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Duration (e.g. 2 Weeks)</label>
                <input required type="text" placeholder="3 Weeks" value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Deadline Date</label>
                <input required type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white cursor-pointer" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Required Skill Tags (comma-separated)</label>
                <input required type="text" placeholder="React, Solidity, Figma" value={skills} onChange={e => setSkills(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Difficulty Requirement</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs cursor-pointer text-slate-300 focus:outline-none focus:border-cyan-500">
                  <option value="Beginner" className="bg-[#0a0a0f]">Beginner (Level 1)</option>
                  <option value="Intermediate" className="bg-[#0a0a0f]">Intermediate (Level 2)</option>
                  <option value="Expert" className="bg-[#0a0a0f]">Expert (Level 3)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Location Scope</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Brief Description</label>
                <textarea required rows={3} placeholder="Provide an high-level executive summary of the job..." value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Responsibilities (one statement per line)</label>
                <textarea rows={2} placeholder="Write tasks, guidelines, and quality benchmarks..." value={responsibilities} onChange={e => setResponsibilities(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Deliverables (one item per line)</label>
                <textarea rows={2} placeholder="Github repository, documentation report..." value={deliverables} onChange={e => setDeliverables(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white" />
              </div>

              <div className="sm:col-span-2 flex gap-3 pt-4 border-t border-white/5">
                <button type="submit" className="flex-1 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 py-3 rounded-xl text-xs font-bold transition text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer">Publish Position</button>
                <button type="button" onClick={() => setShowPostModal(false)} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-xs font-semibold cursor-pointer hover:bg-white/10">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completion & Rating Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] border border-white/10 w-full max-w-md p-6 rounded-3xl space-y-5 relative animate-in zoom-in-95 duration-200">
            <div className="space-y-1">
              <h3 className="text-xl font-bold flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                Approve & Release Escrow
              </h3>
              <p className="text-xs text-slate-400">Confirm satisfactory submission of deliverables. Rate candidate to release funds.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Rate student performance</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      onClick={() => setStudentRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${star <= studentRating ? 'text-cyan-400' : 'text-slate-700'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Write a professional review</label>
                <textarea 
                  required
                  placeholder="Provide brief feedback regarding skill, responsiveness, and accuracy..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => handleCompleteProject(showRateModal)}
                  className="flex-1 bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  Approve, Release & Stamp
                </button>
                <button 
                  onClick={() => setShowRateModal(null)}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-xs transition cursor-pointer hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
