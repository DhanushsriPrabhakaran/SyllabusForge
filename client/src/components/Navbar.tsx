import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CourseType } from '@syllabusforge/shared';
import {
  FileText,
  PlusCircle,
  ShieldCheck,
  CheckSquare,
  LogOut,
  User as UserIcon,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onNewCourse?: (type: CourseType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewCourse }) => {
  const { user, logout, quickLogin } = useAuth();
  const navigate = useNavigate();
  const [showTypeModal, setShowTypeModal] = useState(false);

  const handleSelectType = (type: CourseType) => {
    setShowTypeModal(false);
    if (onNewCourse) {
      onNewCourse(type);
    } else {
      navigate(`/courses/new?type=${type}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Regulation Badge */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  SyllabusForge
                </span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800">
                  Reg 2026
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-100 transition-colors"
            >
              Dashboard
            </Link>
            {(user?.role === 'HOD' || user?.role === 'ADMIN') && (
              <Link
                to="/reviews"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
              >
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Review Queue</span>
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-100 transition-colors flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin & ACM</span>
              </Link>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Quick Role Switcher Pill for reviewer/faculty test */}
            <div className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <span className="px-2 text-slate-400">Switch:</span>
              <button
                onClick={() => quickLogin('FACULTY')}
                className={`px-2 py-1 rounded ${
                  user?.role === 'FACULTY' ? 'bg-white shadow-sm text-sky-700 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Faculty
              </button>
              <button
                onClick={() => quickLogin('HOD')}
                className={`px-2 py-1 rounded ${
                  user?.role === 'HOD' ? 'bg-white shadow-sm text-emerald-700 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                HoD
              </button>
              <button
                onClick={() => quickLogin('ADMIN')}
                className={`px-2 py-1 rounded ${
                  user?.role === 'ADMIN' ? 'bg-white shadow-sm text-purple-700 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* New Syllabus Button */}
            <button
              onClick={() => setShowTypeModal(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium shadow-sm transition-all shadow-sky-600/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Syllabus</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight">{user?.name}</div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {user?.role} • {user?.department}
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* New Course Type Chooser Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create New Syllabus</h3>
            <p className="text-sm text-slate-600 mb-5">
              Select the course structure template for Regulation 2026. The wizard will customize sections and compliance checks accordingly.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleSelectType('THEORY')}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all flex items-start space-x-3.5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                  TH
                </div>
                <div>
                  <div className="font-semibold text-slate-900 group-hover:text-sky-700">1. Theory Course</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Classroom lecture & tutorial format (e.g., 3-1-0 or 3-0-0). 6–8 COs, CATs + Assignments + Terminal Exam, modules and textbook recency checks.
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSelectType('PRACTICAL')}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-start space-x-3.5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                  PR
                </div>
                <div>
                  <div className="font-semibold text-slate-900 group-hover:text-emerald-700">2. Practical (Laboratory) Course</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    L=0, T=0, credits = P/2. General CO Pool (Cognitive, Affective, Psychomotor), 13 lab objectives, Schwab/Herron openness levels, Annexure 1 course plan.
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSelectType('TCP')}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all flex items-start space-x-3.5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                  TCP
                </div>
                <div>
                  <div className="font-semibold text-slate-900 group-hover:text-indigo-700">3. Theory cum Practical (TCP)</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Combined theory & lab contact hours. TE type (TCP-T or TCP-P), continuous assessment weightage table, combined COs with PO6–PO11 mapping.
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowTypeModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
