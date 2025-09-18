import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  conversation: string[];
  questionLine: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  character: string;
  level: number;
  translation?: {
    conversation: string[];
    questionLine: string;
    options: string[];
  };
}

interface QuestionData {
  [character: string]: {
    [level: number]: Question[];
  };
}

const QuestionManager: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('Semar');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [showForm, setShowForm] = useState(true);
  const [showTranslation, setShowTranslation] = useState<{[key: number]: boolean}>({});

  const characters = ['Semar', 'Gareng', 'Petruk', 'Bagong'];
  const levels = [1, 2, 3, 4];

  // Data pertanyaan yang sudah ada dari GamePlay.tsx
  const existingQuestions: Question[] = [
    // Semar Level 1 - Question 1
    {
      id: 101,
      conversation: [
        'Gareng: "Bapak, kula lingsem matur kaliyan pak guru enggal"',
        'Semar: "Kok isin? koe ora ndueni salah karo pak guru anyar ta?"',
        'Gareng: "Mboten pak, kula namung ndredeg dereng tepang"',
        'Semar: "Yen kowe arep ngajeni uwong sek luwih tuwa cukup nganggo basa …….. lan sikap sing sopan"'
      ],
      questionLine: 'Yen kowe arep ngajeni uwong sek luwih tuwa cukup nganggo basa …….. lan sikap sing sopan',
      options: [
        'Ngoko Lugu',
        'Ngoko Alus',
        'Krama Lugu',
        'Krama Alus'
      ],
      correctAnswer: 3,
      explanation: 'Krama Alus digunakan untuk menghormati orang yang lebih tua dengan sopan santun yang tinggi.',
      character: 'Semar',
      level: 1,
      translation: {
        conversation: [
          'Gareng: "Bapak saya malu berbicara dengan pak guru baru"',
          'Semar: "Kenapa malu? Kamu tidak punya salah dengan pak guru baru kan?"',
          'Gareng: "Tidak pak, saya hanya deg-degan belum kenalan"',
          'Semar: "Jika kamu mau menghormati orang yang lebih tua cukup menggunakan bahasa ____ dan sikap yang sopan"'
        ],
        questionLine: 'Jika kamu mau menghormati orang yang lebih tua cukup menggunakan bahasa ____ dan sikap yang sopan',
        options: [
          'Ngoko Lugu',
          'Ngoko Alus',
          'Krama Lugu',
          'Krama Alus'
        ]
      }
    },
    // Semar Level 1 - Question 2
    {
      id: 102,
      conversation: [
        'Petruk: "Pak bilih wonten tiyang ingkang benten panemu kaliyan kula, pripun?"',
        'Semar: "Panemune kudu kowe tampa lan dikurmati Truk, aja nganti do ngotot"',
        'Petruk: "Nangging, piyambakipun tansah ngotot pak"',
        'Semar: "Yo sebagai ketua koe kudu iso mikir nganggo pikiran jernih, wong sing dewasa kuwi kudu bisa ____"'
      ],
      questionLine: 'Wong sing dewasa kuwi kudu bisa ____',
      options: [
        'Nentokne pilihane',
        'Gelut',
        'Nahan nesune',
        'Nangis'
      ],
      correctAnswer: 2,
      explanation: 'Orang dewasa harus bisa menahan amarahnya ketika menghadapi perbedaan pendapat.',
      character: 'Semar',
      level: 1,
      translation: {
        conversation: [
          'Petruk: "Pak jika ada orang yang berbeda pendapat dengan saya bagaimana?"',
          'Semar: "Pendapatnya harus kamu terima dan kamu hormati Truk, jangan sampai saling ngotot"',
          'Petruk: "Tapi orangnya masih ngotot pak"',
          'Semar: "Ya kamu sebagai ketua kamu harus bisa berpikir menggunakan pikiran jernih, orang yang dewasa itu harus bisa _____"'
        ],
        questionLine: 'Orang yang dewasa itu harus bisa _____',
        options: [
          'Menentukan pilihannya',
          'Berantem',
          'Menahan amarahnya',
          'Menangis'
        ]
      }
    },
    // Semar Level 1 - Question 3
    {
      id: 103,
      conversation: [
        'Petruk: "WAHH! wonten gorengan nggih?"',
        'Semar: "Eh.eh. anake sapa mlebu kok langsung nyelonong ta koe ki, pundi ____?"',
        'Semar: "Hayo….ora  ____ ayo ___ pundi!"',
        'Petruk: "Eh bapak, Petruk kesupen"',
        'Petruk: "Sugeng sonten (kaliyan gujeng lingsem)"',
        'Semar: "Nah… ____ nak yo anakku"'
      ],
      questionLine: 'Tembung sing trep kanggo ngisi ceceg-ceceg yaiku:',
      options: [
        'Salame, ora pareng, tata kramane, ngono',
        'Ngono, salame, tata kramane, ora pareng',
        'Tata kramane, ora pareng, ngono, salame',
        'Salame, tata kramane, ora pareng, ngono'
      ],
      correctAnswer: 0,
      explanation: 'Urutan yang benar adalah: Salame (salamnya), ora pareng (tidak boleh), tata kramane (tata kramanya), ngono (begitu).',
      character: 'Semar',
      level: 1,
      translation: {
        conversation: [
          'Petruk: "WAHH! ada gorengan ya?"',
          'Semar: "Eh…. ehh anaknya siapa masuk kok langsung masuk (tiba-tiba) sih kamu tu, mana ____?"',
          'Semar: "Hayo…. ____ ayo ____ mana!"',
          'Petruk: "Eh bapak, Petruk lupa"',
          'Petruk: "Selamat sore (dengan senyam-senyum)"',
          'Semar: "Nah… _____ nak yo anakku"'
        ],
        questionLine: 'Kata yang tepat untuk mengisi titik-titik yaiku:',
        options: [
          'Salamnya, tidak boleh, tata kramanya, begitu',
          'Begitu, salamnya, tata kramanya, tidak boleh',
          'Tata kramanya, tidak boleh, begitu, salamnya',
          'Salamnya, tata kramanya, tidak boleh, begitu'
        ]
      }
    },
    {
      id: 15,
      conversation: [
        'Gareng: "Aduh, aku ora sengaja nglanggar pranatan petilasan."',
        'Semar: "Gareng, apa sing kedadeyan?"',
        'Gareng: "Aku kudu njaluk ngapura marang roh leluhur."'
      ],
      questionLine: 'Gareng ora sengaja nglanggar pranatan petilasan, njaluk ngapura marang roh leluhur. Ukara ingkang trep:',
      options: [
        'Pangapunten kula aturaken dhumateng para sepuh, menawi tindak kula saged ngganggu ketentreman papan punika.',
        'Kula nyuwun pangapunten, awit lampah kula mlebet rerenggan tanpa pitunjuk.',
        'Pangapunten kula ngaturaken, amargi panjenengan boten ngidini kula nglanggar tapal batas pusaka.',
        'Dalem nyuwun pangapunten dhumateng para leluhur, menawi lampah dalem ngrisak kawibawaning papan suci menika.'
      ],
      correctAnswer: 3,
      explanation: 'Pilihan D paling trep amarga nggunakake basa krama inggil "dhumateng para leluhur" lan nerangake kanthi lengkap babagan ngrisak kawibawaning papan suci.',
      character: 'Gareng',
      level: 1,
      translation: {
        conversation: [
          'Gareng: "Aduh, saya tidak sengaja melanggar aturan petilasan."',
          'Semar: "Gareng, apa yang terjadi?"',
          'Gareng: "Saya harus minta maaf kepada roh leluhur."'
        ],
        questionLine: 'Gareng tidak sengaja melanggar aturan petilasan dan minta maaf kepada roh leluhur. Kalimat yang tepat:',
        options: [
          'Saya mohon maaf kepada para sesepuh, jika tindakanku bisa mengganggu ketentraman tempat ini.',
          'Saya minta maaf, sebab langkah saya masuk ke tempat keramat tanpa izin.',
          'Saya mohon maaf, karena Anda tidak mengizinkan saya melewati batas pusaka.',
          'Saya mohon maaf kepada para leluhur, bila langkah saya merusak kewibawaan tempat suci ini.'
        ]
      }
    },
    {
      id: 1,
      conversation: [
        'Semar: "Gong…kok klambimu ket mau isih mlethot ngono ta?"',
        'Bagong: "____ pak, aku ora reti ket mau tak setrika iseh tetep koyo ngene!"',
        'Semar: "Lah Gong iki jebul kabele durung kowe pasang"',
        'Semar: "Nek ngeneki koe nyetrika tekan 7 dina ya tetep ngoko kui"',
        'Bagong: "Suwun pak. Bagong lali gara-gara ngoyak bakul gathot"'
      ],
      questionLine: 'Tembung sing tepat kanggo ngisi ceceg-ceceg yaiku:',
      options: ["Iya", "Hooh", "Leres", "Inggih"],
      correctAnswer: 1,
      explanation: "Tembung 'hooh' tegese iya, cocok kanggo konteks informal karo wong tuwa.",
      character: 'Bagong',
      level: 1,
      translation: {
        conversation: [
          'Semar: "Gong.. kok bajumu dari tadi masih belum halus begitu sih?"',
          'Bagong: "____ pak, saya tidak tau dari tadi saya setrika masih tetap seperti ini!"',
          'Semar: "Lah Gong ini ternyata kabelnya belum kamu pasang"',
          'Semar: "Kalau seperti ini kamu nyetrika sampai 1 tahun juga tetap seperti itu"',
          'Bagong: "Terima kasih pak, Bagong lupa karena mengejar tukang gathot"'
        ],
        questionLine: 'Kata yang tepat untuk mengisi titik-titik yaitu:',
        options: ["Iya", "Iya", "Benar", "Iya"]
      }
    },
    {
      id: 2,
      conversation: [
        'Bagong: "Gareng ___ ket mau aku nyapu tapi ora ono sek ndelok"',
        'Gareng: "Gong tak andani ya sampean nyapu kuwi wis tak acungi jempol nanging yen luwih apik yen sampean ngelakokke apa-apa karo ikhlas ya"',
        'Bagong: "Ya muga-muga malaikat nyatet amal kebaikan ku"'
      ],
      questionLine: 'Tembung sing tepat kanggo ngisi ceceg-ceceg yaiku:',
      options: ["Aku", "Bagong", "Kula", "Sampean"],
      correctAnswer: 0,
      explanation: "Tembung 'aku' tegese saya, cocok kanggo konteks informal karo kanca.",
      character: 'Bagong',
      level: 1,
      translation: {
        conversation: [
          'Bagong: "Gareng ____ dari tadi saya menyapu tapi tidak ada yang lihat"',
          'Gareng: "Gong, saya beri tau ya kamu menyapu itu sudah saya acungkan jempol tapi lebih baik lagi kalau kamu melakukan apa-apa dengan ikhlas ya!"',
          'Bagong: "Ya semoga malaikat mencatat amal kebaikan saya"'
        ],
        questionLine: 'Kata yang tepat untuk mengisi titik-titik yaiku:',
        options: ["Saya", "Bagong", "Saya", "Kamu"]
      }
    }
    // Tambahkan pertanyaan lainnya di sini...
  ];

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      conversation: [''],
      questionLine: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      character: selectedCharacter,
      level: selectedLevel
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateTranslation = (index: number, field: keyof NonNullable<Question['translation']>, value: any) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[index].translation) {
      updatedQuestions[index].translation = {
        conversation: [''],
        questionLine: '',
        options: ['', '', '', '']
      };
    }
    (updatedQuestions[index].translation as any)[field] = value;
    setQuestions(updatedQuestions);
  };

  const toggleTranslation = (questionId: number) => {
    setShowTranslation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const generateQuestionsJSON = () => {
    // Gabungkan pertanyaan yang sudah ada dengan yang baru
    const allQuestions = [...existingQuestions, ...questions];
    
    // Organisir berdasarkan karakter dan level
    const organizedQuestions: QuestionData = {};
    
    allQuestions.forEach(question => {
      if (!organizedQuestions[question.character]) {
        organizedQuestions[question.character] = {};
      }
      if (!organizedQuestions[question.character][question.level]) {
        organizedQuestions[question.character][question.level] = [];
      }
      organizedQuestions[question.character][question.level].push(question);
    });

    return JSON.stringify(organizedQuestions, null, 2);
  };

  const saveQuestionsToFile = () => {
    const jsonData = generateQuestionsJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pertanyaan.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Sembunyikan form setelah save
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md w-full mx-4">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Berhasil!</h2>
          <p className="text-lg text-gray-600 mb-6">
            File pertanyaan.json telah berhasil dibuat dan diunduh.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Tambah Pertanyaan Lagi
            </button>
            <button
              onClick={() => navigate('/main')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Kembali ke Menu Utama
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/main')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Pertanyaan</h1>
            <div className="w-20"></div>
          </div>
          
          {/* Filter */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Karakter
              </label>
              <select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {characters.map(char => (
                  <option key={char} value={char}>{char}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>Level {level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={addNewQuestion}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pertanyaan
            </button>
            <button
              onClick={saveQuestionsToFile}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan ke JSON
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Pertanyaan {index + 1} - {question.character} Level {question.level}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTranslation(question.id)}
                    className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      showTranslation[question.id] 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Languages className="h-4 w-4 mr-1" />
                    Translate ID
                  </button>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Conversation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Percakapan (satu per baris)
                  </label>
                  <textarea
                    value={question.conversation.join('\n')}
                    onChange={(e) => updateQuestion(index, 'conversation', e.target.value.split('\n'))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan percakapan..."
                  />
                </div>

                {/* Question Line */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pertanyaan
                  </label>
                  <textarea
                    value={question.questionLine}
                    onChange={(e) => updateQuestion(index, 'questionLine', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan pertanyaan..."
                  />
                </div>

                {/* Options */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilihan Jawaban
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                          className="text-blue-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[optionIndex] = e.target.value;
                            updateQuestion(index, 'options', newOptions);
                          }}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Pilihan ${String.fromCharCode(65 + optionIndex)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penjelasan
                  </label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan penjelasan jawaban..."
                  />
                </div>
              </div>

              {/* Translation Section */}
              {showTranslation[question.id] && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <Languages className="h-5 w-5 mr-2" />
                    Terjemahan Bahasa Indonesia
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Translation Conversation */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Percakapan (Bahasa Indonesia)
                      </label>
                      <textarea
                        value={question.translation?.conversation?.join('\n') || ''}
                        onChange={(e) => updateTranslation(index, 'conversation', e.target.value.split('\n'))}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Masukkan terjemahan percakapan..."
                      />
                    </div>

                    {/* Translation Question */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Pertanyaan (Bahasa Indonesia)
                      </label>
                      <textarea
                        value={question.translation?.questionLine || ''}
                        onChange={(e) => updateTranslation(index, 'questionLine', e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Masukkan terjemahan pertanyaan..."
                      />
                    </div>

                    {/* Translation Options */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Pilihan Jawaban (Bahasa Indonesia)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(question.translation?.options || ['', '', '', '']).map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <span className="text-blue-600 font-medium min-w-[20px]">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const currentOptions = question.translation?.options || ['', '', '', ''];
                                const newOptions = [...currentOptions];
                                newOptions[optionIndex] = e.target.value;
                                updateTranslation(index, 'options', newOptions);
                              }}
                              className="flex-1 border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              placeholder={`Terjemahan pilihan ${String.fromCharCode(65 + optionIndex)}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Belum Ada Pertanyaan
            </h3>
            <p className="text-gray-600 mb-4">
              Klik "Tambah Pertanyaan" untuk mulai membuat pertanyaan baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionManager;