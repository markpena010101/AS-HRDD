import React from 'react';
import { CheckCircle } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const services = [
    "Formulation of policies, standards, and guidelines on Human Resource Development.",
    "Development and implementation of training and development programs.",
    "Administration of scholarship programs (local and foreign).",
    "Management of the Competency-Based Human Resource System.",
    "Conduct of Learning Needs Assessment and analysis.",
    "Monitoring and evaluation of L&D interventions."
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Our <span className="text-blue-600">Services</span>
          </h1>
          <p className="text-lg text-gray-600">
            Administrative Service - Human Resource Development Division (AS-HRDD)
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">HRDD Mandate</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              The Human Resource Development Division is responsible for the development of a competent, 
              productive, and committed workforce through the implementation of responsive and relevant 
              learning and development interventions, and the formulation of HRD policies and systems.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Key Functions</h2>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-4 text-lg text-gray-700">{service}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 px-8 py-6 text-center">
            <p className="text-sm text-gray-500">
              Committed to Service Excellence • Integrity • Professionalism
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
