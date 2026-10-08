import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Course, CourseType } from '@syllabusforge/shared';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  PlusCircle,
  Copy,
  ExternalLink,
  Trash2,
  Eye,
  Edit3,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  useEffect(() => {
    loadCourses();
  }, [user]);

  async function loadCourses() {
    try {
      setLoading(true);
      const data = await api.getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this syllabus draft?')) return;
    try {
      await api.deleteCourse(id);
      loadCourses();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleRevise = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.reviseCourse(id);
      navigate(`/courses/${res.course._id}`);
    } catch (err: any) {
      alert(`Revision error: ${err.message}`);
    }
  };

  // Filtered courses
  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      (c.courseName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.courseCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesType = selectedType === 'ALL' || c.courseType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Summary counts
  const draftsCount = courses.filter(c => c.status === 'DRAFT').length;
  const submittedCount = courses.filter(c => c.status === 'SUBMITTED').length;
  const approvedCount = courses.filter(c => c.status === 'APPROVED' || c.status === 'FINALIZED').length;
  const returnedCount = courses.filter(c => c.status === 'RETURNED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-800 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-200 border border-white/20 mb-3">
            Regulation 2026 Curriculum Framework
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Create, validate, and manage university course syllabi with automated institutional compliance, Thiagarajar Proficiency Scale taxonomy, and direct Academic Council Meeting (ACM) export.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedStatus('DRAFT')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'DRAFT'
              ? 'bg-sky-50 border-sky-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">My Drafts</span>
            <Edit3 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{draftsCount}</div>
          <div className="text-xs text-slate-500 mt-1">In progress editing</div>
        </div>

        <div
          onClick={() => setSelectedStatus('SUBMITTED')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'SUBMITTED'
              ? 'bg-amber-50 border-amber-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Submitted</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{submittedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Awaiting HoD review</div>
        </div>

        <div
          onClick={() => setSelectedStatus('RETURNED')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'RETURNED'
              ? 'bg-rose-50 border-rose-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Needs Changes</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{returnedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Returned with remarks</div>
        </div>

        <div
          onClick={() => setSelectedStatus('APPROVED')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'APPROVED'
              ? 'bg-emerald-50 border-emerald-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{approvedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Ready for ACM export</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by course code or title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="RETURNED">Returned</option>
            <option value="APPROVED">Approved</option>
            <option value="FINALIZED">Finalized</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700"
          >
            <option value="ALL">All Course Types</option>
            <option value="THEORY">Theory</option>
            <option value="PRACTICAL">Practical (Lab)</option>
            <option value="TCP">Theory cum Practical</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading course syllabi...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No course syllabi found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or create a new syllabus.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(c => (
            <div
              key={c._id}
              onClick={() => navigate(`/courses/${c._id}`)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {c.courseCode}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                      c.status === 'APPROVED' || c.status === 'FINALIZED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'SUBMITTED'
                        ? 'bg-amber-100 text-amber-800'
                        : c.status === 'RETURNED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-sky-700 transition-colors">
                  {c.courseName || 'Untitled Course'}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  {c.courseType} • {c.categoryAbbr} • Credits: {c.credits} (L-T-P: {c.L}-{c.T}-{c.P})
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {c.preamble || 'No preamble defined yet.'}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Semester {c.semester}</span>
                <div className="flex items-center space-x-1">
                  {(c.status === 'APPROVED' || c.status === 'FINALIZED') && (
                    <button
                      onClick={e => handleRevise(c._id!, e)}
                      title="Clone as new revision"
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {c.status === 'DRAFT' && (
                    <button
                      onClick={e => handleDelete(c._id!, e)}
                      title="Delete draft"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
