
import React, { useEffect } from 'react';
import { PublicView } from '../types';
import Footer from '../components/Footer';
import { Shield, Building, Globe, Lock, FileText, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface LegalPagesProps {
  view: PublicView;
  onNavigate: (view: PublicView) => void;
}

const LegalPages: React.FC<LegalPagesProps> = ({ view, onNavigate }) => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const renderContent = () => {
    switch (view) {
      case PublicView.LEGAL_STATUS:
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Legal Status & Institutional Disclosure</h1>
            <div className="prose max-w-none text-slate-700 space-y-6">
              <p>Zambians In India (ZII) is an independent international education facilitation and student mobility platform based both in Lusaka, Zambia and New Delhi, India.</p>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold mb-4">Entity Details</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Registered Entity Name:</strong> Zambians In India Limited</li>
                  <li><strong>Registration Number:</strong> 108965298</li>
                  <li><strong>Place of Registration:</strong> Republic of Zambia</li>
                  <li><strong>Registered Office Address:</strong> Roma Park, Lusaka, Zambia</li>
                  <li><strong>Official Contact Email:</strong> info@zambiansinindia.com</li>
                  <li><strong>Official Phone:</strong> +260 762 523 854</li>
                  <li><strong>Office Hours:</strong> Monday–Saturday, 08:00–18:00 CAT</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                 <h3 className="text-lg font-bold mb-4">Directors</h3>
                 <ul className="list-disc pl-5">
                    <li>Mr. Daniel Mwale</li>
                    <li>Mr. Kumar</li>
                 </ul>
              </div>

              <div className="p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
                <h3 className="text-amber-900 font-bold mb-2 flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/> Important Disclaimer</h3>
                <p className="text-sm text-amber-800 mb-2">Zambians In India operates as an independent advisory and facilitation body connecting Zambian students with accredited Indian higher education institutions.</p>
                <p className="text-sm text-amber-800 font-bold">Zambians In India is NOT:</p>
                <ul className="list-disc pl-5 text-sm text-amber-800">
                  <li>The Government of India</li>
                  <li>The Government of Zambia</li>
                  <li>The High Commission of India</li>
                  <li>The Indian Visa Authority</li>
                </ul>
                <p className="text-sm text-amber-800 mt-4">All visa applications are processed exclusively via the official Government of India portal. We redirect students to the site. ZII does NOT issue visas or approve visas.</p>
              </div>
            </div>
          </>
        );

      case PublicView.PARTNER_UNIVERSITIES:
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Partner Universities & Institutional Affiliations</h1>
            <div className="prose max-w-none text-slate-700 space-y-6">
              <p>Zambians In India collaborates with accredited universities across India that meet our academic quality, compliance, and student welfare standards.</p>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold mb-4">Our University Vetting Process</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Academic accreditation verification</li>
                  <li>Campus inspection (physical or verified digital review)</li>
                  <li>Student safety and welfare evaluation</li>
                  <li>Infrastructure audit</li>
                  <li>International student support review</li>
                  <li>Financial transparency review</li>
                  <li>Visa compliance history check</li>
                  <li>Alumni outcome performance</li>
                  <li>Regulatory recognition confirmation</li>
                  <li>Ethical recruitment compliance</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Sample Partner Universities</h3>
                <ul className="space-y-4">
                  <li className="p-4 border border-slate-200 rounded-lg">
                    <strong>CT UNIVERSITY</strong> – Official Website: <a href="https://www.ctuniversity.in/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.ctuniversity.in</a>
                  </li>
                  <li className="p-4 border border-slate-200 rounded-lg">
                    <strong>LOVELY PROFESSIONAL UNIVERSITY</strong> – Official Website: <a href="https://www.lpu.in/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.lpu.in</a>
                  </li>
                  <li className="p-4 border border-slate-200 rounded-lg">
                    <strong>GD GOENKA UNIVERSITY</strong> – Official Website: <a href="https://www.gdgoenkauniversity.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.gdgoenkauniversity.com</a>
                  </li>
                </ul>
                <p className="text-sm italic mt-4">All universities listed maintain official accreditation within India’s higher education regulatory framework.</p>
              </div>
            </div>
          </>
        );

      case PublicView.VISA_DISCLAIMER:
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Official Visa & Government Disclaimer</h1>
            <div className="prose max-w-none text-slate-700 space-y-6">
              <p>Zambians In India provides guidance and informational support for students applying to accredited institutions in India.</p>
              
              <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                <h3 className="text-red-900 font-bold mb-2">Government Authority Notice</h3>
                <p className="text-red-800 font-bold mb-4">ZII does NOT process, approve, or influence visa decisions.</p>
                <p className="text-red-800 text-sm">All Indian visa applications must be submitted exclusively through the official Government of India portal: <a href="https://indianvisaonline.gov.in" target="_blank" rel="noreferrer" className="underline">https://indianvisaonline.gov.in</a></p>
              </div>

              <p>Students are advised to verify all visa procedures through official government channels.</p>
              <p>Zambians In India assumes no authority in governmental visa issuance.</p>
            </div>
          </>
        );

      case PublicView.PRIVACY_POLICY:
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Data Protection & Privacy Policy</h1>
            <div className="prose max-w-none text-slate-700 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border border-slate-200 rounded-xl">
                  <h3 className="font-bold mb-2">Data Collected</h3>
                  <p className="text-sm">Name, email, phone number, academic history, and passport details (if voluntarily submitted for application purposes).</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl">
                  <h3 className="font-bold mb-2">Purpose</h3>
                  <p className="text-sm">University admission facilitation, scholarship assessment, and visa guidance support only.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold mt-4">Security & Storage</h3>
              <p>All data is stored on secure encrypted servers. We employ SSL (HTTPS) encryption for all data transmission.</p>
              <ul className="list-disc pl-5 text-sm">
                <li>No financial information (credit card details) is stored without secure encryption.</li>
                <li>Data is never sold to third parties.</li>
                <li>We comply with GDPR-standard data protection principles.</li>
              </ul>

              <h3 className="text-lg font-bold mt-4">User Rights</h3>
              <p>You have the right to request the deletion of your personal data from our systems at any time.</p>
              <p><strong>Contact for data removal:</strong> <a href="mailto:privacy@zambiansinindia.com" className="text-blue-600">privacy@zambiansinindia.com</a></p>
            </div>
          </>
        );

      case PublicView.TERMS_CONDITIONS:
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
            <div className="prose max-w-none text-slate-700 space-y-6">
              <h3 className="font-bold">1. Service Limitation</h3>
              <p className="text-sm">Zambians In India acts as a facilitator and advisor. We do not guarantee admission to any specific university, as final decisions rest with the respective institutions.</p>

              <h3 className="font-bold">2. No Guarantee of Visa</h3>
              <p className="text-sm">Visa issuance is the sole prerogative of the High Commission of India. ZII cannot guarantee the outcome of any visa application.</p>

              <h3 className="font-bold">3. Limitation of Liability</h3>
              <p className="text-sm">ZII shall not be held liable for any direct, indirect, or consequential loss or damage arising from the use of our services or reliance on information provided.</p>

              <h3 className="font-bold">4. Dispute Jurisdiction</h3>
              <p className="text-sm">Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Lusaka, Zambia.</p>

              <h3 className="font-bold">5. Governing Law</h3>
              <p className="text-sm">These terms are governed by the Laws of the Republic of Zambia.</p>
            </div>
          </>
        );

      case PublicView.CORPORATE_PROFILE:
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">About Zambians In India</h1>
            <div className="prose max-w-none text-slate-700 space-y-6">
              <p>Zambians In India (ZII) is a student mobility and education facilitation platform established to bridge academic pathways between Zambia and India.</p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-emerald-500">
                  <h3 className="font-bold text-lg mb-2 text-emerald-800">Our Mission</h3>
                  <p className="text-sm">To provide transparent, ethical, and student-centered international education guidance to Zambian students.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-orange-500">
                  <h3 className="font-bold text-lg mb-2 text-orange-800">Our Vision</h3>
                  <p className="text-sm">To become Zambia’s most trusted international education facilitation platform.</p>
                </div>
              </div>

              <h3 className="text-xl font-bold mt-8 mb-4">Core Values</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                {['Integrity', 'Transparency', 'Student Welfare', 'Excellence', 'Compliance'].map((val) => (
                  <div key={val} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm font-bold text-slate-800 text-sm">
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return <div>Content not found.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Official Disclosure</p>
        </div>
      </div>

      <div className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          {renderContent()}
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LegalPages;
