import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Users, HelpCircle, Target } from 'lucide-react';

const Tutorial: React.FC = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/wyg.jpg)' }}
    >
      {/* Overlay untuk readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              to="/"
              className="flex items-center text-green-600 hover:text-green-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Tutorial WARISAN</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cara Bermain WARISAN
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pelajari cara bermain dan jelajahi budaya Jawa melalui permainan yang menyenangkan
          </p>
        </div>

        {/* Tutorial Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mr-6 flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  1. Pilih Karakter
                </h3>
                <p className="text-gray-600 mb-4">
                  Mulai dengan memilih karakter budaya Jawa yang ingin Anda pelajari. 
                  Setiap karakter memiliki cerita dan karakteristik unik yang menarik.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Jelajahi berbagai karakter tradisional</li>
                  <li>Pelajari latar belakang setiap karakter</li>
                  <li>Pahami peran mereka dalam budaya Jawa</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-6 flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  2. Jawab Pertanyaan
                </h3>
                <p className="text-gray-600 mb-4">
                  Setelah memilih karakter, Anda akan diberikan serangkaian pertanyaan 
                  tentang budaya Jawa yang berkaitan dengan karakter tersebut.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Baca pertanyaan dengan teliti</li>
                  <li>Pilih jawaban yang paling tepat</li>
                  <li>Pelajari penjelasan setelah menjawab</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start">
              <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mr-6 flex-shrink-0">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  3. Kumpulkan Poin
                </h3>
                <p className="text-gray-600 mb-4">
                  Setiap jawaban benar akan memberikan Anda poin. Kumpulkan poin 
                  sebanyak-banyaknya untuk naik ke peringkat teratas!
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Jawaban benar = +10 poin</li>
                  <li>Bonus waktu untuk jawaban cepat</li>
                  <li>Lihat peringkat Anda di papan skor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 mt-12 text-white">
          <h3 className="text-2xl font-bold mb-4">Tips Bermain</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">💡 Strategi</h4>
              <ul className="space-y-1 text-green-100">
                <li>• Baca setiap pertanyaan dengan teliti</li>
                <li>• Jangan terburu-buru dalam menjawab</li>
                <li>• Pelajari penjelasan setiap jawaban</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎯 Tujuan</h4>
              <ul className="space-y-1 text-green-100">
                <li>• Pelajari budaya Jawa dengan menyenangkan</li>
                <li>• Kumpulkan pengetahuan baru</li>
                <li>• Raih skor tertinggi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-12">
          <Link
            to="/dashboard"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center"
          >
            <Play className="h-5 w-5 mr-2" />
            Mulai Bermain
          </Link>
          <Link
            to="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Tutorial;