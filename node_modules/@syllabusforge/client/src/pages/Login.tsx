import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Lock, Mail, ArrowRight, Shield, UserCheck, BookOpen } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (role: 'FACULTY' | 'HOD' | 'ADMIN') => {
    setError(null);
    setLoading(true);
    try {
      await quickLogin(role);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl relative z-10 border border-slate-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-sky-600/30">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">SyllabusForge</h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional Curriculum & Syllabus Engineering System (Regulation 2026)
          </p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="faculty@institution.edu"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center space-x-1.5 transition-all active:scale-95"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Demo Personas (One-Click Sign In)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuick('FACULTY')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-center transition-all group"
            >
              <BookOpen className="w-4 h-4 text-sky-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 block">Faculty</span>
              <span className="text-[10px] text-slate-400 block truncate">Dr. Sharmila</span>
            </button>

            <button
              onClick={() => handleQuick('HOD')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-center transition-all group"
            >
              <UserCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 block">HoD</span>
              <span className="text-[10px] text-slate-400 block truncate">Dr. Suresh</span>
            </button>

            <button
              onClick={() => handleQuick('ADMIN')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-center transition-all group"
            >
              <Shield className="w-4 h-4 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-800 block">Admin</span>
              <span className="text-[10px] text-slate-400 block truncate">Dean Academics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
