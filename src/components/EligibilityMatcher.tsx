import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, ArrowRight, Award, Phone, Search, Calculator, ChevronDown, AlertCircle } from 'lucide-react';

import { integrationService } from '../../services/integrationService';

const COURSES = [
  "Computer Science", "Information Technology", "Software Engineering", "Mechanical Engineering", 
  "Electrical Engineering", "Civil Engineering", "Architecture", "Medicine", "Nursing", "Pharmacy", 
  "Biotechnology", "Environmental Science", "Psychology", "Economics", "Accounting", 
  "Business Administration", "Marketing", "Finance", "Law", "Political Science", "Sociology", 
  "Anthropology", "Journalism", "Mass Communication", "Education", "International Relations", 
  "Hotel Management", "Tourism Management", "Graphic Design", "Fashion Design", "Fine Arts", 
  "Music", "Performing Arts", "Data Science", "Artificial Intelligence", "Cyber Security", 
  "Cloud Computing", "Blockchain", "Renewable Energy", "Marine Engineering", "Agriculture", 
  "Horticulture", "Public Health", "Physiotherapy", "Occupational Therapy", "Sports Science", 
  "Nutrition & Dietetics", "Veterinary Science", "Social Work", "Psychology & Counseling"
];

const HARDCODED_MATCHES = [
  { name: 'Innovative Minds Institute', image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800', rating: 5.0, scholarship: 100, baseTuition: 3500 },
  { name: 'Lovely Professional University', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800', rating: 4.7, scholarship: 50, baseTuition: 2500 },
  { name: 'Aditya University', image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800', rating: 4.9, scholarship: 50, baseTuition: 2200 },
  { name: 'Reva University', image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=800', rating: 4.6, scholarship: 40, baseTuition: 2800 },
  { name: 'CT University', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800', rating: 4.8, scholarship: 30, baseTuition: 2000 },
];

export default function EligibilityMatcher() {
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form');
  const [loadingMsg, setLoadingMsg] = useState('Analysing profile...');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    course: '',
    level: '',
    points: '',
    qualification: '',
    scholarshipType: '',
  });
  const [results, setResults] = useState<any[]>([]);
  
  // Course Dropdown State
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCourseDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCourses = COURSES.filter(c => c.toLowerCase().includes(courseSearchTerm.toLowerCase()));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneBlur = () => {
    if (formData.phoneNumber.length > 5) {
      // Trigger instant SMS/WhatsApp
      integrationService.sendSMS({
        to_phone_e164: formData.phoneNumber,
        message_body: "Thank you for checking your eligibility with Zambians In India. Your scholarship matches are ready.",
        metadata: { trigger: 'registration', retry_count: 0 }
      });
      
      integrationService.sendWhatsApp({
        to_whatsapp: formData.phoneNumber,
        conversation_type: 'notification',
        student_id: 'prospect',
        template_name: 'eligibility_check_instant',
        template_variables: { name: formData.fullName || 'Student' }
      });
    }
  };

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setLoadingMsg('Analysing profile...');
    
    // Progressive loading messages
    setTimeout(() => {
      setLoadingMsg('5 universities are currently online and are viewing your profile...');
    }, 1500);

    // Simulate API call, lead capture, and matching engine
    setTimeout(() => {
      // Create student profile placeholder
      console.log('[STUDENT PROFILE] Creating profile if not existing for:', formData.fullName);

      // Filter matches based on preference
      let finalMatches = [...HARDCODED_MATCHES];
      if (formData.scholarshipType === '100% Fully Scholarship Only') {
        // Ensure Innovative Minds is at the top
        finalMatches = finalMatches.sort((a, b) => b.scholarship - a.scholarship);
      }

      setResults(finalMatches);
      setStep('results');

      // Trigger Email Notification for Eligibility Results
      integrationService.sendEmail({
        to_email: 'prospect@example.com', // In real app, we'd ask for email too
        subject: 'Your Scholarship Eligibility Results',
        template_id: 'eligibility_results',
        variables: {
          name: formData.fullName,
          course: formData.course,
          topMatch: finalMatches[0].name,
          scholarship: finalMatches[0].scholarship.toString(),
          source: 'eligibility_matcher'
        }
      });
      
      // Scroll to top of results
      window.scrollTo({ top: document.getElementById('eligibility-section')?.offsetTop || 0, behavior: 'smooth' });
    }, 3500);
  };

  return (
    <section id="eligibility-section" className="py-24 bg-slate-950 relative overflow-hidden perspective-1000">
      {/* 3D Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        {/* Futuristic Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" style={{ transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)', transformOrigin: 'top center' }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -30, rotateX: -20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <h2 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-orange-200 to-orange-500 mb-6 drop-shadow-[0_5px_15px_rgba(249,115,22,0.4)] tracking-tight">
              Check Your Eligibility
            </h2>
            <p className="text-xl lg:text-2xl text-slate-300 font-medium max-w-2xl mx-auto">
              See what scholarship you instantly qualify for before applying
            </p>
          </motion.div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] border border-slate-700/50 overflow-hidden relative transform-gpu">
          
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.form 
                key="form"
                initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleMatch} 
                className="p-8 lg:p-14"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Full Names */}
                  <div className="col-span-1 md:col-span-2 group">
                    <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest">Full Names</label>
                    <div className="relative transform transition-transform duration-300 group-focus-within:-translate-y-1">
                      <input 
                        type="text" 
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 rounded-2xl bg-slate-950/50 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-slate-900/80 text-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="col-span-1 md:col-span-2 group">
                    <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest">Phone Number</label>
                    <div className="relative transform transition-transform duration-300 group-focus-within:-translate-y-1">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Phone className="h-6 w-6 text-orange-500/70" />
                      </div>
                      <input 
                        type="tel" 
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        onBlur={handlePhoneBlur}
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-950/50 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-slate-900/80 text-lg"
                        placeholder="e.g. +260 97 000 0000"
                      />
                    </div>
                  </div>

                  {/* Course (Searchable Dropdown) */}
                  <div className="col-span-1 md:col-span-2 group relative" ref={dropdownRef}>
                    <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest">Course</label>
                    <div className="relative transform transition-transform duration-300 group-focus-within:-translate-y-1">
                      <div 
                        className="w-full px-6 py-5 rounded-2xl bg-slate-950/50 border border-slate-700/80 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-slate-900/80 text-lg flex justify-between items-center cursor-pointer"
                        onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                      >
                        <span className={formData.course ? 'text-white' : 'text-slate-500'}>
                          {formData.course || 'Type / Search for your course'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isCourseDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isCourseDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden"
                          >
                            <div className="p-3 border-b border-slate-700 flex items-center bg-slate-900/50">
                              <Search className="w-5 h-5 text-slate-400 mr-3" />
                              <input 
                                type="text"
                                placeholder="Search courses..."
                                value={courseSearchTerm}
                                onChange={(e) => setCourseSearchTerm(e.target.value)}
                                className="w-full bg-transparent text-white outline-none placeholder-slate-500"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                              {filteredCourses.length > 0 ? (
                                filteredCourses.map(course => (
                                  <div 
                                    key={course}
                                    className="px-6 py-3 hover:bg-orange-500/20 hover:text-orange-400 text-slate-300 cursor-pointer transition-colors"
                                    onClick={() => {
                                      setFormData({ ...formData, course });
                                      setIsCourseDropdownOpen(false);
                                      setCourseSearchTerm('');
                                    }}
                                  >
                                    {course}
                                  </div>
                                ))
                              ) : (
                                <div className="px-6 py-4 text-slate-500 text-center">No courses found</div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Level (Radio Buttons) */}
                  <div className="col-span-1 md:col-span-2 group">
                    <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">Level</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className={`relative flex items-center justify-center p-5 rounded-2xl cursor-pointer border-2 transition-all transform hover:-translate-y-1 ${formData.level === 'Undergraduate' ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'bg-slate-950/50 border-slate-700/80 hover:border-slate-500'}`}>
                        <input type="radio" name="level" value="Undergraduate" className="sr-only" onChange={handleInputChange} required />
                        <span className={`font-bold text-lg ${formData.level === 'Undergraduate' ? 'text-orange-400' : 'text-slate-300'}`}>Undergraduate</span>
                        {formData.level === 'Undergraduate' && <Check className="absolute right-4 w-5 h-5 text-orange-500" />}
                      </label>
                      <label className={`relative flex items-center justify-center p-5 rounded-2xl cursor-pointer border-2 transition-all transform hover:-translate-y-1 ${formData.level === 'Postgraduate' ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'bg-slate-950/50 border-slate-700/80 hover:border-slate-500'}`}>
                        <input type="radio" name="level" value="Postgraduate" className="sr-only" onChange={handleInputChange} required />
                        <span className={`font-bold text-lg ${formData.level === 'Postgraduate' ? 'text-orange-400' : 'text-slate-300'}`}>Postgraduate</span>
                        {formData.level === 'Postgraduate' && <Check className="absolute right-4 w-5 h-5 text-orange-500" />}
                      </label>
                    </div>
                  </div>

                  {/* Dynamic Fields based on Level */}
                  <AnimatePresence mode="wait">
                    {formData.level === 'Undergraduate' && (
                      <motion.div 
                        key="undergrad"
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="col-span-1 md:col-span-2 group"
                      >
                        <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest">
                          Enter total points in best 5 subjects <span className="text-orange-400 text-xs normal-case">(include English as #5)</span>
                        </label>
                        <div className="relative transform transition-transform duration-300 group-focus-within:-translate-y-1">
                          <input 
                            type="number" 
                            name="points"
                            required
                            min="5"
                            max="45"
                            value={formData.points}
                            onChange={handleInputChange}
                            className="w-full px-6 py-5 rounded-2xl bg-slate-950/50 border border-slate-700/80 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-slate-900/80 text-lg"
                            placeholder="e.g. 12"
                          />
                        </div>
                      </motion.div>
                    )}

                    {formData.level === 'Postgraduate' && (
                      <motion.div 
                        key="postgrad"
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="col-span-1 md:col-span-2 group"
                      >
                        <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest">Enter highest qualification</label>
                        <div className="relative transform transition-transform duration-300 group-focus-within:-translate-y-1">
                          <select 
                            name="qualification"
                            required
                            value={formData.qualification}
                            onChange={handleInputChange}
                            className="w-full px-6 py-5 rounded-2xl bg-slate-950/50 border border-slate-700/80 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-slate-900/80 text-lg appearance-none cursor-pointer"
                          >
                            <option value="" className="text-slate-500">Select qualification...</option>
                            <option value="Bachelor Degree" className="bg-slate-800 text-white">Bachelor Degree</option>
                            <option value="Postgraduate Diploma" className="bg-slate-800 text-white">Postgraduate Diploma</option>
                            <option value="Masters Degree" className="bg-slate-800 text-white">Masters Degree</option>
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scholarship Type */}
                  <div className="col-span-1 md:col-span-2 group">
                    <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest">Scholarship Type</label>
                    <div className="relative transform transition-transform duration-300 group-focus-within:-translate-y-1">
                      <select 
                        name="scholarshipType"
                        required
                        value={formData.scholarshipType}
                        onChange={handleInputChange}
                        className="w-full px-6 py-5 rounded-2xl bg-slate-950/50 border border-slate-700/80 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-slate-900/80 text-lg appearance-none cursor-pointer"
                      >
                        <option value="" className="text-slate-500">Select preference...</option>
                        <option value="50% Govt + 50% Student" className="bg-slate-800 text-white">50% Govt + 50% Student</option>
                        <option value="100% Fully Scholarship Only" className="bg-slate-800 text-white">100% Fully Scholarship Only</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-span-1 md:col-span-2 mt-8">
                    <motion.button 
                      whileHover={{ scale: 1.02, translateY: -2 }}
                      whileTap={{ scale: 0.98, translateY: 2 }}
                      type="submit"
                      className="w-full bg-gradient-to-b from-orange-400 to-orange-600 text-white font-black text-2xl py-6 rounded-2xl transition-all flex items-center justify-center shadow-[0_15px_30px_rgba(249,115,22,0.4),inset_0_2px_0_rgba(255,255,255,0.3)] border border-orange-500 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                      <span className="relative z-10 flex items-center drop-shadow-md">
                        Check Eligibility <ArrowRight className="w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </motion.button>
                  </div>
                  
                  {/* Course Not Found Link */}
                  <div className="col-span-1 md:col-span-2 text-center mt-2">
                    <a href="/?view=APPLY_ONLINE" className="inline-flex items-center text-slate-400 hover:text-orange-400 transition-colors font-medium text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Can't find your course? Apply to all universities offering your course
                    </a>
                  </div>
                </div>
              </motion.form>
            )}

            {step === 'loading' && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="p-20 flex flex-col items-center justify-center text-center min-h-[600px]"
              >
                <div className="relative w-32 h-32 mb-10">
                  {/* 3D Spinner */}
                  <div className="absolute inset-0 border-4 border-slate-700/50 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                  <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin shadow-[0_0_30px_rgba(249,115,22,0.5)]"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-b-transparent animate-[spin_2s_linear_infinite_reverse] scale-75 opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="w-10 h-10 text-orange-400 animate-pulse drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                  </div>
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4">
                  {loadingMsg}
                </h3>
                <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mt-6 shadow-inner">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-orange-500 to-emerald-500"
                  />
                </div>
              </motion.div>
            )}

            {step === 'results' && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="p-6 lg:p-12"
              >
                <div className="text-center mb-12">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5),inset_0_4px_10px_rgba(255,255,255,0.4)] border-4 border-emerald-900"
                  >
                    <Check className="w-12 h-12 drop-shadow-md" />
                  </motion.div>
                  <h3 className="text-4xl lg:text-5xl font-black text-white mb-4 drop-shadow-lg">Matches Found, {formData.fullName.split(' ')[0]}!</h3>
                  <p className="text-slate-300 text-xl font-medium">Based on your profile, you qualify for the following offers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {results.map((uni, idx) => {
                    const finalTuition = uni.baseTuition - (uni.baseTuition * (uni.scholarship / 100));
                    const isTopMatch = idx === 0;

                    return (
                      <motion.div 
                        key={uni.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 + 0.3 }}
                        whileHover={{ y: -10, scale: 1.02, rotateY: 2 }}
                        className={`bg-slate-800/90 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] border backdrop-blur-md group relative transform-gpu perspective-1000 ${isTopMatch ? 'border-orange-500 ring-2 ring-orange-500/50' : 'border-slate-700'}`}
                      >
                        {/* Highlight glow for top match */}
                        {isTopMatch && (
                          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent z-0 pointer-events-none"></div>
                        )}

                        <div className="h-56 relative overflow-hidden z-10">
                          <img src={uni.image} alt={uni.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                          
                          {/* Scholarship Badge */}
                          <div className="absolute top-5 right-5 z-20">
                            <div className={`px-5 py-2 rounded-2xl font-black text-sm shadow-[0_10px_20px_rgba(0,0,0,0.5)] backdrop-blur-md border ${
                              uni.scholarship === 100 
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400' 
                                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-400'
                            }`}>
                              {uni.scholarship}% Funded
                            </div>
                          </div>

                          <div className="absolute bottom-5 left-6 right-6 z-20">
                            <h4 className="text-white font-black text-2xl leading-tight drop-shadow-lg">{uni.name}</h4>
                            <div className="flex items-center mt-2 bg-black/40 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white text-sm ml-1.5 font-bold">{uni.rating} Rating</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-8 relative z-10">
                          <div className="mb-6">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Selected Course</p>
                            <p className="text-white font-bold text-xl">{formData.course}</p>
                          </div>

                          {/* Financial Calculator */}
                          <div className="bg-slate-950/50 rounded-2xl p-5 mb-8 border border-slate-700/50 shadow-inner">
                            <div className="flex items-center mb-3 text-slate-300">
                              <Calculator className="w-5 h-5 mr-2 text-orange-400" />
                              <span className="font-bold text-sm uppercase tracking-wider">Financial Estimate</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between text-slate-400">
                                <span>Base Tuition / Year:</span>
                                <span>${uni.baseTuition?.toLocaleString() || '0'}</span>
                              </div>
                              <div className="flex justify-between text-emerald-400 font-medium">
                                <span>Scholarship ({uni.scholarship}%):</span>
                                <span>-${(uni.baseTuition * (uni.scholarship / 100))?.toLocaleString() || '0'}</span>
                              </div>
                              <div className="w-full h-px bg-slate-700 my-2"></div>
                              <div className="flex justify-between text-white font-black text-lg">
                                <span>Final Tuition:</span>
                                <span>${finalTuition?.toLocaleString() || '0'}</span>
                              </div>
                            </div>
                          </div>
                          
                          {uni.name === 'Innovative Minds Institute' ? (
                            <a 
                              href="/?view=SCHOLARSHIP_EXAM" 
                              className="block w-full text-center bg-gradient-to-b from-orange-400 to-orange-600 text-white font-black text-xl py-5 rounded-2xl hover:from-orange-500 hover:to-orange-700 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.4),inset_0_2px_0_rgba(255,255,255,0.3)] border border-orange-500 transform hover:-translate-y-1"
                            >
                              Take Scholarship Exam
                            </a>
                          ) : (
                            <a 
                              href="/?view=APPLY_ONLINE" 
                              className="block w-full text-center bg-gradient-to-b from-slate-600 to-slate-800 text-white font-black text-xl py-5 rounded-2xl hover:from-slate-500 hover:to-slate-700 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.1)] border border-slate-500 transform hover:-translate-y-1"
                            >
                              Apply Now
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-16 text-center">
                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center justify-center text-slate-400 mb-8"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest mb-2">Keep scrolling down</span>
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={() => setStep('form')}
                      className="text-slate-300 font-bold hover:text-white transition-colors border-2 border-slate-700 px-8 py-3 rounded-full hover:bg-slate-800 hover:border-slate-600"
                    >
                      Check Another Profile
                    </button>
                    <a href="/?view=APPLY_ONLINE" className="text-orange-400 font-bold hover:text-orange-300 transition-colors px-8 py-3">
                      Can't find your course? Apply here
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
