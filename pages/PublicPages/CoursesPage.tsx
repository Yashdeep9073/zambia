import React, { useState } from 'react';
import { 
  Search, Bot, X, Info, CheckCircle, Star, TrendingUp, Download, 
  Share2, Scale, Award, MapPin, Youtube, Rocket, Briefcase, Coffee, 
  Book, Smile, Plane, DollarSign, Globe, Heart, Phone, ChevronDown, 
  ArrowRight, Loader, Calendar, Building, Check, ChevronUp, ShieldCheck, BookOpen
} from 'lucide-react';
import { PublicView, Course, University } from '../../types';
import Footer from '../../components/Footer';

interface CoursesPageProps {
  onNavigate: (view: PublicView) => void;
  FULL_COURSES_DATA: Course[];
  UNIVERSITIES_LIST: University[];
}

const CoursesPage: React.FC<CoursesPageProps> = ({
  onNavigate, FULL_COURSES_DATA, UNIVERSITIES_LIST
}) => {
  const [courseSearch, setCourseSearch] = useState('');
  const [courseFilterType, setCourseFilterType] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [compareList, setCompareList] = useState<Course[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const filteredCourses = FULL_COURSES_DATA.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesType = courseFilterType === 'All' || c.type === courseFilterType;
    return matchesSearch && matchesType;
  });

  const toggleCompare = (course: Course) => {
    if (compareList.find(c => c.id === course.id)) {
      setCompareList(compareList.filter(c => c.id !== course.id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, course]);
      } else {
        alert("You can only compare up to 3 courses at a time.");
      }
    }
  };

  const handleAIRecommendation = () => {
    setAiAnalyzing(true);
    setShowAIRecommendation(true);
    setTimeout(() => {
      setAiAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
        {/* Modals */}
        {selectedCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
                    <button onClick={() => setSelectedCourse(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 z-10"><X className="w-6 h-6"/></button>
                    
                    <div className="h-48 bg-slate-900 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-slate-900 opacity-90"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">{selectedCourse.type}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">{selectedCourse.name}</h2>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><Info className="w-5 h-5 mr-2 text-emerald-600"/> Course Description</h3>
                                <p className="text-slate-600 leading-relaxed">{selectedCourse.description}</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500"/> Why Study This Course?</h3>
                                <ul className="grid grid-cols-1 gap-3">
                                    {selectedCourse.whyStudy.map((point, i) => (
                                        <li key={i} className="flex items-start text-slate-700">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5"/>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-blue-600"/> Career Opportunities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCourse.careerOpportunities.map((job, i) => (
                                        <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm border border-blue-100">{job}</span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-4">Course Details</h4>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500">Duration</span>
                                        <span className="font-bold text-slate-900">{selectedCourse.duration}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500">Avg. Salary</span>
                                        <span className="font-bold text-emerald-600 text-right w-1/2">{selectedCourse.averageSalary}</span>
                                    </div>
                                    <div className="flex flex-col border-b border-slate-200 pb-2">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-slate-500">Tuition Est.</span>
                                            <span className="font-bold text-slate-900 text-right w-1/2">{selectedCourse.tuition}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 italic text-right">*On full self sponsorship. Scholarship will reduce this fee.</span>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 transition">Apply Now</button>
                                    <button className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 flex items-center justify-center">
                                        <Download className="w-4 h-4 mr-2"/> Download Brochure
                                    </button>
                                    <button className="w-full bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-100 flex items-center justify-center">
                                        <Share2 className="w-4 h-4 mr-2"/> Share This Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 border-t border-slate-100 flex justify-end">
                        <button onClick={() => setSelectedCourse(null)} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition">Close</button>
                    </div>
                </div>
            </div>
        )}

        {showCompareModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-x-auto">
                <div className="bg-white rounded-2xl w-full max-w-6xl p-6 relative animate-fade-in-up">
                    <button onClick={() => setShowCompareModal(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X className="w-6 h-6"/></button>
                    <h2 className="text-2xl font-bold mb-6">Course Comparison</h2>
                    <div className="grid grid-cols-4 gap-4 min-w-[800px]">
                        <div className="col-span-1 space-y-4 pt-12 font-bold text-slate-500">
                            <div className="h-10 flex items-center">Duration</div>
                            <div className="h-10 flex items-center">Tuition</div>
                            <div className="h-10 flex items-center">Salary Potential</div>
                            <div className="h-10 flex items-center">Level</div>
                        </div>
                        {compareList.map(c => (
                            <div key={c.id} className="col-span-1 space-y-4 border-l pl-4">
                                <h3 className="font-bold text-lg h-12 flex items-center">{c.name}</h3>
                                <div className="h-10 flex items-center bg-slate-50 px-2 rounded">{c.duration}</div>
                                <div className="h-10 flex items-center bg-slate-50 px-2 rounded text-sm">{c.tuition}</div>
                                <div className="h-10 flex items-center bg-slate-50 px-2 rounded text-sm">{c.averageSalary}</div>
                                <div className="h-10 flex items-center bg-slate-50 px-2 rounded">{c.type}</div>
                                <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold text-xs hover:bg-emerald-700 transition">Apply</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {selectedUniversity && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-900/95 backdrop-blur-md overflow-y-auto">
                <div className="bg-white md:rounded-3xl w-full max-w-5xl h-full md:h-auto md:max-h-[95vh] overflow-y-auto relative animate-fade-in-up shadow-2xl flex flex-col">
                    
                    <div className="relative bg-slate-900 text-white shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <button onClick={() => setSelectedUniversity(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition">
                                <X className="w-6 h-6"/>
                            </button>
                        </div>

                        <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-2 shadow-xl flex items-center justify-center shrink-0">
                                {selectedUniversity.logo ? (
                                    <img src={selectedUniversity.logo} alt={selectedUniversity.name} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <Building className="w-12 h-12 text-slate-300"/>
                                )}
                            </div>
                            <div className="flex-grow space-y-2">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedUniversity.rank <= 100 && (
                                        <span className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center shadow-lg">
                                            <Award className="w-3 h-3 mr-1"/> Top 100 India University
                                        </span>
                                    )}
                                    {selectedUniversity.id === 'ct-university' && (
                                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center shadow-lg animate-pulse">
                                            <Star className="w-3 h-3 mr-1"/> Most Highly Recommended
                                        </span>
                                    )}
                                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center shadow-lg">
                                        <CheckCircle className="w-3 h-3 mr-1"/> Verified & Inspected
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">{selectedUniversity.name}</h2>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-300 font-medium">
                                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-orange-500"/> {selectedUniversity.location}</span>
                                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-emerald-500"/> Est. {selectedUniversity.establishedYear || '19XX'}</span>
                                    <span className="flex items-center"><Building className="w-4 h-4 mr-1 text-blue-500"/> {selectedUniversity.type || 'Private University'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                            <div className="lg:col-span-2 p-6 md:p-10 space-y-10 border-r border-slate-100">
                                <section className="rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-black relative aspect-video group">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={selectedUniversity.youtubeUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
                                        title="University Video" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><ShieldCheck className="w-6 h-6 mr-2 text-emerald-600"/> Verified Overview</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: "Campus Size", val: selectedUniversity.campusSize || "100+ Acres", icon: MapPin },
                                            { label: "Students", val: selectedUniversity.studentCount || "15,000+", icon: Users },
                                            { label: "Intl. Students", val: selectedUniversity.internationalCount || "500+", icon: Globe },
                                            { label: "Faculties", val: selectedUniversity.facultyCount || "12+", icon: BookOpen },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center hover:shadow-md transition">
                                                <stat.icon className="w-6 h-6 mx-auto mb-2 text-slate-400"/>
                                                <div className="font-bold text-slate-900 text-lg">{stat.val}</div>
                                                <div className="text-xs text-slate-500 font-bold uppercase">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                                    <h3 className="text-xl font-bold mb-6 flex items-center relative z-10"><Rocket className="w-6 h-6 mr-2 text-orange-500"/> Why Study Here?</h3>
                                    <ul className="space-y-4 relative z-10">
                                        {(selectedUniversity.whyStudy || [
                                            "Strong industry linkages & partnerships.",
                                            "High employability rate for graduates.",
                                            "International student-friendly campus.",
                                            "Modern infrastructure & labs.",
                                            "Dedicated placement cell."
                                        ]).map((point, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="bg-orange-500/20 p-1 rounded-full mr-3 mt-0.5">
                                                    <Check className="w-4 h-4 text-orange-400"/>
                                                </div>
                                                <span className="font-medium text-lg leading-snug">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Briefcase className="w-6 h-6 mr-2 text-blue-600"/> Career Outcomes</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {(selectedUniversity.careerOutcomes || ["Software Engineer", "Manager", "Researcher", "Entrepreneur"]).map((career, i) => (
                                            <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold border border-blue-100 flex items-center">
                                                <TrendingUp className="w-4 h-4 mr-2 opacity-50"/> {career}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Coffee className="w-6 h-6 mr-2 text-orange-600"/> Campus Life & Facilities</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {(selectedUniversity.facilities || ["Hostels", "Library", "Sports", "Labs", "Cafeteria", "Medical"]).map((fac, i) => (
                                            <div key={i} className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2"/>
                                                <span className="text-sm font-bold text-slate-700">{fac}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section id="courses-section">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Book className="w-6 h-6 mr-2 text-indigo-600"/> Faculties & Courses</h3>
                                    <div className="space-y-2">
                                        {(selectedUniversity.faculties || ["Engineering", "Management", "Science", "Arts", "Law"]).map((faculty, i) => (
                                            <div key={i} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition cursor-pointer group">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-slate-800">{faculty}</span>
                                                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600"/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="mt-4 text-emerald-600 font-bold text-sm hover:underline flex items-center">
                                        View Detailed Course List <ArrowRight className="w-4 h-4 ml-1"/>
                                    </button>
                                </section>
                            </div>

                            <div className="bg-slate-50 p-6 md:p-8 border-l border-slate-100 space-y-8">
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center"><DollarSign className="w-5 h-5 mr-2 text-emerald-600"/> Estimated Cost</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <span className="text-sm text-slate-500">Tuition (Sem)</span>
                                            <span className="font-bold text-slate-900">{selectedUniversity.costEstimate?.tuition || "K5,000 - K7,000"}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <span className="text-sm text-slate-500">Hostel</span>
                                            <span className="font-bold text-slate-900">{selectedUniversity.costEstimate?.accommodation || "K3,000"}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <span className="text-sm text-slate-500">Meals</span>
                                            <span className="font-bold text-emerald-600">{selectedUniversity.costEstimate?.meals || "Included"}</span>
                                        </div>
                                        <div className="bg-emerald-50 p-3 rounded-lg text-center">
                                            <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">Scholarship Available</span>
                                            <span className="text-2xl font-black text-emerald-600">{selectedUniversity.scholarship}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 sticky top-4">
                                    <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
                                        Apply Now <ArrowRight className="w-5 h-5 ml-2"/>
                                    </button>
                                    <button onClick={() => setShowCompareModal(true)} className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center">
                                        <Scale className="w-5 h-5 mr-2"/> Compare University
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Hero Section */}
        <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Courses & Programs</h1>
                <p className="text-emerald-100 max-w-2xl mx-auto text-base md:text-lg">
                    Discover world-class accredited programs from India's top universities.
                </p>
                
                <div className="mt-6 bg-orange-600/90 backdrop-blur text-white py-2 px-6 rounded-full inline-block font-bold text-sm md:text-base animate-pulse shadow-lg border border-orange-400">
                    ⏳ June 2026 Intake: <span className="text-yellow-300">14 Days Left</span> to Apply for 100% Scholarship!
                </div>

                <div className="mt-8 max-w-2xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"/>
                    <input 
                        type="text" 
                        placeholder="Search for a course (e.g. Nursing, Engineering)..." 
                        className="w-full pl-12 pr-4 py-4 rounded-full text-slate-900 font-bold focus:ring-4 focus:ring-emerald-500 outline-none shadow-xl"
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                    />
                    <button 
                        onClick={handleAIRecommendation}
                        className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 rounded-full font-bold text-xs md:text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg flex items-center transition transform hover:scale-105"
                    >
                        <Bot className="w-4 h-4 mr-2"/> Ask AI
                    </button>
                </div>
            </div>
        </div>

        {/* AI Recommendation Modal */}
        {showAIRecommendation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-md relative animate-fade-in-up overflow-hidden shadow-2xl">
                    <button onClick={() => setShowAIRecommendation(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 z-10"><X className="w-5 h-5"/></button>
                    
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
                        <Bot className="w-12 h-12 mx-auto mb-3 text-white/90"/>
                        <h2 className="text-2xl font-bold">ZII AI Advisor</h2>
                        <p className="text-indigo-100 text-sm">Personalized University Matching</p>
                    </div>

                    <div className="p-6">
                        {aiAnalyzing ? (
                            <div className="text-center py-8 space-y-4">
                                <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto"/>
                                <p className="text-slate-600 font-medium animate-pulse">Analyzing scholarship trends...</p>
                                <p className="text-slate-400 text-xs">Matching your profile with 100+ universities</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 shrink-0"/>
                                    <div>
                                        <h3 className="font-bold text-green-800">Top Recommendation Found!</h3>
                                        <p className="text-sm text-green-700 mt-1">Based on current scholarship availability and job market trends, we highly recommend:</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div onClick={() => { setShowAIRecommendation(false); setSelectedUniversity(UNIVERSITIES_LIST.find(u => u.id === 'ct-university') || null); }} className="p-4 border border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Best Overall</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500"/>
                                        </div>
                                        <h4 className="font-bold text-slate-900">CT University</h4>
                                        <p className="text-xs text-slate-500">Highest Scholarship (100%) • Modern Campus</p>
                                    </div>

                                    <div onClick={() => { setShowAIRecommendation(false); setSelectedUniversity(UNIVERSITIES_LIST.find(u => u.id === 'lamrin-tech') || null); }} className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Best for Skills</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500"/>
                                        </div>
                                        <h4 className="font-bold text-slate-900">Lamrin Tech Skills University</h4>
                                        <p className="text-xs text-slate-500">IBM & Tata Partners • Guaranteed Jobs</p>
                                    </div>
                                </div>

                                <button onClick={() => setShowAIRecommendation(false)} className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-200">
                                    Close Recommendation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-0 z-30">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['All', 'Undergraduate', 'Postgraduate', 'Diploma'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setCourseFilterType(type)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${courseFilterType === type ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                
                <div className="flex items-center gap-3">
                    {compareList.length > 0 && (
                        <button 
                            onClick={() => setShowCompareModal(true)}
                            className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-700 shadow-md animate-pulse"
                        >
                            Compare ({compareList.length}) Courses
                        </button>
                    )}
                    
                    <button 
                        onClick={() => onNavigate(PublicView.APPLY_ONLINE)} 
                        className="bg-slate-800 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-700 shadow-md"
                    >
                        Compare Universities
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl border border-slate-200 hover:shadow-xl transition group flex flex-col h-full">
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{course.type}</span>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="checkbox" 
                                        checked={!!compareList.find(c => c.id === course.id)}
                                        onChange={() => toggleCompare(course)}
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-xs text-slate-400">Compare</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-emerald-700 transition">{course.name}</h3>
                            <p className="text-sm text-slate-500 line-clamp-3 mb-4">{course.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex gap-3">
                            <button onClick={() => setSelectedCourse(course)} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition">
                                View Details
                            </button>
                            <button onClick={() => onNavigate(PublicView.APPLY_ONLINE)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition shadow-sm">
                                Apply
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center"><Award className="w-6 h-6 text-yellow-500 mr-3"/> Top 100 Universities in India</h2>
                    <button className="text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20">View Methodology</button>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    {UNIVERSITIES_LIST.map((uni) => (
                        <div key={uni.id} className={`p-6 border-b border-slate-100 flex items-center hover:bg-slate-50 transition ${uni.rank <= 2 ? 'bg-yellow-50/50' : ''}`}>
                            <div className="w-12 h-12 flex items-center justify-center font-bold text-xl text-slate-400 mr-6">
                                {uni.rank === 1 ? <span className="text-4xl">🥇</span> : uni.rank === 2 ? <span className="text-4xl">🥈</span> : `#${uni.rank}`}
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg text-slate-900">{uni.name}</h3>
                                    {uni.isPartner && <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Partner</span>}
                                    {uni.rank === 1 && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold flex items-center"><Star className="w-3 h-3 mr-1"/> Most Recommended</span>}
                                </div>
                                <p className="text-sm text-slate-500 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {uni.location}</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-emerald-600">{uni.scholarship}</div>
                                <button onClick={() => setSelectedUniversity(uni)} className="text-xs text-slate-400 hover:text-orange-600 underline mt-1">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
        <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default CoursesPage;
