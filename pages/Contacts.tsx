import React from 'react';
import { Mail, Phone, MapPin, Facebook, Globe } from 'lucide-react';

const Contacts: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Contact <span className="text-blue-600">Us</span>
          </h1>
          <p className="text-lg text-gray-600">
            Get in touch with the AS-HRDD Team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Contact Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Office Address</h3>
                  <p className="text-gray-600">
                    Department of Budget and Management<br />
                    Gen. Solano St., San Miguel, Manila
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full text-green-600 mr-4">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">(02) 8657-3300 loc. 1234</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600 mr-4">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">training@dbm.gov.ph</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Hours */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
              <p className="opacity-90 mb-8">
                Stay updated with our latest training offerings and announcements by following us on our official channels.
              </p>
              
              <div className="flex space-x-4 mb-8">
                <a href="#" className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition backdrop-blur-sm">
                  <Facebook size={24} />
                </a>
                <a href="https://www.dbm.gov.ph" className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition backdrop-blur-sm">
                  <Globe size={24} />
                </a>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
              <h3 className="font-bold text-lg mb-2">Office Hours</h3>
              <p className="opacity-90">Monday - Friday</p>
              <p className="opacity-90">8:00 AM - 5:00 PM</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contacts;
