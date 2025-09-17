import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, ArrowLeft, CheckCircle, XCircle, Crown, Heart } from 'lucide-react';
import GameComplete from '../components/GameComplete';
// import { apiService } from '../services/api';

interface Question {
  id: number;
  conversation: string[];
  questionLine: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  translation?: {
    conversation: string[];
    questionLine: string;
    options: string[];
  };
}

interface Character {
  id: number;
  name: string;
  description: string;
  color: string;
  image: string;
}

const GamePlay: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  // const [gameSessionId, setGameSessionId] = useState<string | null>(null);

  // Data pertanyaan default untuk setiap level (3 pertanyaan per level)
  const questionsData: { [key: number]: Question[] } = {
    1: [
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
        translation: {
          conversation: [
            'Bagong: "Gareng ____ dari tadi saya menyapu tapi tidak ada yang lihat"',
            'Gareng: "Gong, saya beri tau ya kamu menyapu itu sudah saya acungkan jempol tapi lebih baik lagi kalau kamu melakukan apa-apa dengan ikhlas ya!"',
            'Bagong: "Ya semoga malaikat mencatat amal kebaikan saya"'
          ],
          questionLine: 'Kata yang tepat untuk mengisi titik-titik yaitu:',
          options: ["Saya", "Bagong", "Saya", "Kamu"]
        }
      },
      {
        id: 3,
        conversation: [
          'Semar: "Gong! kowe wis adus pa? kok kamar mandi garing"',
          'Bagong: "____ pak, aku mau cepet banget aduse lha adem je pak"',
          'Semar: "Uwis kepiye? lha wong ora ana suara krucak-krucuk kok Gong!"',
          'Bagong: "Lho____ hehe maksute adus angin pak"',
          'Semar: "Lha gene kuwi jenenge kowe urung adus"',
          'Semar: "Lho Le kok wani ngapusi karo wong tua ta dadi wong kuwi kudu jujur Gong!"',
          'Bagong: "Ya pak, aku _____ wis ngapusi"'
        ],
        questionLine: 'Tembung sing tepat kanggo ngisi ceceg-ceceg yaiku:',
        options: ["Uwes, bapak, njaluk ngapura", "Sampun, rama, nyuwun sewu", "Sampun, rama, ngapunten", "uwes, bapak, ngapunten"],
        correctAnswer: 0,
        explanation: "'Uwes' tegese sudah, 'bapak' kanggo nyebut wong tuwa, lan 'njaluk ngapura' tegese minta maaf.",
        translation: {
          conversation: [
            'Semar: "Gong! kamu sudah mandi kah? kenapa kamar mandi masih kering"',
            'Bagong: "____ pak, saya tadi cepat sekali mandinya soalnya airnya dingin"',
            'Semar: "Sudah bagaimana? orang tidak ada suara krucuk-krucuk kok Gong"',
            'Bagong: "Lho ____ hehe maksudnya mandi angin pak"',
            'Semar: "Lha itu namanya kamu belum mandi"',
            'Semar: "Lho nak, kamu kok berani membohongi orang tua sih, jadi orang itu harus jujur Gong!"',
            'Bagong: "Baik pak, saya ____ sudah berbohong"'
          ],
          questionLine: 'Kata yang tepat untuk mengisi titik-titik yaitu:',
          options: ["Sudah, bapak, minta maaf", "Sudah, bapak, permisi", "Sudah, bapak, maaf", "Sudah, bapak, maaf"]
        }
      }
    ],
    2: [
      {
        id: 4,
        conversation: [
          'Gareng: "Pak, kula bingung carane ngatur wektu"',
          'Semar: "Wektu kuwi abot Reng, kudu diatur apik"',
          'Gareng: "Pripun carane pak?"'
        ],
        questionLine: 'Semar: "Sing penting kuwi kudu duwe ......"',
        options: ["Jam tangan", "Jadwal", "Kalender", "Handphone"],
        correctAnswer: 1,
        explanation: "Untuk mengatur waktu dengan baik, yang terpenting adalah memiliki jadwal yang teratur.",
        translation: {
          conversation: [
            'Gareng: "Pak, saya bingung cara mengatur waktu"',
            'Semar: "Waktu itu berat Reng, harus diatur dengan baik"',
            'Gareng: "Bagaimana caranya pak?"'
          ],
          questionLine: 'Semar: "Yang penting itu harus punya ......"',
          options: ["Jam tangan", "Jadwal", "Kalender", "Handphone"]
        }
      },
      {
        id: 5,
        conversation: [
          'Petruk: "Pak, kula ajeng takon babagan gotong royong"',
          'Semar: "Gotong royong kuwi budaya apik Truk"',
          'Petruk: "Nanging saiki wis jarang pak"'
        ],
        questionLine: 'Semar: "Gotong royong kuwi penting amarga bisa ......"',
        options: ["Gawe geger", "Nambah beban", "Nggampangake gawe", "Mbuwang wektu"],
        correctAnswer: 2,
        explanation: "Gotong royong penting karena dapat mempermudah pekerjaan dan mempererat hubungan sosial.",
        translation: {
          conversation: [
            'Petruk: "Pak, saya mau tanya tentang gotong royong"',
            'Semar: "Gotong royong itu budaya yang baik Truk"',
            'Petruk: "Tapi sekarang sudah jarang pak"'
          ],
          questionLine: 'Semar: "Gotong royong itu penting karena bisa ......"',
          options: ["Bikin ribut", "Menambah beban", "Mempermudah kerja", "Membuang waktu"]
        }
      },
      {
        id: 6,
        conversation: [
          'Bagong: "Pak, kok kula kudu ngormati wong tuwa?"',
          'Semar: "Gong, wong tuwa kuwi wis akeh pengalamane"',
          'Bagong: "Lha terus pripun pak?"'
        ],
        questionLine: 'Semar: "Pengalaman kuwi bisa dadi ......"',
        options: ["Beban", "Guru", "Masalah", "Halangan"],
        correctAnswer: 1,
        explanation: "Pengalaman orang tua bisa menjadi guru dan pembelajaran bagi generasi muda.",
        translation: {
          conversation: [
            'Bagong: "Pak, kenapa saya harus menghormati orang tua?"',
            'Semar: "Gong, orang tua itu sudah banyak pengalamannya"',
            'Bagong: "Lha terus bagaimana pak?"'
          ],
          questionLine: 'Semar: "Pengalaman itu bisa menjadi ......"',
          options: ["Beban", "Guru", "Masalah", "Halangan"]
        }
      }
    ],
    3: [
      {
        id: 7,
        conversation: [
          'Petruk: "Benjing badhe wonten kegiatan kerja bakti nggih, saking ngajeng dumugi wingkingipun dhusun"',
          'Bagong: "Aku yo uwes mikirke kostum sesok ki!"',
          'Petruk: "Lah sampean ki kerja bakti kok mikirke kostum!"',
          'Bagong: "_______________ aku yo uwes pesen fotografer lho~"',
          'Semar: "Yowes, ngeneki para warga mbekta piranti kangge reresik, Bagong ngawa awak wae!"'
        ],
        questionLine: 'Tembung sing tepat kanggo ngisi ceceg-ceceg yaiku:',
        options: ["Lhaiya ta ben cocok dipajang neng kalender rt!", "Laembuh ta ben cocok dipajang neng kalender rt!", "Lha nggih supados cocok dipunpajang ning kalender rt!", "Lha nggih supados cocok dipunpajang wonten kalender rt!"],
        correctAnswer: 0,
        explanation: "Pilihan A menggunakan bahasa Jawa ngoko yang tepat untuk berbicara dengan Petruk.",
        translation: {
          conversation: [
            'Petruk: "Besok akan ada kegiatan kerja bakti ya, dari depan sampai belakang dusun"',
            'Bagong: "Aku ya sudah memikirkan kostum besok ini!"',
            'Petruk: "Lah kamu itu kerja bakti kok mikirin kostum!"',
            'Bagong: "_______________ saya juga sudah pesan fotografer lho~"',
            'Semar: "Yaudah, begini para warga membawa alat untuk bebersih, Bagong membawa badan saja!"'
          ],
          questionLine: 'Kata yang tepat untuk mengisi titik-titik yaitu:',
          options: ["Lha iya kan biar cocok dipajang di kalender Rt", "Lha tidak tau sih biarin cocok dipajang di kalender Rt", "Lha iya supaya cocok dipajang di kalender Rt", "Lha iya supaya cocok dipajang di kalender Rt"]
        }
      },
      {
        id: 8,
        conversation: [
          'Semar: "Lho kuwi sek teko nggo jas abang kinclong sopo?"',
          'Bagong: "Halo halo sugeng rawuh ing vlog NinjaGong!"',
          'Bagong: "Aku bagian dokumentasi iki sapuku wis pink cetar limited edition!"',
          'Semar: "Sapune kowe cetar tapi tangane ora kerjo yo ora guna"',
          'Bagong: "__________________"',
          'Semar: "Ealah yowes gong karepmu!"'
        ],
        questionLine: 'Tembung sing tepat kanggo ngisi ceceg-ceceg yaiku:',
        options: ["Kula puniku manah tebih pak, menawi NinjaGong viral saged angsal sponsor", "Kula menika nggalih tebih pak, menawi NinjaGong viral saged keparing sponsor", "Aku iku mikir adoh pak, yen NinjaGong viral bisa oleh sponsor", "Kula menika nggalih tebih pak, menawi NinjaGong viral saged angsal sponsor"],
        correctAnswer: 2,
        explanation: "Pilihan C menggunakan bahasa Jawa ngoko yang tepat untuk berbicara dengan Semar.",
        translation: {
          conversation: [
            'Semar: "Lho itu yang datang pakai jas merah siapa?"',
            'Bagong: "Halo halo selamat datang di vlog NinjaGong"',
            'Bagong: "Saya bagian dokumentasi ini sapu saya sudah pink cetar limited edition!"',
            'Semar: "Sapune kamu cetar tapi tangannya tidak kerja ya tidak berguna"',
            'Bagong: "________________"',
            'Semar: "Ealah ya sudah Gong terserah kamu"'
          ],
          questionLine: 'Kata yang tepat untuk mengisi titik-titik yaitu:',
          options: ["Saya itu berpikir jauh pak, apabila NinjaGong viral bisa mendapat sponsor", "Saya itu berpikir jauh pak, apabila NinjaGong viral bisa mendapat sponsor", "Saya itu berpikir jauh pak, apabila NinjaGong viral bisa mendapat sponsor", "Saya itu berpikir jauh pak, apabila NinjaGong viral bisa mendapat sponsor"]
        }
      },
      {
        id: 9,
        conversation: [
          'Bagong: "Para pamirsa saiki ana Bapak ku SEMAR! ingkang nyapu ngange sapu jadul!"',
          '*(bagong kepleset mlebet got amargi mlampah mundur)',
          'Semar: "Lho nak tenan mlebu kalen to kowe haha"',
          'Bagong: "__________________"',
          'Petruk: "Niate sampean ki wis apik nanging ana-ana wae Gong!"',
          'Bagong: "Huhu sapu limited edition ku rusak"'
        ],
        questionLine: 'Tembung sing tepat kanggo ngisi ceceg-ceceg yaiku:',
        options: ["kula badhe kerja bakti langkung keren supados ingkang sanesipun dados termotivasi", "kula ajeng kerja bakti langkung keren supados ingkang sanesipun dados termotivasi", "aku gur kepengen kerja bakti dadi luih keren ben sek liyane dadi termotivasi", "kula arep kerja bakti langkung keren supados ingkang sanesipun dados termotivasi"],
        correctAnswer: 2,
        explanation: "Pilihan C menggunakan bahasa Jawa ngoko yang tepat untuk berbicara dengan Semar dan Petruk.",
        translation: {
          conversation: [
            'Bagong: "Para pemirsa sekarang ada bapak saya SEMAR! yang menyapu menggunakan sapu jadul!"',
            '*(Bagong kepleset masuk got karena berjalan mundur)',
            'Semar: "Lho beneran kan masuk got kan kamu"',
            'Bagong: "__________________"',
            'Petruk: "Niatnya kamu itu sudah bagus tapi ada-ada saja Gong!"',
            'Bagong: "Huhu sapu limited edition ku rusak"'
          ],
          questionLine: 'Kata yang tepat untuk mengisi titik-titik yaitu:',
          options: ["Saya mau kerja bakti lebih keren supaya yang lain menjadi termotivasi", "Saya mau kerja bakti lebih keren supaya yang lain menjadi termotivasi", "Saya hanya ingin kerja bakti menjadi lebih keren supaya yang lain menjadi termotivasi", "Saya ingin kerja bakti lebih keren supaya yang lain dapat termotivasi"]
        }
      }
    ],
    4: [
      {
        id: 10,
        conversation: [
          'Arjuna: "Bagong, apa kowe wis ngecek jebakan ing alas iki?"',
          'Bagong: "Wis, Pandhawa. Aku wis ndeteksi akeh jebakan."',
          'Arjuna: "Coba nerangake apa sing wis kowe lakoni."'
        ],
        questionLine: 'Bagong nerangake jebakan. Ukara ingkang trep:',
        options: ["Aku wis ndeteksi lan nyingkirake 4 jebakan sadurunge kowe mlaku.", "Wis tak tata lan tak delok maneh jebakané, ben ora nyilakani kowe kabeh.", "Aku wis nandhani posisi jebakan ing peta, ben gampang diwaspadai.", "Alas sisih wetan wis tak resiki, jebakan cilik-cilik tak copoti."],
        correctAnswer: 1,
        explanation: "Pilihan B paling trep amarga nggunakake basa ngoko sing cocok karo karakter Bagong lan nerangake kanthi cetha babagan ngatur jebakan.",
        translation: {
          conversation: [
            'Arjuna: "Bagong, apa kamu sudah mengecek jebakan di hutan ini?"',
            'Bagong: "Sudah, Pandhawa. Saya sudah mendeteksi banyak jebakan."',
            'Arjuna: "Coba jelaskan apa yang sudah kamu lakukan."'
          ],
          questionLine: 'Bagong menjelaskan jebakan di hutan. Kalimat yang tepat:',
          options: ["Aku sudah mendeteksi dan menyingkirkan 4 jebakan sebelum kalian lewat.", "Sudah kutata dan kulihat lagi jebakannya, biar tidak mencelakai kalian semua.", "Aku sudah menandai posisi jebakan di peta, supaya gampang dihindari.", "Hutan sebelah timur sudah kubersihkan, termasuk jebakan-jebakan kecil yang tersebar."]
        }
      },
      {
        id: 11,
        conversation: [
          'Bagong: "Wah, panggonan iki aneh banget rasane."',
          'Semar: "Bagong, apa sing kowe rasake?"',
          'Bagong: "Aku nemu geter alus saka sela iku, katon pusaka ndhelik nang kene."'
        ],
        questionLine: 'Bagong nduweni pangrasa ajaib ing panggonan pusaka. Ukara ingkang trep:',
        options: ["Aku krasa lemah iki gemeter, koyo ana tenaga aneh.", "Panggonan iki nuwuhake rasa ora enak, hawa panas banget.", "Aku nemu geter alus saka sela iku, katon pusaka ndhelik nang kene.", "Angine muter-muter, kahanan kene kok ora umum."],
        correctAnswer: 2,
        explanation: "Pilihan C paling trep amarga nerangake kanthi cetha babagan pangrasa ajaib Bagong sing bisa nemu pusaka.",
        translation: {
          conversation: [
            'Bagong: "Wah, tempat ini aneh banget rasanya."',
            'Semar: "Bagong, apa yang kamu rasakan?"',
            'Bagong: "Aku merasakan getaran halus dari celah itu, dan hatiku memberi tahu ada pusaka tersimpan."'
          ],
          questionLine: 'Bagong merasakan keanehan di tempat pusaka. Kalimat yang tepat:',
          options: ["Aku merasa tanah ini bergetar, seperti ada kekuatan aneh.", "Tempat ini bikin perasaan tidak enak, udaranya panas banget.", "Aku merasakan getaran halus dari celah itu, dan hatiku memberi tahu ada pusaka tersimpan.", "Anginnya berputar-putar, keadaan di sini memang tidak wajar."]
        }
      },
      {
        id: 12,
        conversation: [
          'Bagong: "Aduh, matur nuwun yo, Mar!"',
          'Semar: "Kenapa, Bagong?"',
          'Bagong: "Nek ora kowe cepet nulungi, aku wis keseret jurang kuwi."'
        ],
        questionLine: 'Bagong matur panuwun marang Semar amarga kaslametan saka jebakan guwa. Ukara ingkang trep:',
        options: ["Matur nuwun yo, Mar, nek ora aku wis keseret jurang.", "Untunge kowe cepet nulungi aku, nek ora wis mati konyol.", "Aku matur nuwun tenan, wis ditulungi saka jebakan edan kuwi.", "Aku sukur banget, nek ora kowe kabeh aku wis ora ana."],
        correctAnswer: 0,
        explanation: "Pilihan A paling trep amarga nggunakake basa ngoko sing cocok karo karakter Bagong lan ngucapake matur nuwun kanthi tulus.",
        translation: {
          conversation: [
            'Bagong: "Aduh, terima kasih ya, Mar!"',
            'Semar: "Kenapa, Bagong?"',
            'Bagong: "Kalau tidak kamu cepat menolong, aku sudah terseret jurang itu."'
          ],
          questionLine: 'Bagong berterima kasih kepada Semar karena diselamatkan dari jebakan gua. Kalimat yang tepat:',
          options: ["Terima kasih ya, Mar, kalau tidak aku sudah jatuh ke jurang.", "Untung kamu cepat menolongku, kalau tidak aku sudah mati konyol.", "Aku benar-benar berterima kasih, sudah ditolong dari jebakan gila itu.", "Aku sangat bersyukur, kalau bukan kalian aku sudah tidak ada."]
        }
      }
    ]
  };

  const currentQuestions = questionsData[currentLevel] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  useEffect(() => {
    // Ambil karakter yang dipilih dari localStorage
    const storedCharacter = localStorage.getItem('selectedCharacter');
    if (storedCharacter) {
      setSelectedCharacter(JSON.parse(storedCharacter));
    } else {
      // Jika tidak ada karakter, kembali ke halaman main
      navigate('/main');
    }
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, gameCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 10);
      setCorrectAnswersCount(correctAnswersCount + 1);
    } else {
      // Kurangi nyawa ketika jawaban salah
      const newLives = lives - 1;
      setLives(newLives);
      
      setTimeout(() => {
        if (newLives <= 0) {
          setGameOver(true);
          return;
        }
      }, 3000);
    }
    
    setTimeout(() => {
      if (!correct && lives - 1 <= 0) {
        return; // Jangan lanjut jika game over
      }
      nextQuestion();
    }, 3000);
  };

  const handleTimeUp = () => {
    setSelectedAnswer(-1);
    setIsCorrect(false);
    setShowResult(true);
    
    // Kurangi nyawa ketika waktu habis
    const newLives = lives - 1;
    setLives(newLives);
    
    setTimeout(() => {
      if (newLives <= 0) {
        setGameOver(true);
      } else {
        nextQuestion();
      }
    }, 3000);
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(60);
    } else {
      // Level selesai
      setLevelCompleted(true);
      setTimeout(async () => {
        if (currentLevel < 4) {
          nextLevel();
        } else {
          await saveGameData();
          setGameCompleted(true);
        }
      }, 3000);
    }
  };

  const nextLevel = () => {
    setCurrentLevel(currentLevel + 1);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setLevelCompleted(false);
    setTimeLeft(60);
  };

  const handleBackToMain = () => {
    navigate('/main');
  };

  const saveGameData = async () => {
    try {
      if (!selectedCharacter) return;
      
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      const totalQuestions = Object.values(questionsData).flat().length;
      
      // Create a mock game session for now since we don't have real backend integration
      const gameData = {
        characterId: selectedCharacter.id.toString(),
        score: score,
        timeElapsed: timeElapsed,
        livesRemaining: lives,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswersCount,
        completedAt: new Date().toISOString()
      };
      
      // Store in localStorage for now (can be replaced with real API call)
      const existingData = JSON.parse(localStorage.getItem('gameResults') || '[]');
      existingData.push(gameData);
      localStorage.setItem('gameResults', JSON.stringify(existingData));
      
      console.log('Game data saved:', gameData);
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const handlePlayAgain = () => {
    setCurrentLevel(1);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setGameCompleted(false);
    setGameOver(false);
    setLevelCompleted(false);
    setLives(3);
    setTimeLeft(60);
    setStartTime(Date.now());
    setCorrectAnswersCount(0);
    // setGameSessionId(null);
  };

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-xl">Memuat permainan...</div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/wyg.jpg)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-8 text-center max-w-md w-full mx-4">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
            <p className="text-lg text-gray-600 mb-4">
              Nyawa Anda habis! Anda bermain sebagai <strong>{selectedCharacter.name}</strong>
            </p>
            <div className="bg-red-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-8 w-8 text-red-600 mr-2" />
                <span className="text-2xl font-bold text-red-800">Skor Akhir: {score}</span>
              </div>
              <p className="text-red-700">Level yang dicapai: {currentLevel}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handlePlayAgain}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Main Lagi
              </button>
              <button
                onClick={handleBackToMain}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Pilih Karakter Lain
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted && selectedCharacter) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const totalQuestions = Object.values(questionsData).flat().length;
    
    return (
      <GameComplete
        character={{
          name: selectedCharacter.name,
          image: selectedCharacter.image
        }}
        score={score}
        timeElapsed={timeElapsed}
        livesRemaining={lives}
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswersCount}
        onPlayAgain={handlePlayAgain}
        onBackToMain={handleBackToMain}
      />
    );
  }

  if (levelCompleted) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/wyg.webp)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-8 text-center max-w-md w-full mx-4">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Level {currentLevel} Selesai!</h2>
            <p className="text-gray-600 mb-4">
              Bersiap untuk level berikutnya...
            </p>
            <div className="bg-blue-100 rounded-lg p-4">
              <div className="text-lg font-semibold text-blue-800">Skor: {score}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/wyg.webp)' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white bg-opacity-90 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button onClick={handleBackToMain} className="mr-4">
                  <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                </button>
                <img src="/wyg.jpg" alt="WARISAN" className="h-10 w-10 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">WARISAN - Permainan</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-1" />
                  <span className="font-semibold">{lives}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">{score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Character & Level Info */}
          <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-4xl mr-4">{selectedCharacter.image}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCharacter.name}</h2>
                  <p className="text-gray-600">{selectedCharacter.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <Crown className="h-5 w-5 text-purple-500 mr-1" />
                  <span className="font-semibold">Level {currentLevel}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Pertanyaan {currentQuestionIndex + 1} dari {currentQuestions.length}
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-8">
            {/* Timer */}
            <div className="flex justify-center mb-6">
              <div className={`flex items-center px-4 py-2 rounded-full ${
                timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-bold text-lg">{timeLeft}s</span>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
               {/* Language Toggle */}
               <div className="flex justify-center mb-4">
                 <button
                   onClick={() => setShowTranslation(!showTranslation)}
                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                 >
                   {showTranslation ? 'Tampilkan Bahasa Jawa' : 'Tampilkan Terjemahan'}
                 </button>
               </div>

               {/* Conversation */}
               {currentQuestion?.conversation && (
                 <div className="bg-gray-50 rounded-lg p-4 mb-6">
                   {(showTranslation && currentQuestion.translation ? 
                     currentQuestion.translation.conversation : 
                     currentQuestion.conversation
                   ).map((line, index) => (
                     <div key={index} className="mb-2 text-gray-700">
                       {line}
                     </div>
                   ))}
                 </div>
               )}
               
               {/* Question Line */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {showTranslation && currentQuestion?.translation ? 
                      currentQuestion.translation.questionLine : 
                      currentQuestion?.questionLine}
                  </h3>
                </div>
             </div>

            {/* Options */}
            <div className="grid gap-4 mb-8">
              {(showTranslation && currentQuestion?.translation ? 
                currentQuestion.translation.options : 
                currentQuestion?.options || []
              ).map((option, index) => {
                let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ";
                
                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass += "bg-green-100 border-green-500 text-green-800";
                  } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                    buttonClass += "bg-red-100 border-red-500 text-red-800";
                  } else {
                    buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += "bg-blue-100 border-blue-500 text-blue-800";
                  } else {
                    buttonClass += "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400";
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            {!showResult && (
              <div className="text-center">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                    selectedAnswer !== null
                      ? 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Jawab
                </button>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="text-center">
                <div className={`inline-flex items-center px-6 py-3 rounded-lg mb-4 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 mr-2" />
                  ) : (
                    <XCircle className="h-6 w-6 mr-2" />
                  )}
                  <span className="font-bold">
                    {isCorrect ? 'Benar!' : 'Salah!'}
                  </span>
                </div>
                
                {currentQuestion?.explanation && (
                  <div className="bg-blue-50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">Penjelasan:</h4>
                    <p className="text-blue-800">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;