// Data pertanyaan yang digunakan dalam aplikasi
// Diimpor dari QuestionManager.tsx

export interface Question {
  id: number;
  conversation: string[];
  questionLine: string;
  type?: 'multiple_choice' | 'essay';
  options: string[];
  correctAnswer: number;
  correctAnswerText?: string;
  explanation: string;
  character: string;
  level: number;
  hint?: string;
  translation?: {
    conversation: string[];
    questionLine: string;
    options: string[];
    correctAnswerText?: string;
  };
}

interface QuestionData {
  [character: string]: {
    [level: number]: Question[];
  };
}

// Data pertanyaan yang sudah ada
export const questionsData: Question[] = [
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
    hint: 'madeg saking 9 aksara',
    translation: {
      conversation: [
        'Petruk: "WAHH! ada gorengan ya?"',
        'Semar: "Eh.eh. anak siapa masuk kok langsung nyelonong kamu ini, mana ____?"',
        'Semar: "Ayo….tidak ____ ayo ___ mana!"',
        'Petruk: "Eh bapak, Petruk lupa"',
        'Petruk: "Selamat sore (dengan muka malu)"',
        'Semar: "Nah… ____ nak ya anakku"'
      ],
      questionLine: 'Kata yang tepat untuk mengisi titik-titik yaitu:',
      options: [
        'Salamnya, tidak boleh, tata kramanya, begitu',
        'Begitu, salamnya, tata kramanya, tidak boleh',
        'Tata kramanya, tidak boleh, begitu, salamnya',
        'Salamnya, tata kramanya, tidak boleh, begitu'
      ]
    }
  },

  // Gareng Level 1 - Multiple Choice Questions
  {
    id: 111,
    conversation: [
      'Gareng: "Bapak, badhe ____ dhateng pundi?"',
      'Semar: "Aku arep lunga mancing Reng! arep melu po piye?"',
      'Gareng: "Boten pak, nanging ngapunten, mancingipun ampun kathah ngedorani iwak nggih pak"',
      'Semar: "Kok ngapusi iwak barang ki maksute piye ta Reng!"',
      'Gareng: "Inggih pak, iwakipun dikengken mangan umpan, nanging saktemene dikengken mlebet wajan hehe"',
      'Semar: "Koe ki iso wae"'
    ],
    questionLine: 'Bapak, badhe ____ dhateng pundi?',
    options: ['Lunga', 'Tindak', 'Bidhal', 'Wangsul'],
    correctAnswer: 1,
    explanation: 'Tindak adalah kata yang tepat untuk melengkapi kalimat tersebut dalam bahasa Jawa krama.',
    character: 'Gareng',
    level: 1,
    type: 'multiple_choice',
    translation: {
      conversation: [
        'Gareng: "Bapak, mau ____ kemana?"',
        'Semar: "Saya mau pergi memancing Reng! mau ikut atau bagaimana?"',
        'Gareng: "Tidak pak, tapi maaf, mancingnya jangan kebanyakan membohongi ikannya ya pak"',
        'Semar: "Kok membohongi ikan juga itu bagaimana maksudnya Reng!"',
        'Gareng: "Iya pak, ikannya disuruh makan umpan, tapi sebenarnya disuruh masuk wajan hehe"',
        'Semar: "Kamu tu bisa aja"'
      ],
      questionLine: 'Bapak, mau ____ kemana?',
      options: ['Pergi', 'Pergi', 'Selesai', 'Pulang']
    }
  },
  {
    id: 112,
    conversation: [
      'Petruk: "Maaf Mas Gareng, ningali pulpen kula boten nggih?"',
      'Gareng: "Waduh Truk, aku ora ____ e"',
      'Gareng: "Eh….eh…. sikek Truk! coba sampean muter awak"',
      'Petruk: "Enten punapa nggih Mas Gareng?"',
      'Gareng: "Woo lha kui Truk! tok dlesepke ing rambutmu!"',
      'Petruk: "Oalah pantesan ket wau kula padosi boten enten hehe nuwun nggih Mas"',
      'Gareng: "Ealah ada-ada saja, ya sama-sama!"'
    ],
    questionLine: 'Waduh Truk, aku ora ____ e',
    options: ['Ndelok', 'Mirsani', 'Ningali', 'Ndeleng'],
    correctAnswer: 3,
    explanation: 'Ndeleng adalah kata yang tepat dalam bahasa Jawa ngoko untuk menyatakan melihat.',
    character: 'Gareng',
    level: 1,
    type: 'multiple_choice',
    translation: {
      conversation: [
        'Petruk: "Maaf Mas Gareng, melihat bolpoin saya tidak ya?"',
        'Gareng: "Waduh Truk, saya tidak ____ e"',
        'Gareng: "Eh…. eh.. sebentar Truk! coba sampean balik badan"',
        'Petruk: "Ada apa ya Mas Gareng?"',
        'Gareng: "Woo lha itu Truk! kamu selipkan di rambutmu!"',
        'Petruk: "Oalah pantesan dari tadi saya cari tidak ada hehe terima kasih ya mas"',
        'Gareng: "Ealah ada-ada saja, ya sama-sama"'
      ],
      questionLine: 'Waduh Truk, saya tidak ____ e',
      options: ['Melihat', 'Melihat', 'Melihat', 'Melihat']
    }
  },
  {
    id: 113,
    conversation: [
      'Semar: "Gareng…. kowe nek ngomong karo wong tua kudu nganggo tembung lan nada sik kepiye Le?"',
      'Gareng: "___ pak, kula boten pantes ngagem tembung Ngoko lan swanten inggil"',
      'Semar: "Bener banget Le.. kaya paribasan ajining dhiri dumunung ana ing lathi"',
      'Semar: "Yen kowe bisa njaga omongan bakale wong liya ya ngajeni koe!"'
    ],
    questionLine: '___ pak, kula boten pantes ngagem tembung Ngoko lan swanten inggil',
    options: ['Ngerti bapak', 'Ngertos bapak', 'Leres bapak', 'Ngapunten bapak'],
    correctAnswer: 1,
    explanation: 'Ngertos bapak adalah ungkapan yang tepat dalam bahasa Jawa krama untuk menyatakan mengerti, bapak.',
    character: 'Gareng',
    level: 1,
    type: 'multiple_choice',
    hint: 'Tembung "Ngerti" niku bahasa ngoko lan mboten cocog kangge ngendikan kaliyan tiyang sepuh, tembung "Ngertos" niku bahasa krama lan cocog kangge ngendikan kaliyan tiyang sepuh, tembung "leres" lan "ngapunten" niku kangge ngandharake tanggapan.',
    translation: {
      conversation: [
        'Semar: "Gareng…. kamu kalau berbicara dengan orang tua harus menggunakan kalimat dan nada yang bagaimana nak?"',
        'Gareng: "____ pak, saya tidak pantas menggunakan bahasa Ngoko dan nada tinggi"',
        'Semar: "Benar sekali nak…. seperti pribahasa harga diri dimulai dari mulut"',
        'Semar: "Jika kamu bisa menjaga ucapan nantinya orang lain juga menghormati kamu!"'
      ],
      questionLine: '____ pak, saya tidak pantas menggunakan bahasa Ngoko dan nada tinggi',
      options: ['Mengerti, bapak', 'Mengerti, bapak', 'Benar, bapak', 'Maaf bapak']
    }
  },

  // Gareng Level 2 - Essay Questions
  {
    id: 121,
    conversation: [
      'Gareng: "Ndoro, panjenengan nggarap soal enggal sanget? nyontek nggih"',
      'Yudhistira: "Wee enak wae sampean nek ngomong aku sinau tekan bengi nganti ora ndelok drama e"',
      'Gareng: "Oalah, kula kala wingi malah dipun ajak bapak tanding catur"',
      'Yudhistira: "Sampean yen kepingin iso ngarap ulangan kudu usaha Reng!"',
      'Gareng: "Minggu ngajenging kula ajeng sinau (sesarengan) nggih"'
    ],
    questionLine: 'Apa persamaan kata dari "sesarengan" dalam percakapan di atas?',
    type: 'essay',
    options: [],
    correctAnswer: 0,
    correctAnswerText: 'bersama',
    explanation: 'Kata "sesarengan" dalam bahasa Jawa berarti "bersama" dalam bahasa Indonesia.',
    character: 'Gareng',
    level: 2,
    translation: {
      conversation: [
        'Gareng: "Tuan, kamu mengerjakan soal kok cepat sekali? mencontek ya?"',
        'Yudhistira: "Wee enak saja kamu kalau berbicara, saya belajar sampai malam sampai tidak menonton drama lho"',
        'Gareng: "Oalah, saya kemarin malah diajak bapak bertanding catur"',
        'Yudhistira: "Kamu kalau ingin bisa mengerjakan ulangan harus berusaha Reng!"',
        'Gareng: "Minggu depan saya belajar (sesarengan) ya"'
      ],
      questionLine: 'Apa persamaan kata dari "sesarengan" dalam percakapan di atas?',
      options: [],
      correctAnswerText: 'bersama'
    }
  },
  {
    id: 122,
    conversation: [
      'Semar: "Gareng, ayo giliran kowe maju!"',
      'Gareng: "Menika biji ulangan nggih kula sampun nyobi ingkang paling sae"',
      'Semar: "Bijine kowe ki pancen lucu Reng lembar jawaban kok kaya puisi ora isi"',
      'Gareng: "Gareng namung ngiseni ngangge rasa, Guru. (Seratan) angsal lepat nanging niat tanpa nyonto niku prinsip Gareng"',
      'Semar: "Niate kowe ki wis apik banget tapi yen kowe kepengen dadi wong sik sukses, kudu usaha"',
      'Gareng: "Leres pak…. Gareng nyuwun pangapunten"'
    ],
    questionLine: 'Apa persamaan kata dari "seratan" dalam percakapan di atas?',
    type: 'essay',
    options: [],
    correctAnswer: 0,
    correctAnswerText: 'tulisan',
    explanation: 'Kata "seratan" dalam bahasa Jawa berarti "tulisan" dalam bahasa Indonesia.',
    character: 'Gareng',
    level: 2,
    translation: {
      conversation: [
        'Semar: "Gareng, ayo giliran kamu maju!"',
        'Gareng: "Ini nilai ulangan ya pak? saya sudah mencoba yang paling bagus"',
        'Semar: "Nilainya kamu itu memang lucu Reng lembar jawaban kok seperti puisi tanpa isi!"',
        'Gareng: "Gareng hanya mengisi menggunakan rasa, Guru. (Seratan) boleh salah tapi niat tanpa mencontek itu prinsip Gareng"',
        'Semar: "Niatnya kamu itu sudah bagus sekali tapi jika kamu ingin menjadi orang yang sukses harus usaha"',
        'Gareng: "Benar pak…. Gareng minta maaf"'
      ],
      questionLine: 'Apa persamaan kata dari "seratan" dalam percakapan di atas?',
      options: [],
      correctAnswerText: 'tulisan'
    }
  },
  {
    id: 123,
    conversation: [
      'Gareng: "Ndoro Bima, kenging menapa tasih wonten mriki?"',
      'Bima: "Eh Gareng! aku dereng dipetuk mas ku e"',
      'Gareng: "Ndoro Yudhistira kaya paribasan (kebo menyang mulih kandane) nggih?"',
      'Bima: "Inggih, Mas Yudhistira winggi lagi wae teka"',
      'Gareng: "Pedet putih mlaku-mlaku, kula rumiyin nggih ngoeng"',
      'Bima: "Wooo sampean ki"'
    ],
    questionLine: 'Mangga dilanjutaken: Orang yang lama _____, _____ ke rumahnya lagi',
    type: 'essay',
    options: [],
    correctAnswer: 0,
    correctAnswerText: 'merantau pulang',
    explanation: 'Peribahasa "kebo menyang mulih kandane" berarti "orang yang lama merantau pulang ke rumahnya lagi".',
    hint: 'Perhatikan peribahasa "kebo menyang mulih kandane" yang disebutkan dalam percakapan. Kebo (kerbau) yang pergi jauh akan kembali ke kandangnya, ini menggambarkan seseorang yang pergi jauh dari rumah.',
    character: 'Gareng',
    level: 2,
    translation: {
      conversation: [
        'Gareng: "Tuan Bima, kenapa masih ada disini?"',
        'Bima: "Eh Gareng! saya belum dijemput mas saya e"',
        'Gareng: "Tuan Yudhistira seperti peribahasa (kebo menyang mulih kandange) nggih?"',
        'Bima: "Iya, Mas Yudhistira baru saja datang"',
        'Gareng: "Anak sapi putih jalan-jalan, saya duluan nggih, NGOENG"',
        'Bima: "Woo kamu tu"'
      ],
      questionLine: 'Silahkan lanjutkan: Orang yang lama ____ , ____ ke rumahnya lagi',
      options: [],
      correctAnswerText: 'merantau pulang'
    }
  },

  // Gareng Level 3 - Multiple Choice Questions
  {
    id: 131,
    conversation: [
      'Semar: "sesuk arep ana lomba voli antar Rt, Rt punakawan kudu menang!"',
      'Gareng: "____________"',
      'Semar: "Lah Reng, net kan pancen bolong!"'
    ],
    questionLine: 'Pilih jawaban yang tepat untuk melengkapi percakapan di atas:',
    type: 'multiple_choice',
    options: [
      'Bapak, menawi netipun bolong pripun nggih?',
      'Bapak, menawi netipun bolong piye ya?',
      'Rama, misal netipun bolong pripun nggih?',
      'Rama, nek netipun bolong piye nggih?'
    ],
    correctAnswer: 0,
    explanation: 'Pilihan A menggunakan bahasa Jawa krama yang paling tepat dan sopan untuk berbicara dengan Semar.',
    character: 'Gareng',
    level: 3,
    translation: {
      conversation: [
        'Semar: "Besuk ingin ada lomba voli antar Rt, Rt Punakawan harus menang"',
        'Gareng: "_____________"',
        'Semar: "Lah Reng, net kan emang bolong!"'
      ],
      questionLine: 'Pilih jawaban yang tepat untuk melengkapi percakapan di atas:',
      options: [
        'Bapak, apabila netnya berlubang bagaimana ya?',
        'Bapak, apabila netnya berlubang bagaimana ya?',
        'Bapak, misalnya netnya berlubang bagaimana ya?',
        'Bapak, kalau netnya berlubang bagaimana ya?'
      ]
    }
  },
  {
    id: 132,
    conversation: [
      'Gareng: "_____________"',
      'Bagong: "Ya Reng! Bagong siap entuk umpan!"',
      '(ndadak wonten menda mlebet dhateng lapangan)',
      'menda: ~mbeeeee',
      'Gareng: "Wah weduse Bagong iki!"',
      'Bagong: "hehe~"'
    ],
    questionLine: 'Pilih jawaban yang tepat untuk melengkapi percakapan di atas:',
    type: 'multiple_choice',
    options: [
      'Gong! siap sampean kula paringgi servis bal nggih!',
      'Gong! siap sampean tak kei servis bal ya!',
      'Gong! siap koe tak nei servis bal yo!',
      'Gong! siap panjenengan kula paringaken servis bal nggih!'
    ],
    correctAnswer: 1,
    explanation: 'Pilihan B menggunakan bahasa Jawa ngoko yang tepat untuk berbicara dengan Bagong sebagai teman sebaya.',
    character: 'Gareng',
    level: 3,
    translation: {
      conversation: [
        'Gareng: "_______________"',
        'Bagong: "Iya Reng! Bagong siap dapat umpan"',
        '(tiba-tiba ada kambing masuk ke lapangan)',
        'Menda: ~mbeeee',
        'Gareng: "Wah kambingnya Bagong ini"',
        'Bagong: "Hehe~"'
      ],
      questionLine: 'Pilih jawaban yang tepat untuk melengkapi percakapan di atas:',
      options: [
        'Gong! siap kamu saya beri servis bola ya!',
        'Gong siap kamu saya berikan servis bola',
        'Gong siap kamu saya berikan servis bola ya',
        'Gong siap kamu saya berikan servis bola ya!'
      ]
    }
  },
  {
    id: 133,
    conversation: [
      'Semar: "Sanajan menang nanging lapangane tetep reged ayo kerja bakti bareng!"',
      'Gareng: "_____________"',
      'Gareng: "Eh aja nding maskot RT kui haha"',
      'Semar: "wes wes senajan beda RT sik penting guyub rukun!"',
      'Sedaya: "setujuuu"'
    ],
    questionLine: 'Pilih jawaban yang tepat untuk melengkapi percakapan di atas:',
    type: 'multiple_choice',
    options: [
      'Bapak, hadiahipun inggih menika menda ayo dipundamel sate kronyos kangge kalih RT!',
      'Bapak, hadiahipun inggih menika kambing mangga dipundamel sate kronyos kagem kalih RT!',
      'Bapak, hadiahe kui wedhus, ayo digawe sate kronyos bareng-bareng dinggo rong RT!',
      'Bapak, hadiahipun inggih menika menda sumangga dipundamel sate kronyos kagem kalih RT!'
    ],
    correctAnswer: 3,
    explanation: 'Pilihan D menggunakan bahasa Jawa krama alus yang paling sopan dan tepat untuk berbicara dengan Semar.',
    character: 'Gareng',
    level: 3,
    translation: {
      conversation: [
        'Semar: "Meskipun menang tapi lapangannya tetap kotor ayo kerja bakti bersama!"',
        'Gareng: "____________________"',
        'Gareng: "Eh jangan deh maskot Rt itu haha"',
        'Semar: "sudah sudah meskipun beda Rt yang penting guyub rukun"',
        'Sedaya: "Setujuuu"'
      ],
      questionLine: 'Pilih jawaban yang tepat untuk melengkapi percakapan di atas:',
      options: [
        'Bapak, hadiahnya yaitu kambing ayo dibuat sate kronyos untuk dua Rt',
        'Bapak, hadiahnya yaitu kambing ayo dibuat sate kronyos untuk dua Rt',
        'Bapak, hadiahnya itu kambing, ayo dibuat sate kronyos bersama-sama untuk dua Rt',
        'Bapak, hadiahnya yaitu kambing silahkan dibuat sate kronyos untuk dua Rt'
      ]
    }
  },

  // Gareng Level 4 - Multiple Choice Questions
  {
    id: 141,
    conversation: [
      'Gareng pamit liwat dalan alas sisih kulon marang Semar.'
    ],
    questionLine: 'Ukara ingkang trep:',
    type: 'multiple_choice',
    options: [
      'Nyuwun idin, kula ajeng tindak ngubengi jalur tengah, amargi punika jalur utama.',
      'Nyuwun sewu bapak, kula badhe mlampah dhateng sisih kulon, awit wonten pratandha pusaka miturut petungan.',
      'Kula badhe tindak dalan wingking supados saged ngetutake tapak sikil.',
      'Rama, kula sampun mlampah nanging lajeng badhe dhateng pos pinggir.'
    ],
    correctAnswer: 1,
    explanation: 'Pilihan B menggunakan bahasa Jawa krama yang tepat dan sesuai dengan konteks pamit untuk pergi ke arah barat karena ada tanda pusaka.',
    character: 'Gareng',
    level: 4,
    translation: {
      conversation: [
        'Gareng pamit lewat jalur hutan barat kepada Semar.'
      ],
      questionLine: 'Kalimat yang tepat:',
      options: [
        'Mohon izin, saya akan lewat jalur tengah, karena itu jalur utama.',
        'Mohon maaf rama, saya akan berjalan ke arah barat, sebab ada tanda pusaka menurut perhitungan.',
        'Saya akan lewat jalur belakang supaya bisa mengikuti jejak kaki.',
        'Rama, saya sudah berjalan, lalu akan menuju pos pinggir.'
      ]
    }
  },
  {
    id: 142,
    conversation: [
      'Gareng nerangake marang Arjuna yen ngerti posisi pusaka.'
    ],
    questionLine: 'Ukara ingkang trep:',
    type: 'multiple_choice',
    options: [
      'Dalem ngertos bilih pusaka punika saged kapanggih wonten sangandaping wit waringin.',
      'Dalem ngertos papan punika limrah kangge sesambetan gaib, nanging mboten mesthi pusaka wonten mriku.',
      'Dalem ngertos bilih sinyal punika asalipun saking pancer energi, dudu pusaka Kalimasada.',
      'Dalem pitados menawi petilasan ingkang kasebat wonten ing kitab, mapan ing sisih kulon alas punika.'
    ],
    correctAnswer: 0,
    explanation: 'Pilihan A menggunakan bahasa Jawa krama alus yang tepat untuk menjelaskan posisi pusaka kepada Arjuna.',
    character: 'Gareng',
    level: 4,
    translation: {
      conversation: [
        'Gareng menjelaskan kepada Arjuna bahwa ia tahu posisi pusaka.'
      ],
      questionLine: 'Kalimat yang tepat:',
      options: [
        'Saya tahu pusaka itu bisa ditemukan di dekat pohon beringin, seperempat jalan dari sumur petilasan.',
        'Saya tahu tempat itu biasa untuk hubungan gaib, tapi tidak mesti pusaka ada di sana.',
        'Saya tahu tanda itu asalnya dari pusat energi, bukan pusaka Kalimasada.',
        'Saya percaya bahwa petilasan yang disebut dalam kitab, berada di sisi barat hutan itu.'
      ]
    }
  },
  {
    id: 143,
    conversation: [
      'Gareng ora sengaja nglanggar pranatan petilasan, njaluk ngapura marang roh leluhur.'
    ],
    questionLine: 'Ukara ingkang trep:',
    type: 'multiple_choice',
    options: [
      'Pangapunten kula aturaken dhumateng para sepuh, menawi tindak kula saged ngganggu ketentreman papan punika.',
      'Kula nyuwun pangapunten, awit lampah kula mlebet rerenggan tanpa pitunjuk.',
      'Pangapunten kula ngaturaken, amargi panjenengan boten ngidini kula nglanggar tapal batas pusaka.',
      'Dalem nyuwun pangapunten dhumateng para leluhur, menawi lampah dalem ngrisak kawibawaning papan suci menika.'
    ],
    correctAnswer: 3,
    explanation: 'Pilihan D menggunakan bahasa Jawa krama alus yang paling sopan dan tepat untuk meminta maaf kepada roh leluhur.',
    character: 'Gareng',
    level: 4,
    translation: {
      conversation: [
        'Gareng tidak sengaja melanggar aturan petilasan dan minta maaf kepada roh leluhur.'
      ],
      questionLine: 'Kalimat yang tepat:',
      options: [
        'Saya mohon maaf kepada para sesepuh, jika tindakanku bisa mengganggu ketentraman tempat ini.',
        'Saya minta maaf, sebab langkah saya masuk ke tempat keramat tanpa izin.',
        'Saya mohon maaf, karena Anda tidak mengizinkan saya melewati batas pusaka.',
        'Saya mohon maaf kepada para leluhur, bila langkah saya merusak kewibawaan tempat suci ini.'
      ]
    }
  },

  // Petruk Level 1 - Multiple Choice Questions
  {
    id: 151,
    conversation: [
      'Semar: "Le.. tulung tukokno gula pasir neng warunge Bu Sri ya aja lali sik sopan"',
      'Petruk:"Nggih pak, nanging menawi warung Bu Sri tutup, kula __ es gabus nggih "',
      'Semar: "Heh es teruss jam 8 bengi kok arep tuku es"',
      'Petruk: "Kula namung ajeng ngirit pak, ngirit wanci lan nyekecaaken manah"',
      'Semar: "Ngirit dompet kui luwih penting Truk!"'
    ],
    questionLine: 'Pilih kata yang tepat untuk melengkapi percakapan di atas:',
    type: 'multiple_choice',
    options: [
      'Mundhut',
      'Arep',
      'Tumbas',
      'Nyuwun'
    ],
    correctAnswer: 2,
    explanation: 'Kata "tumbas" dalam bahasa Jawa berarti "membeli" yang sesuai dengan konteks percakapan.',
    character: 'Petruk',
    level: 1,
    translation: {
      conversation: [
        'Semar: "Nak.. tolong belikan gula pasir di warungnya Bu Sri ya jangan lupa yang sopan"',
        'Petruk: "Iya pak, tapi apabila warungnya Bu Sri tutup, saya __ es gabus ya"',
        'Semar: "Heh es teruss jam 8 malam kok mau beli es"',
        'Petruk: "Saya hanya mau ngirit pak, ngirit waktu dan melegakan hati"',
        'Semar: "Ngirit dompet itu lebih penting Truk!"'
      ],
      questionLine: 'Pilih kata yang tepat untuk melengkapi percakapan di atas:',
      options: [
        'Mengambil',
        'Mau',
        'Membeli',
        'Meminta'
      ]
    }
  },
  {
    id: 152,
    conversation: [
      'Bagong: " Petruk, aku mau nyilih pit e sampean terus aku tiba seko pit plus banne glundung siji hehe"',
      'Petruk: "Ealah Bagong kowe ki nek arep nyilih barang kudu ___ lan aja nganti kowe dikira maling!"'
    ],
    questionLine: 'Pilih kata yang tepat untuk melengkapi percakapan di atas:',
    type: 'multiple_choice',
    options: [
      'Ngendika',
      'Meneng-meneng',
      'Matur',
      'Ngomong'
    ],
    correctAnswer: 2,
    explanation: 'Kata "matur" dalam bahasa Jawa berarti "berbicara" atau "memberitahu" dengan sopan.',
    character: 'Petruk',
    level: 1,
    translation: {
      conversation: [
        'Bagong: "Petruk, saya tadi meminjam sepedanya sampean lalu saya jatuh dari sepeda plus bannya lepas berguling-guling satu hehe"',
        'Petruk: "Ealah Bagong kamu itu kalau mau minjam barang harus __ dan jangan sampai kamu disangka maling!"'
      ],
      questionLine: 'Pilih kata yang tepat untuk melengkapi percakapan di atas:',
      options: [
        'Berbicara',
        'Diam-diam',
        'Berbicara',
        'Berbicara'
      ]
    }
  },
  {
    id: 153,
    conversation: [
      'Semar: "Truk, kipas angine kok koe anggo dhewe ta?!"',
      'Petruk: "Ngapunten pak, ____ niki hawanipun benter sanget"',
      'Bagong: " Petruk, aku ket mau yo kepanasan kipas ono 4 kok di dep dewe!"',
      'Petruk: "Walah Gong, ya sabar ___ isih kepanasen je iki haha"',
      'Semar: "Petruk…. urip iki kudu bareng-bareng lan aja serakah yen kepingin nduweni akeh sedulur ya Le…."',
      'Petruk: "Nggih pak. ngapunten Petruk sampun salah"'
    ],
    questionLine: 'Pilih kata yang tepat untuk melengkapi percakapan di atas:',
    type: 'multiple_choice',
    options: [
      'Dinten, Aku',
      'Dinten, Kula',
      'Saiki, Sampean',
      'Saiki, Kula'
    ],
    correctAnswer: 0,
    explanation: 'Pilihan A "Dinten, Aku" tepat karena "dinten" berarti "hari" dan "aku" digunakan dalam konteks informal dengan Bagong.',
    character: 'Petruk',
    level: 1,
    hint: 'nalika ngendika kaliyan tiyang kang luwih enom ngagem Basa Ngoko/ Ngoko Alus',
    translation: {
      conversation: [
        'Semar: "Truk, kipas anginnya kok kamu pakai sendiri sih?!"',
        'Petruk: "Maaf pak, ____ ini cuacannya panas sekali"',
        'Bagong: "Petruk, saya dari tadi juga kepanasan kipas ada 4 kok di pakai sendiri!"',
        'Petruk: "Aduh Gong, ya sabar __ masih kepanasan ini haha"',
        'Semar: "Petruk…. hidup itu harus bersama-sama dan jangan serakah jika ingin punya banyak saudara ya nak…."',
        'Petruk: "Iya pak, maaf Petruk sudah salah"'
      ],
      questionLine: 'Pilih kata yang tepat untuk melengkapi percakapan di atas:',
      options: [
        'Hari, Saya',
        'Hari, Saya',
        'Sekarang, Kamu',
        'Sekarang, Saya'
      ]
    }
  },

  // Petruk Level 2 - Essay Questions
  {
    id: 161,
    conversation: [
      "Bima: 'Truk! sampean wau wis krungu ana bel ngaso ta? waktune ngaso'",
      "Petruk: 'Ayo Ndoro, kula sampun (luwe) sanget sumangga kula traktir nanging sampean ingkang mbayar'",
      "Bima: 'Lah kepiye ta niat njajake ora e, yowes ayo ndak gelak adhimu ngentekke gathot meneh'",
      "Petruk: 'Wahh bebaya puniku ayoo!'"
    ],
    questionLine: "Apa arti kata 'luwe' dalam percakapan di atas?",
    type: "essay" as const,
    options: [],
    correctAnswer: 0,
    correctAnswerText: "Lapar",
    explanation: "Kata 'luwe' dalam bahasa Jawa berarti 'lapar'. Dalam konteks percakapan, Petruk mengatakan bahwa dia sudah sangat lapar dan mengajak untuk makan bersama.",
    character: "Petruk",
    level: 2,
    translation: {
      conversation: [
        "Bima: 'Truk! kamu tadi sudah dengar ada bel istirahat kan? waktunya istirahat'",
        "Petruk: 'Ayo tuan, saya sudah (luwe) banget silahkan, saya traktir tapi kamu yang membayar'",
        "Bima: 'Lah bagaimana sih niat mentraktir tidak? yasudah ayo nanti keburu adekmu menghabiskan gathot lagi'",
        "Petruk: 'Wah bahaya itu ayoo!'"
      ],
      questionLine: "Apa arti kata 'luwe' dalam percakapan di atas?",
      options: [],
      correctAnswerText: "Lapar"
    }
  },
  {
    id: 162,
    conversation: [
      "Gareng: 'Petruk! wah pas ketemu sampean ning kene. sampean ana waktu ora?'",
      "Petruk: 'Eh Mas Gareng, kula wonten wekdal nanging tempe mendoan kula tasih separo'",
      "Gareng: 'Santai Truk! iki lho ana berkas OSIS, aku njaluk tulung sampean berkase dicaoske ing ruangane Pak Semar!'",
      "Petruk: 'Siap mas, dahwuh ditampi lampah nyaosaken map (wadi) badhe dipuntindakaken enggal-enggal'",
      "Gareng: 'Wah sampean pancen lucu lan bisa diandelke tapi mbok yo sik bener'"
    ],
    questionLine: "Apa arti kata 'wadi' dalam percakapan di atas?",
    type: "essay" as const,
    options: [],
    correctAnswer: 0,
    correctAnswerText: "Rahasia",
    explanation: "Kata 'wadi' dalam bahasa Jawa berarti 'rahasia' atau 'sesuatu yang harus dijaga kerahasiaannya'. Dalam konteks ini, Petruk menyebut map sebagai 'wadi' yang menunjukkan bahwa berkas tersebut bersifat rahasia atau penting.",
    character: "Petruk",
    level: 2,
    translation: {
      conversation: [
        "Gareng: 'Petruk! wah pas bertemu kamu disini . kamu ada waktu tidak?'",
        "Petruk: 'Eh Mas Gareng, saya ada waktu tetapi tempe mendoan saya masih setengah'",
        "Gareng: 'Santai Truk! ini lho ada berkas OSIS, saya minta tolong kamu berkasnya diberikan di ruangannya Pak Semar'",
        "Petruk: 'Siap mas, perintah diterima perjalanan memberikan map (wadi) akan dilaksanakan hati-hati'",
        "Gareng: 'Wah, kamu memang lucu dan bisa diandalkan tapi tolong yang benar!'"
      ],
      questionLine: "Apa arti kata 'wadi' dalam percakapan di atas?",
      options: [],
      correctAnswerText: "Rahasia"
    }
  },
  {
    id: 163,
    conversation: [
      "Petruk: 'Kula nuwun pak.. kula badhe nyaosi dhawuh saking Mas Gareng'",
      "Semar: 'Loh aku ketoke ora pesen dhawuh tapi map e Truk!'",
      "Petruk: 'Inggih pak.. kula kala wau dipunutus Mas Gareng'",
      "Semar: 'Wah.. pas tenan iki Truk! iki berkase kanggo rapat minggu depan biasane kowe kakean gaya'",
      "Petruk: 'Ngapunten pak, menika (ayahan) resmi sanes lomba rebatan gathot kaliyan Bagong teng kantin'"
    ],
    questionLine: "Apa arti kata 'ayahan' dalam percakapan di atas?",
    type: "essay" as const,
    options: [],
    correctAnswer: 0,
    correctAnswerText: "Tugas",
    explanation: "Kata 'ayahan' dalam bahasa Jawa berarti 'tugas' atau 'pekerjaan yang diberikan'. Dalam konteks ini, Petruk menjelaskan bahwa yang dia lakukan adalah tugas resmi, bukan kegiatan main-main seperti rebutan gathot di kantin.",
    hint: "Perhatikan konteks Petruk yang menjelaskan bahwa ini adalah pekerjaan resmi, bukan kegiatan main-main. Kata 'ayahan' merujuk pada pekerjaan atau kewajiban yang diberikan kepada seseorang.",
    character: "Petruk",
    level: 2,
    translation: {
      conversation: [
        "Petruk: 'Permisi pak.. saya ingin memberikan perintah dari Mas Gareng'",
        "Semar: 'Loh saya sepertinya tidak pesan perintah tapi map Truk!'",
        "Petruk: 'Iya pak.. saya tadi diutus Mas Gareng'",
        "Semar: 'Wah.. pas sekali ini Truk! ini berkasnya untuk rapat minggu depan biasanya kamu banyak gaya'",
        "Petruk: 'Maaf pak, ini (ayahan) resmi bukan lomba rebutan gathot sama Bagong di kantin'"
      ],
      questionLine: "Apa arti kata 'ayahan' dalam percakapan di atas?",
      options: [],
      correctAnswerText: "Tugas"
    }
  },

  // Petruk Level 3 - Multiple Choice Questions
  {
    id: 171,
    conversation: [
      "Semar: 'Bapak ibu, dinten menika paring kalodhangan dhateng petruk kagem ngaturaken visi lan misinipun'",
      "Petruk: '_____________'",
      "Warga: 'Mas ngapunten nanging program menika badhe tindak dangu?'",
      "Petruk: 'Woo tenang para warga program Petruk ora ono sek gagal!'"
    ],
    questionLine: "Pilih jawaban yang tepat untuk melengkapi percakapan di atas:",
    type: "multiple_choice" as const,
    options: [
      "Visi lan misi ku inggih menika ngawe kandang menda supados mboten ngganggu wargi",
      "Visi lan misi kula inggih menika ngawe kandang menda supados mboten nganggu wargi",
      "Visi lan misi kula inggih menika ndamel kandang menda supados mboten ngganggu wargi",
      "Visi lan misi aku yaiku ndamel kandang menda supados mboten ngganggu wargi"
    ],
    correctAnswer: 2,
    explanation: "Pilihan C menggunakan bahasa Jawa krama yang tepat dengan kata 'kula' (saya) dan 'ndamel' (membuat) yang sesuai untuk situasi formal di hadapan warga.",
    character: "Petruk",
    level: 3,
    translation: {
      conversation: [
        "Semar: 'Bapak, ibu hari ini beri kesempatan kepada Petruk untuk mengatakan visi dan misinya'",
        "Petruk: '________________'",
        "Warga: 'Mas minta maaf tapi program itu akan berjalan lama?'",
        "Petruk: 'Woo tenang para warga program Petruk tidak ada yang gagal!'"
      ],
      questionLine: "Pilih jawaban yang tepat untuk melengkapi percakapan di atas:",
      options: [
        "Visi dan misi saya yaitu membuat kandang kambing supaya tidak mengganggu warga",
        "Visi dan misi saya yaitu membuat kandang kambing supaya tidak mengganggu warga",
        "Visi dan misi saya yaitu membuat kandang kambing supaya tidak menganggu warga",
        "Visi dan misi saya yaitu membuat kandang kambing supaya tidak menganggu warga"
      ]
    }
  },
  {
    id: 172,
    conversation: [
      "Semar: 'Bapak ibu samenika gantosan Bima maringaken visi lan misinipun'",
      "Bima: 'Visi lan misi kula badhe mbangun jembatan antar dhusun lan ngaktipaken malih kegiatan ronda dalu'",
      "Petruk: '________________'",
      "Bima: 'Wah sampean ki isoh wae'"
    ],
    questionLine: "Pilih jawaban yang tepat untuk melengkapi percakapan di atas:",
    type: "multiple_choice" as const,
    options: [
      "Wah visi lan misine kowe apik banget Ndoro!",
      "Wah visi lan misine panjenengan apik banget Ndoro!",
      "Wah visi lan misine sampean elek banget Ndoro!",
      "Wah visi lan misine sampean biasa banget Ndoro!"
    ],
    correctAnswer: 1,
    explanation: "Pilihan B menggunakan bahasa Jawa krama alus dengan kata 'panjenengan' yang tepat untuk menghormati Bima dan memberikan pujian yang positif.",
    character: "Petruk",
    level: 3,
    translation: {
      conversation: [
        "Semar: 'Bapak ibu sekarang gantian Bima memberikan visi dan misinya'",
        "Bima: 'Visi dan misi saya ingin membangun jembatan antar dusun dan mengaktifkan lagi kegiatan ronda malam'",
        "Petruk: '________________'",
        "Bima: 'Wah kamu itu bisa aja'"
      ],
      questionLine: "Pilih jawaban yang tepat untuk melengkapi percakapan di atas:",
      options: [
        "Wah visi dan misinya kamu bagus sekali tuan",
        "Wah visi dan misinya kamu bagus sekali tuan",
        "Wah visi dan misinya kamu jelek sekali tuan",
        "Wah visi dan misinya kamu biasa sekali tuan"
      ]
    }
  },
  {
    id: 173,
    conversation: [
      "Gareng: 'Satunggal kangge Petruk! satunggal malih kangge Bima'",
      "Gareng: 'Bapak, menika koh malah wonten seratan lontong?'",
      "Semar: 'Woo kuwi jenenge suara weteng!'",
      "Gareng: 'Sedaya warga sampun kepilih lurah enggal inggih menika ndoro Bima'",
      "Petruk: '______________'",
      "Bima: 'Wah matur nuwun Truk! pemimpin ora ana apa-apane nek ora ana wargane sik kompak!'"
    ],
    questionLine: "Pilih jawaban yang tepat untuk melengkapi percakapan di atas:",
    type: "multiple_choice" as const,
    options: [
      "Wah slamet ya ndoro! semoga sampean lancar dadi ketua Rt",
      "Wah sampean curang ya Bim! mesti nyogok",
      "Wah aku ora terima Bim! semoga salah Bagong le ngitung!",
      "Wah slamet nggih ndoro! mugi-mugi panjenengan lancar dadi lurah"
    ],
    correctAnswer: 3,
    explanation: "Pilihan D menggunakan bahasa Jawa krama alus yang tepat dengan 'slamet nggih' (selamat ya) dan 'panjenengan' untuk menghormati Bima yang terpilih sebagai lurah.",
    character: "Petruk",
    level: 3,
    translation: {
      conversation: [
        "Gareng: 'Satu untuk Petruk! satu lagi untuk Bima'",
        "Gareng: 'Bapak, ini kok malah ada tulisan lontong?'",
        "Semar: 'Woo itu namanya suara perut!'",
        "Gareng: 'Semua warga sudah terpilih lurah baru yaitu Tuan Bima'",
        "Petruk: '_________________'",
        "Bima: 'Wah terima kasih Truk! pemimpin tidak ada apa-apanya kalau tidak ada warganya yang kompak!'"
      ],
      questionLine: "Pilih jawaban yang tepat untuk melengkapi percakapan di atas:",
      options: [
        "Wah selamat ya tuan! semoga kamu lancar menjadi ketua Rt",
        "Wah kamu curang ya Bim! pasti menyogok",
        "Wah saya tidak terima Bim! semoga salah Bagong yang menghitung",
        "Wah selamat ya tuan! semoga kamu lancar menjadi lurah"
      ]
    }
  },

  // Petruk Level 4 - Multiple Choice Questions
  {
    id: 181,
    conversation: [
      "Petruk ngemban tugas saka Yudhistira."
    ],
    questionLine: "Ukara ingkang trep:",
    type: "multiple_choice" as const,
    options: [
      "Ayahan punika dhasaripun saking pandhita luhur, awit pusaka dipunparingake kanthi laku suci.",
      "Menika dhawuhipun Mas Yudhistira dhateng dalem supados nyuwun pusaka Kalimasada dhateng Resi Sepuh.",
      "Dalem nindakaken punika awit dhawuh panjenengan sadèrèngipun rawuh mriki.",
      "Punika ayahan dhumateng dalem, amargi dipun anggep saged nyambung rasa kaliyan sang Resi."
    ],
    correctAnswer: 1,
    explanation: "Pilihan B menggunakan bahasa Jawa krama alus yang tepat untuk menyampaikan tugas dari Yudhistira dengan kata 'dhawuhipun' (titahnya) dan 'dalem' (saya) yang menunjukkan kesopanan tinggi.",
    character: "Petruk",
    level: 4,
    translation: {
      conversation: [
        "Petruk mengemban tugas dari Yudhistira."
      ],
      questionLine: "Kalimat yang tepat:",
      options: [
        "Tugas ini dasarnya dari pendeta luhur, sebab pusaka itu seharusnya diberikan dengan laku suci.",
        "Ini titah Mas Yudhistira kepadaku untuk memohon pusaka Kalimasada kepada Resi Sepuh.",
        "Saya melakukannya karena titah Anda kepada saya sebelum datang ke sini.",
        "Ini tugasku, karena dianggap bisa menyambung rasa dengan sang Resi."
      ]
    }
  },
  {
    id: 182,
    conversation: [
      "Petruk matur sopan marang Resi Sepuh sadurunge nyuwun pusaka."
    ],
    questionLine: "Ukara ingkang trep:",
    type: "multiple_choice" as const,
    options: [
      "Dalem ngaturaken panuwun dhateng panjenengan sadèrèngipun ngaturaken maksadipun Pandhawa.",
      "Dalem nyuwun pangapunten, Resi, sadèrèngipun ngaturaken panyuwunan gegayutan pusaka Kalimasada.",
      "Dalem ajeng nyuwun pitutur dhateng panjenengan, amargi boten kendel langsung nyuwun pusaka.",
      "Dalem matur bilih rawuh punika adhedhasar dhawuh Pandhawa kang remen karaharjaning nagari."
    ],
    correctAnswer: 1,
    explanation: "Pilihan B menggunakan bahasa Jawa krama alus yang paling sopan dengan 'nyuwun pangapunten' (mohon maaf) sebelum menyampaikan permintaan, menunjukkan etika yang baik dalam berkomunikasi dengan Resi.",
    character: "Petruk",
    level: 4,
    translation: {
      conversation: [
        "Petruk berbicara sopan kepada Resi Sepuh sebelum meminta pusaka."
      ],
      questionLine: "Kalimat yang tepat:",
      options: [
        "Saya menyampaikan terima kasih kepada Anda sebelum menyampaikan maksud Pandhawa.",
        "Saya mohon maaf, Resi, sebelum menyampaikan permintaan terkait pusaka Kalimasada.",
        "Saya ingin memohon nasihat kepada Anda, sebab saya tidak berani langsung meminta pusaka.",
        "Saya menyampaikan bahwa kedatanganku ini atas perintah resmi Pandhawa yang mencintai kesejahteraan negeri."
      ]
    }
  },
  {
    id: 183,
    conversation: [
      "Petruk ngajokaken usul gawe lingkar perlindungan sadurunge mlebu alas."
    ],
    questionLine: "Ukara ingkang trep:",
    type: "multiple_choice" as const,
    options: [
      "Dalem badhe ndamel tapal batas energi supados netralisir pangaribawa ala.",
      "Dalem ngajengaken gawe perlambang suci supados jalur mlebet alas saged katreksa.",
      "Dalem nyuwun idin ndamel lingkar pangreksa, supados angkara murka boten saged nembus papan punika.",
      "Dalem ndamel pola sakral adhedhasar petunjuk kitab kuna."
    ],
    correctAnswer: 2,
    explanation: "Pilihan C menggunakan bahasa Jawa krama alus yang tepat dengan 'nyuwun idin' (mohon izin) dan 'lingkar pangreksa' (lingkar perlindungan) yang menunjukkan kesopanan dan pemahaman spiritual yang mendalam.",
    character: "Petruk",
    level: 4,
    translation: {
      conversation: [
        "Petruk mengajukan usul membuat lingkar perlindungan sebelum masuk hutan angker."
      ],
      questionLine: "Kalimat yang tepat:",
      options: [
        "Saya akan membuat garis batas energi untuk menetralisir pengaruh jahat.",
        "Saya mengusulkan membuat simbol suci agar jalur masuk hutan terlindungi dari makhluk halus.",
        "Saya mohon izin membuat lingkar perlindungan, supaya kekuatan jahat tidak bisa menembus tempat ini.",
        "Saya membuat pola sakral berdasarkan petunjuk kitab kuno."
      ]
    }
  },

  // Bagong Level 1 - Multiple Choice Questions
  {
    id: 191,
    conversation: [
      "Semar: 'Gong…kok klambimu ket mau isih mlethot ngono ta?'",
      "Bagong: '____ pak, aku ora reti ket mau tak setrika iseh tetep koyo ngene!'",
      "Semar: 'Lah Gong iki jebul kabele durung kowe pasang'",
      "Semar: 'Nek ngeneki koe nyetrika tekan 7 dina ya tetep ngoko kui'",
      "Bagong: 'Suwun pak. Bagong lali gara-gara ngoyak bakul gathot'"
    ],
    questionLine: "Tembung sing trep kanggo ngisi ceceg-ceceg:",
    type: "multiple_choice" as const,
    options: [
      "Iya",
      "Hooh",
      "Leres",
      "Inggih"
    ],
    correctAnswer: 1,
    explanation: "'Hooh' yaiku tembung sing trep kanggo ngandharake setuju utawa iya ing basa Jawa ngoko sing digunakake Bagong marang Semar.",
    character: "Bagong",
    level: 1,
    translation: {
      conversation: [
        "Semar: 'Gong.. kok bajumu dari tadi masih belum halus begitu sih?'",
        "Bagong: '____ pak, saya tidak tau dari tadi saya setrika masih tetap seperti ini!'",
        "Semar: 'Lah Gong ini ternyata kabelnya belum kamu pasang'",
        "Semar: 'Kalau seperti ini kamu nyetrika sampai 1 tahun juga tetap seperti itu'",
        "Bagong: 'Terima kasih pak, Bagong lupa karena mengejar tukang gathot'"
      ],
      questionLine: "Kata yang tepat untuk mengisi titik-titik:",
      options: [
        "Iya",
        "Iya",
        "Benar",
        "Iya"
      ]
    }
  },
  {
    id: 192,
    conversation: [
      "Bagong: 'Gareng ___ ket mau aku nyapu tapi ora ono sek ndelok'",
      "Gareng: 'Gong tak andani ya sampean nyapu kuwi wis tak acungi jempol nanging yen luwih apik yen sampean ngelakokke apa-apa karo ikhlas ya'",
      "Bagong: 'Ya muga-muga malaikat nyatet amal kebaikan ku'"
    ],
    questionLine: "Tembung sing trep kanggo ngisi ceceg-ceceg:",
    type: "multiple_choice" as const,
    options: [
      "Aku",
      "Bagong",
      "Kula",
      "Sampean"
    ],
    correctAnswer: 0,
    explanation: "'Aku' yaiku tembung ganti wong kapisan ing basa Jawa ngoko sing trep digunakake Bagong nalika guneman karo Gareng.",
    character: "Bagong",
    level: 1,
    translation: {
      conversation: [
        "Bagong: 'Gareng ____ dari tadi saya menyapu tapi tidak ada yang lihat'",
        "Gareng: 'Gong, saya beri tau ya kamu menyapu itu sudah saya acungkan jempol tapi lebih baik lagi kalau kamu melakukan apa-apa dengan ikhlas ya!'",
        "Bagong: 'Ya semoga malaikat mencatat amal kebaikan saya'"
      ],
      questionLine: "Kata yang tepat untuk mengisi titik-titik:",
      options: [
        "Saya",
        "Bagong",
        "Saya",
        "Kamu"
      ]
    }
  },
  {
    id: 193,
    conversation: [
      "Semar: 'Gong! kowe wis adus pa? kok kamar mandi garing'",
      "Bagong: 'Uwes pak, aku mau cepet banget aduse lha adem je pak'",
      "Semar: 'Uwis kepiye? lha wong ora ana suara krucak-krucuk kok Gong!'",
      "Bagong: 'Lho bapak hehe maksute adus angin pak'",
      "Semar: 'Lha gene kuwi jenenge kowe urung adus'",
      "Semar: 'Lho Le kok wani ngapusi karo wong tua ta dadi wong kuwi kudu jujur Gong!'",
      "Bagong: 'Ya pak, aku _____ wis ngapusi'"
    ],
    questionLine: "Ukara sing trep kanggo ngisi ceceg-ceceg:",
    type: "multiple_choice" as const,
    options: [
      "Uwes, bapak, njaluk ngapura",
      "Sampun, rama, nyuwun sewu",
      "Sampun, rama, ngapunten",
      "uwes, bapak, ngapunten"
    ],
    correctAnswer: 0,
    explanation: "'Uwes, bapak, njaluk ngapura' yaiku ukara sing trep ing basa Jawa ngoko kanggo nyuwun pangapura marang wong tuwa.",
    character: "Bagong",
    level: 1,
    hint: "Sedaya ukara rumpang ngagem Bahasa Ngoko",
    translation: {
      conversation: [
        "Semar: 'Gong! kamu sudah mandi kah? kenapa kamar mandi masih kering'",
        "Bagong: 'Sudah pak, saya tadi cepat sekali mandinya soalnya airnya dingin'",
        "Semar: 'Sudah bagaimana? orang tidak ada suara krucuk-krucuk kok Gong'",
        "Bagong: 'Lho bapak hehe maksudnya mandi angin pak'",
        "Semar: 'Lha itu namanya kamu belum mandi'",
        "Semar: 'Lho nak, kamu kok berani membohongi orang tua sih, jadi orang itu harus jujur Gong!'",
        "Bagong: 'Baik pak, saya ____ sudah berbohong'"
      ],
      questionLine: "Kalimat yang tepat untuk mengisi titik-titik:",
      options: [
        "Sudah, bapak, minta maaf",
        "Sudah, bapak, permisi",
        "Sudah, bapak, maaf",
        "Sudah, bapak, maaf"
      ]
    }
  },

  // Bagong Level 2 - Essay Questions
  {
    id: 201,
    conversation: [
      "Semar: 'Murid-murid, dinten menika wonten murid baru pindahan saka SD Punakawan, ayo tepangan nak karo kancane!'",
      "Bagong: '(Nderek) tepangan nama ku Bagong cita-cita ku dadi stand-up comedian'",
      "Semar: 'Gong kowe lungguh jejer karo Arjuna ya! aja kakean gojek'"
    ],
    questionLine: "Apa tegese tembung 'nderek' ing ukara kasebut?",
    type: "essay" as const,
    options: [],
    correctAnswer: 0,
    correctAnswerText: "Numpang",
    explanation: "'Nderek' tegese numpang utawa melu. Ing konteks iki, Bagong nggunakake tembung 'nderek' kanggo ngandharake yen dheweke numpang utawa melu tepangan.",
    character: "Bagong",
    level: 2,
    translation: {
       conversation: [
         "Semar: 'Murid-murid hari ini ada murid baru pindahan dari SD Punakawan, ayo kenalan nak dengan temannya!'",
         "Bagong: '(Nderek) perkenalan nama saya Bagong cita-cita saya menjadi stand-up komedian'",
         "Semar: 'Gong kamu duduk sampingan dengan Arjuna ya! jangan kebanyakan gojek'"
       ],
       questionLine: "Apa arti kata 'nderek' dalam kalimat tersebut?",
       options: [],
       correctAnswerText: "Numpang"
     }
  },
  {
    id: 202,
    conversation: [
      "Arjuna: 'Lenggah mriki tepangaken kula Arjuna Ksatria Madukara'",
      "Bagong: 'Tepangake, aku Bagong aku penasihat Ksatria'",
      "Arjuna: 'Woo sampean putrane Kakang Semar?'",
      "Bagong: 'Hooh eh (piwulang) wis arep dimulai'"
    ],
    questionLine: "Apa tegese tembung 'piwulang' ing ukara kasebut?",
    type: "essay" as const,
    options: [],
    correctAnswer: 0,
    correctAnswerText: "Pelajaran",
    explanation: "'Piwulang' tegese pelajaran utawa wulangan. Ing konteks iki, Bagong ngandharake yen pelajaran wis arep dimulai.",
    character: "Bagong",
    level: 2,
    translation: {
       conversation: [
         "Arjuna: 'Duduk sini perkenalkan nama saya Arjuna Ksatria Madukara'",
         "Bagong: 'Perkenalkan, saya Bagong saya penasihat ksatria'",
         "Arjuna: 'Woo kamu anaknya Kakak Semar?'",
         "Bagong: 'Hooh, eh (piwulang) sudah mau dimulai'"
       ],
       questionLine: "Apa arti kata 'piwulang' dalam kalimat tersebut?",
       options: [],
       correctAnswerText: "Pelajaran"
     }
  },
  {
    id: 203,
    conversation: [
      "(bel wangsul, Petruk ngentosi Bagong ing ngajengipun kelas Bagong)",
      "Gareng: 'Gong! piye dina sepisan sekolah? wis siap dadi siswa teladan iki kudune!'",
      "Bagong: 'Wah Reng!, rasane koyo es campur'",
      "Gareng: 'Welah lha kepiye ta sampean ki?'",
      "Bagong: 'Tekno durung (tepung) dadi mara keringet adem'",
      "Gareng: 'Welah sampean ki Gong haha'"
    ],
    questionLine: "Apa tegese tembung 'tepung' ing ukara kasebut?",
    type: "essay" as const,
    options: [],
    correctAnswer: 0,
    correctAnswerText: "Berkenalan",
    explanation: "'Tepung' tegese tepangan utawa berkenalan. Ing konteks iki, Bagong ngandharake yen dheweke durung tepangan karo kanca-kancane, dadi nggawe dheweke gugup.",
    character: "Bagong",
    level: 2,
    hint: "Bagong merasa gugup seperti 'es campur' karena belum melakukan sesuatu dengan teman-temannya. Kata 'tepung' berhubungan dengan aktivitas sosial untuk saling mengenal.",
    translation: {
       conversation: [
         "(Bel pulang Petruk menunggu Bagong di depan kelas Bagong)",
         "Gareng: 'Gong! Bagaimana hari pertama sekolah? Sudah siap menjadi siswa teladan ini harusnya!'",
         "Bagong: 'Wah Reng!, rasanya seperti es campur'",
         "Gareng: 'Loh, lha bagaimana sih kamu itu?'",
         "Bagong: 'Karena belum (tepung) jadi membuat keringat dingin'",
         "Gareng: 'Oalah kamu tu Gong haha'"
       ],
       questionLine: "Apa arti kata 'tepung' dalam kalimat tersebut?",
       options: [],
       correctAnswerText: "Berkenalan"
     }
  },

  // Bagong Level 3 - Multiple Choice Questions
  {
    id: 301,
    conversation: [
      "Petruk: 'Benjing badhe wonten kegiatan kerja bakti nggih, saking ngajeng dumugi wingkingipun dhusun'",
      "Bagong: 'Aku yo uwes mikirke kostum sesok ki!'",
      "Petruk: 'Lah sampean ki kerja bakti kok mikirke kostum!'",
      "Bagong: '_______________'",
      "Semar: 'Yowes, ngeneki para warga mbekta piranti kangge reresik, Bagong ngawa awak wae!'"    ],
    questionLine: "Bagong: '_______________'",
    type: "multiple_choice" as const,
    options: [
      "Lhaiya ta ben cocok dipajang neng kalender rt!",
      "Laembuh ta ben cocok dipajang neng kalender rt!",
      "Lha nggih supados cocok dipunpajang ning kalender rt!",
      "Lha nggih supados cocok dipunpajang wonten kalender rt!"
    ],
    correctAnswer: 0,
    explanation: "Jawaban yang benar menggunakan bahasa Jawa ngoko yang sesuai dengan karakter Bagong dalam konteks percakapan sehari-hari.",
    character: "Bagong",
    level: 3,
    hint: "Bagong ingin terlihat bagus dalam foto kerja bakti. Pilih jawaban yang menggunakan bahasa ngoko (informal) karena Bagong berbicara santai dengan teman-temannya.",
    translation: {
      conversation: [
        "Petruk: 'Besok akan ada kegiatan kerja bakti ya, dari depan sampai belakang dusun'",
        "Bagong: 'Aku ya sudah memikirkan kostum besok ini!'",
        "Petruk: 'Lah kamu itu kerja bakti kok mikirin kostum!'",
        "Bagong: '_______________'",
        "Semar: 'Yaudah, begini para warga membawa alat untuk bebersih, Bagong membawa badan saja!'"
      ],
      questionLine: "Bagong: '_______________'",
      options: [
        "Lha iya kan biar cocok dipajang di kalender RT!",
        "Lha tidak tau sih biarin cocok dipajang di kalender RT!",
        "Lha iya supaya cocok dipajang di kalender RT!",
        "Lha iya supaya cocok dipajang di kalender RT!"
      ]
    }
  },
  {
    id: 302,
    conversation: [
      "Semar: 'Lho kuwi sek teko nggo jas abang kinclong sopo?'",
      "Bagong: 'Halo halo sugeng rawuh ing vlog NinjaGong!'",
      "Bagong: 'Aku bagian dokumentasi iki sapuku wis pink cetar limited edition!'",
      "Semar: 'Sapune kowe cetar tapi tangane ora kerjo yo ora guna'",
      "Bagong: '_______________'",
      "Semar: 'Ealah yowes gong karepmu!'"
    ],
    questionLine: "Bagong: '_______________'",
    type: "multiple_choice" as const,
    options: [
      "Kula puniku manah tebih pak, menawi NinjaGong viral saged angsal sponsor",
      "Kula menika nggalih tebih pak, menawi NinjaGong viral saged keparing sponsor",
      "Aku iku mikir adoh pak, yen NinjaGong viral bisa oleh sponsor",
      "Kula menika nggalih tebih pak, menawi NinjaGong viral saged angsal sponsor"
    ],
    correctAnswer: 2,
    explanation: "Jawaban yang benar menggunakan bahasa Jawa ngoko yang sesuai dengan karakter Bagong dalam konteks percakapan dengan Semar.",
    character: "Bagong",
    level: 3,
    translation: {
      conversation: [
        "Semar: 'Lho itu yang datang pakai jas merah siapa?'",
        "Bagong: 'Halo halo selamat datang di vlog NinjaGong!'",
        "Bagong: 'Saya bagian dokumentasi ini sapu saya sudah pink cetar limited edition!'",
        "Semar: 'Sapunya kamu cetar tapi tangannya tidak kerja ya tidak berguna'",
        "Bagong: '_______________'",
        "Semar: 'Ealah ya sudah Gong terserah kamu!'"
      ],
      questionLine: "Bagong: '_______________'",
      options: [
        "Saya itu berpikir jauh pak, apabila NinjaGong viral bisa mendapat sponsor",
        "Saya itu berpikir jauh pak, apabila NinjaGong viral bisa mendapat sponsor",
        "Saya itu berpikir jauh pak, apabila NinjaGong viral bisa mendapat sponsor",
        "Saya itu berpikir jauh pak, apabila NinjaGong viral bisa mendapat sponsor"
      ]
    }
  },
  {
    id: 303,
    conversation: [
      "Bagong: 'Para pamirsa saiki ana Bapak ku SEMAR! ingkang nyapu ngange sapu jadul!'",
      "*(bagong kepleset mlebet got amargi mlampah mundur)",
      "Semar: 'Lho nak tenan mlebu kalen to kowe haha'",
      "Bagong: '_______________'",
      "Petruk: 'Niate sampean ki wis apik nanging ana-ana wae Gong!'",
      "Bagong: 'Huhu sapu limited edition ku rusak'"
    ],
    questionLine: "Bagong: '_______________'",
    type: "multiple_choice" as const,
    options: [
      "kula badhe kerja bakti langkung keren supados ingkang sanesipun dados termotivasi",
      "kula ajeng kerja bakti langkung keren supados ingkang sanesipun dados termotivasi",
      "aku gur kepengen kerja bakti dadi luih keren ben sek liyane dadi termotivasi",
      "kula arep kerja bakti langkung keren supados ingkang sanesipun dados termotivasi"
    ],
    correctAnswer: 2,
    explanation: "Jawaban yang benar menggunakan bahasa Jawa ngoko yang sesuai dengan karakter Bagong dalam situasi informal.",
    character: "Bagong",
    level: 3,
    translation: {
      conversation: [
        "Bagong: 'Para pemirsa sekarang ada bapak saya SEMAR! yang menyapu menggunakan sapu jadul!'",
        "*(Bagong kepleset masuk got karena berjalan mundur)",
        "Semar: 'Lho beneran kan masuk got kan kamu haha'",
        "Bagong: '_______________'",
        "Petruk: 'Niatnya kamu itu sudah bagus tapi ada-ada saja Gong!'",
        "Bagong: 'Huhu sapu limited edition ku rusak'"
      ],
      questionLine: "Bagong: '_______________'",
      options: [
        "Saya mau kerja bakti lebih keren supaya yang lain menjadi termotivasi",
        "Saya mau kerja bakti lebih keren supaya yang lain menjadi termotivasi",
        "Saya hanya ingin kerja bakti menjadi lebih keren supaya yang lain menjadi termotivasi",
        "Saya ingin kerja bakti lebih keren supaya yang lain dapat termotivasi"
      ]
    }
  },

    // Bagong Level 4 - Multiple Choice Questions
    {
      id: 404,
      conversation: [
        'Bagong: "Aku wis ndeteksi lan nyingkirake 4 jebakan sadurunge kowe mlaku."',
        'Semar: "Lho Gong, kowe kok iso ngerteni jebakan-jebakan kuwi?"',
        'Bagong: "_____________"',
        'Semar: "Wah, apik tenan Gong! kowe wis dadi ahli jebakan saiki."'
      ],
      questionLine: 'Bagong: "_____________"',
      options: [
        'Aku wis ndeteksi lan nyingkirake 4 jebakan sadurunge kowe mlaku.',
        'Wis tak tata lan tak delok maneh jebakané, ben ora nyilakani kowe kabeh.',
        'Aku wis nandhani posisi jebakan ing peta, ben gampang diwaspadai.',
        'Alas sisih wetan wis tak resiki, jebakan cilik-cilik tak copoti.'
      ],
      correctAnswer: 1,
      explanation: 'Jawaban yang benar menunjukkan Bagong menjelaskan cara dia menata dan memeriksa jebakan agar tidak membahayakan.',
      character: 'bagong',
      level: 4,
      translation: {
        conversation: [
          'Bagong: "Aku sudah mendeteksi dan menyingkirkan 4 jebakan sebelum kalian lewat."',
          'Semar: "Lho Gong, kamu kok bisa mengetahui jebakan-jebakan itu?"',
          'Bagong: "_____________"',
          'Semar: "Wah, bagus sekali Gong! kamu sudah jadi ahli jebakan sekarang."'
        ],
        questionLine: 'Bagong: "_____________"',
        options: [
          'Aku sudah mendeteksi dan menyingkirkan 4 jebakan sebelum kalian lewat.',
          'Sudah kutata dan kulihat lagi jebakannya, biar tidak mencelakai kalian semua.',
          'Aku sudah menandai posisi jebakan di peta, supaya gampang dihindari.',
          'Hutan sebelah timur sudah kubersihkan, termasuk jebakan-jebakan kecil yang tersebar.'
        ]
      }
    },
    {
      id: 405,
      conversation: [
        'Semar: "Gong, kowe krasa apa-apa ora ing panggonan iki?"',
        'Bagong: "_____________"',
        'Semar: "Wah, pancen bener Gong! pusaka Kalimasada ndhelik ing kene."',
        'Bagong: "Aku wis ngrasakake saka mau, pak!"'
      ],
      questionLine: 'Bagong: "_____________"',
      options: [
        'Aku krasa lemah iki gemeter, koyo ana tenaga aneh.',
        'Panggonan iki nuwuhake rasa ora enak, hawa panas banget.',
        'Aku nemu geter alus saka sela iku, katon pusaka ndhelik nang kene.',
        'Angine muter-muter, kahanan kene kok ora umum.'
      ],
      correctAnswer: 2,
      explanation: 'Jawaban yang benar menunjukkan kemampuan Bagong merasakan getaran halus dari pusaka yang tersembunyi.',
      character: 'bagong',
      level: 4,
      translation: {
        conversation: [
          'Semar: "Gong, kamu merasa apa-apa tidak di tempat ini?"',
          'Bagong: "_____________"',
          'Semar: "Wah, memang benar Gong! pusaka Kalimasada tersembunyi di sini."',
          'Bagong: "Aku sudah merasakannya dari tadi, pak!"'
        ],
        questionLine: 'Bagong: "_____________"',
        options: [
          'Aku merasa tanah ini bergetar, seperti ada kekuatan aneh.',
          'Tempat ini bikin perasaan tidak enak, udaranya panas banget.',
          'Aku merasakan getaran halus dari celah itu, dan hatiku memberi tahu ada pusaka tersimpan.',
          'Anginnya berputar-putar, keadaan di sini memang tidak wajar.'
        ]
      }
    },
    {
      id: 406,
      conversation: [
        'Semar: "Gong, kowe wis slamet saka jebakan guwa kuwi."',
        'Bagong: "_____________"',
        'Semar: "Iya Gong, untunge aku cepet nulungi kowe."',
        'Bagong: "Aku ora bakal lali karo kabecikan panjenengan, pak."'
      ],
      questionLine: 'Bagong: "_____________"',
      options: [
        'Matur nuwun yo, Mar, nek ora aku wis keseret jurang.',
        'Untunge kowe cepet nulungi aku, nek ora wis mati konyol.',
        'Aku matur nuwun tenan, wis ditulungi saka jebakan edan kuwi.',
        'Aku sukur banget, nek ora kowe kabeh aku wis ora ana.'
      ],
      correctAnswer: 0,
      explanation: 'Jawaban yang benar menunjukkan ucapan terima kasih Bagong yang sopan dan sesuai dengan karakternya.',
      character: 'bagong',
      level: 4,
      translation: {
        conversation: [
          'Semar: "Gong, kamu sudah selamat dari jebakan gua itu."',
          'Bagong: "_____________"',
          'Semar: "Iya Gong, untung aku cepat menolongmu."',
          'Bagong: "Aku tidak akan lupa dengan kebaikan bapak."'
        ],
        questionLine: 'Bagong: "_____________"',
        options: [
          'Terima kasih ya, Mar, kalau tidak aku sudah jatuh ke jurang.',
          'Untung kamu cepat menolongku, kalau tidak aku sudah mati konyol.',
          'Aku benar-benar berterima kasih, sudah ditolong dari jebakan gila itu.',
          'Aku sangat bersyukur, kalau bukan kalian aku sudah tidak ada.'
        ]
      }
    },

    // Bagong Level 4 - Multiple Choice Questions
    {
      id: 404,
      conversation: [
        'Bagong: "Aku wis ndeteksi lan nyingkirake 4 jebakan sadurunge kowe mlaku."',
        'Semar: "Lho Gong, kowe kok iso ngerti jebakan?"',
        'Bagong: "_____________"'
      ],
      questionLine: 'Bagong nerangake jebakan. Ukara ingkang trep:',
      options: [
        'Aku wis ndeteksi lan nyingkirake 4 jebakan sadurunge kowe mlaku.',
        'Wis tak tata lan tak delok maneh jebakané, ben ora nyilakani kowe kabeh.',
        'Aku wis nandhani posisi jebakan ing peta, ben gampang diwaspadai.',
        'Alas sisih wetan wis tak resiki, jebakan cilik-cilik tak copoti.'
      ],
      correctAnswer: 1,
      explanation: 'Jawaban yang benar menunjukkan Bagong menjelaskan cara dia menata dan memeriksa jebakan untuk keselamatan.',
      character: 'Bagong',
      level: 4,
      translation: {
        conversation: [
          'Bagong: "Aku sudah mendeteksi dan menyingkirkan 4 jebakan sebelum kalian lewat."',
          'Semar: "Lho Gong, kamu kok bisa tahu jebakan?"',
          'Bagong: "_____________"'
        ],
        questionLine: 'Bagong menjelaskan jebakan di hutan. Kalimat yang tepat:',
        options: [
          'Aku sudah mendeteksi dan menyingkirkan 4 jebakan sebelum kalian lewat.',
          'Sudah kutata dan kulihat lagi jebakannya, biar tidak mencelakai kalian semua.',
          'Aku sudah menandai posisi jebakan di peta, supaya gampang dihindari.',
          'Hutan sebelah timur sudah kubersihkan, termasuk jebakan-jebakan kecil yang tersebar.'
        ]
      }
    },
    {
      id: 405,
      conversation: [
        'Bagong: "Aku krasa lemah iki gemeter, koyo ana tenaga aneh."',
        'Semar: "Gong, kowe rumangsa apa?"',
        'Bagong: "_____________"'
      ],
      questionLine: 'Bagong nduweni pangrasa ajaib ing panggonan pusaka. Ukara ingkang trep:',
      options: [
        'Aku krasa lemah iki gemeter, koyo ana tenaga aneh.',
        'Panggonan iki nuwuhake rasa ora enak, hawa panas banget.',
        'Aku nemu geter alus saka sela iku, katon pusaka ndhelik nang kene.',
        'Angine muter-muter, kahanan kene kok ora umum.'
      ],
      correctAnswer: 2,
      explanation: 'Jawaban yang benar menunjukkan Bagong merasakan getaran halus yang menandakan adanya pusaka tersembunyi.',
      character: 'Bagong',
      level: 4,
      translation: {
        conversation: [
          'Bagong: "Aku merasa tanah ini bergetar, seperti ada kekuatan aneh."',
          'Semar: "Gong, kamu merasakan apa?"',
          'Bagong: "_____________"'
        ],
        questionLine: 'Bagong merasakan keanehan di tempat pusaka. Kalimat yang tepat:',
        options: [
          'Aku merasa tanah ini bergetar, seperti ada kekuatan aneh.',
          'Tempat ini bikin perasaan tidak enak, udaranya panas banget.',
          'Aku merasakan getaran halus dari celah itu, dan hatiku memberi tahu ada pusaka tersimpan.',
          'Anginnya berputar-putar, keadaan di sini memang tidak wajar.'
        ]
      }
    },
    {
      id: 406,
      conversation: [
        'Bagong: "Untunge kowe cepet nulungi aku, nek ora wis mati konyol."',
        'Semar: "Gong, kowe kudu luwih ati-ati."',
        'Bagong: "_____________"'
      ],
      questionLine: 'Bagong matur panuwun marang Semar amarga kaslametan saka jebakan guwa. Ukara ingkang trep:',
      options: [
        'Matur nuwun yo, Mar, nek ora aku wis keseret jurang.',
        'Untunge kowe cepet nulungi aku, nek ora wis mati konyol.',
        'Aku matur nuwun tenan, wis ditulungi saka jebakan edan kuwi.',
        'Aku sukur banget, nek ora kowe kabeh aku wis ora ana.'
      ],
      correctAnswer: 0,
      explanation: 'Jawaban yang benar menunjukkan Bagong berterima kasih dengan sopan menggunakan "matur nuwun" yang tepat.',
      character: 'Bagong',
      level: 4,
      translation: {
        conversation: [
          'Bagong: "Untung kamu cepat menolongku, kalau tidak aku sudah mati konyol."',
          'Semar: "Gong, kamu harus lebih hati-hati."',
          'Bagong: "_____________"'
        ],
        questionLine: 'Bagong berterima kasih kepada Semar karena diselamatkan dari jebakan gua. Kalimat yang tepat:',
        options: [
          'Terima kasih ya, Mar, kalau tidak aku sudah jatuh ke jurang.',
          'Untung kamu cepat menolongku, kalau tidak aku sudah mati konyol.',
          'Aku benar-benar berterima kasih, sudah ditolong dari jebakan gila itu.',
          'Aku sangat bersyukur, kalau bukan kalian aku sudah tidak ada.'
        ]
      }
    },
 
    // Semar Level 2 - Essay Questions
    {
      id: 301,
    conversation: [
      'Pandu Dewanata: "Ki Lurah Semar, kula kadosipun mireng suwanten rame saking wingking dalemipun panjenengan"',
      'Semar: "_____________"',
      'Pandu Dewanata: "Panjenengan menika saged mawon, nanging dalu menika tetep kedah waspada"'
    ],
    questionLine: 'Semar: "_____________"',
    options: [
      'Niku sanes suwanten brebeg, nanging niku Bagong ingkang saweg rebutan jangkrik kaliyan tikus',
      'Kui udu suara brebeg, nanging kuwi ki Bagong sek lagi rebutan jangkrik karo tikus',
      'Menika sanes suwanten brebeg, nanging menika bagong ingkang saweg rebatan jangkrik kaliyan tikus',
      'Niku udu suwanten brebeg nanging kae ki Bagong sek nembe rebutan jangkrik kaliyan tikus'
    ],
    correctAnswer: 0,
    explanation: 'Jawaban yang benar menggunakan bahasa Jawa krama yang tepat untuk situasi formal.',
    character: 'semar',
    level: 3,
    translation: {
      conversation: [
        'Pandu Dewanata: "Ki Lurah Semar, saya sepertinya mendengar suara rame dari belakang rumahnya kamu"',
        'Semar: "____________"',
        'Pandu Dewanata: "Kamu itu bisa saja, tetapi malam ini tetap harus waspada"'
      ],
      questionLine: 'Semar: "____________"',
      options: [
        'Itu bukan suara berisik, tapi itu Bagong yang sedang rebutan jangkrik dengan tikus',
        'Itu bukan suara berisik, tapi itu tuh Bagong yang sedang rebutan jangkrik sama tikus',
        'Itu bukan suara berisik, tapi itu Bagong yang sedang rebutan jangkrik dengan tikus',
        'Itu bukan suara berisik tapi itu tuh Bagong yang sedang rebutan jangkrik dengan tikus'
      ]
    }
  },
  {
    id: 302,
    conversation: [
      'Bagong: "Pak, kula diakon ibu-ibu mrene tekna ngawaake gedhang goreng kangge bapak-bapak"',
      'Semar: "_____________"',
      'Bagong: "Mau Bagong mlayu ngoyak tikus tekne tikus e ngawa gathot e Bagong pak"',
      'Semar: "Oalah Gong! ya omongke nuwun ya ne ibu-ibu"'
    ],
    questionLine: 'Semar: "_____________"',
    options: [
      'loh gong kok panjenengan saget kepanggih ibu-ibu?',
      'loh gong koh kowe iso ketemu ibu-ibu?',
      'loh gong kok sampean saget kepanggih ibu-ibu?',
      'loh gong kok koe iso ketemu ibu-ibu?'
    ],
    correctAnswer: 1,
    explanation: 'Jawaban yang benar menggunakan bahasa Jawa ngoko yang sesuai untuk percakapan dengan Bagong.',
    character: 'semar',
    level: 3,
    translation: {
      conversation: [
        'Bagong: "Pak, saya disuruh ibu-ibu kesini karena membawakan pisang goreng untuk bapak-bapak"',
        'Semar: "________"',
        'Bagong: "Tadi Bagong berlari mengejar tikus karena tikusnya membawa gathot nya Bagong pak"',
        'Semar: "Oalah Gong! ya bilangin terima kasih ya kepada ibu-ibu"'
      ],
      questionLine: 'Semar: "________"',
      options: [
        'Loh gong kok kamu bisa bertemu ibu-ibu?',
        'Loh gong kok kamu bisa bertemu ibu-ibu?',
        'Loh gong kok kamu bisa bertemu ibu-ibu?',
        'Loh gong kok kamu bisa bertemu ibu-ibu?'
      ]
    }
  },
  {
    id: 303,
    conversation: [
      'Semar: "Ealah Reng jane wong saiki gur ronda dinggo formalitas!"',
      'Gareng: "Inggih pak, sendal kula, kula tilar ing jawi dados ganti ukuran L.Nanging samparan kula M"',
      'Semar: "____________________"'
    ],
    questionLine: 'Semar: "____________________"',
    options: [
      'Ealah Reng! wong jaman meniki, sandal namung dituker-tuker',
      'Ealah Reng! tiyang jaman sakmeniki bab sendal we dituker-tuker',
      'Ealah Reng! wong jaman saiki, bab sandal we kokyo dituker-tuker',
      'Ealah Reng! tiyang jaman saiki, sandal we dituker-tuker'
    ],
    correctAnswer: 2,
    explanation: 'Jawaban yang benar menggunakan bahasa Jawa ngoko yang natural untuk percakapan sehari-hari.',
    character: 'semar',
    level: 3,
    translation: {
      conversation: [
        'Semar: "Ealah Reng sebenarnya sebenarnya orang sekarang cuman ronda buat formalitas"',
        'Gareng: "Iya pak, sandal saya, saya tinggal di luar jadi ganti ukuran L. Tapi, kaki saya M"',
        'Semar: "_______________"'
      ],
      questionLine: 'Semar: "_______________"',
      options: [
        'Ealah Reng orang zaman sekarang, sendal hanya ditukar-tukar',
        'Ealah Reng orang zaman sekarang bab sendal saja ditukar-tukar',
        'Ealah Reng orang zaman sekarang bab sendal saja ditukar-tukar',
        'Ealah Reng orang zaman sekarang, sandal saja ditukar-tukar'
      ]
    }
  },

   // Semar Level 4 - Multiple Choice Questions
   {
     id: 401,
     conversation: [
       'Semar rumangsa luput amarga nuntun Pandhawa liwat jalur alas wingit.'
     ],
     questionLine: 'Ukara ingkang trep:',
     options: [
       'Ngapunten rama, kula sampun nglirwakake wewarah pertapan, dados malah mlebet jalur wingit.',
       'Kula nyuwun sewu, jalur punika saged kula selehake mawon, guru.',
       'Duh Pandhawa, aku wis luput amarga nuntun kowe mlebu jalur alas sing wingit.',
       'Aku nyuwun ngapura, amarga lakuku malah nuwuhake bebaya tumrap kowe kabeh.'
     ],
     correctAnswer: 2,
     explanation: 'Jawaban yang benar menggunakan bahasa Jawa ngoko yang sesuai dengan karakter Semar saat berbicara dengan Pandhawa.',
     character: 'semar',
     level: 4,
     translation: {
       conversation: [
         'Semar merasa bersalah karena menuntun Pandhawa lewat jalur hutan angker.'
       ],
       questionLine: 'Kalimat yang tepat:',
       options: [
         'Maaf rama, saya telah mengabaikan nasihat pertapaan, jadi malah masuk jalur angker.',
         'Saya mohon izin, jalur ini saya tinggalkan saja, guru.',
         'Duh Pandhawa, aku sudah salah karena menuntun kalian masuk jalur hutan yang angker.',
         'Aku mohon maaf, karena tindakanku justru menimbulkan bahaya bagi kalian semua.'
       ]
     }
   },
   {
     id: 402,
     conversation: [
       'Semar maringi pitutur nalika Pandhawa arep ngadhepi Buta Cakil.'
     ],
     questionLine: 'Ukara ingkang trep:',
     options: [
       'Menawi ngendika kanthi tembung kasar, Buta Cakil saged njalari prahara ing ngarep gapura.',
       'Sadurunge kowe kabeh sowan, luwih becik nganggo basa alus supaya ora gawe tersinggungan.',
       'Panjenengan ajrih, nanging ngendika kanthi ikhlas saged nrajang bebaya.',
       'Ngendikane nganggo krama alus, awit lawan punika sejatine titah kang gegandhengan kaliyan batin.'
     ],
     correctAnswer: 1,
     explanation: 'Jawaban yang benar menunjukkan nasihat Semar yang bijaksana menggunakan bahasa ngoko yang tepat.',
     character: 'semar',
     level: 4,
     translation: {
       conversation: [
         'Semar memberi nasihat saat Pandhawa akan menghadapi Buta Cakil.'
       ],
       questionLine: 'Kalimat yang tepat:',
       options: [
         'Jika berbicara dengan kata kasar, Buta Cakil bisa menimbulkan keributan di depan gerbang.',
         'Sebelum kalian semua maju, sebaiknya gunakan bahasa halus supaya tidak menyinggung.',
         'Kalian takut, tetapi bicara dengan ikhlas bisa menembus bahaya.',
         'Berkatalah dengan bahasa krama alus, sebab lawan itu sejatinya makhluk yang punya ikatan batin.'
       ]
     }
   },
   {
     id: 403,
     conversation: [
       'Semar ngajak Pandhawa rembugan sadurunge mlebu guwa Kalimasada.'
     ],
     questionLine: 'Ukara ingkang trep:',
     options: [
       'Aku arep ngomong dhisik, sadurunge kowe mlebu guwa iku, ana rerangken gaib ing jerone.',
       'Ayo padha ndedonga luwih dhisik, amarga guwa iki pancen wingit.',
       'Aku bakal nderek wae, awit guwa iku biyasa dadi panggonan tapa.',
       'Ayo mlaku-mlaku dhisik, panggonan iki peteng lan angker.'
     ],
     correctAnswer: 0,
     explanation: 'Jawaban yang benar menunjukkan Semar memberikan peringatan penting dengan bahasa ngoko yang sesuai.',
     character: 'semar',
     level: 4,
     translation: {
       conversation: [
         'Semar mengajak Pandhawa berdiskusi sebelum masuk gua Kalimasada.'
       ],
       questionLine: 'Kalimat yang tepat:',
       options: [
         'Aku ingin bicara dulu, sebelum kalian masuk gua itu, ada kekuatan gaib di dalamnya.',
         'Mari kita berdoa dulu, karena gua ini memang angker.',
         'Aku akan ikut saja, sebab gua ini sering jadi tempat bertapa.',
         'Mari berjalan-jalan sebentar, tempat ini memang gelap dan menyeramkan.'
       ]
     }
   },

   // Bagong Level 4 - Multiple Choice Questions
   {
     id: 404,
     conversation: [
       'Bagong: "Aku wis ndeteksi lan nyingkirake 4 jebakan sadurunge kowe mlaku."',
       'Semar: "Lho Gong, kowe kok iso ngerti jebakan?"',
       'Bagong: "Wis tak tata lan tak delok maneh jebakané, ben ora nyilakani kowe kabeh."'
     ],
     questionLine: 'Ukara ingkang trep:',
     options: [
       'Aku wis ndeteksi lan nysingkirake 4 jebakan sadurunge kowe mlaku.',
       'Wis tak tata lan tak delok maneh jebakané, ben ora nyilakani kowe kabeh.',
       'Aku wis nandhani posisi jebakan ing peta, ben gampang diwaspadai.',
       'Alas sisih wetan wis tak resiki, jebakan cilik-cilik tak copoti.'
     ],
     correctAnswer: 1,
     explanation: 'Jawaban yang benar menunjukkan Bagong menjelaskan cara dia menata dan memeriksa jebakan untuk keselamatan.',
     character: 'Bagong',
     level: 4,
     translation: {
       conversation: [
         'Bagong: "Aku sudah mendeteksi dan menyingkirkan 4 jebakan sebelum kalian lewat."',
         'Semar: "Lho Gong, kamu kok bisa tahu jebakan?"',
         'Bagong: "Sudah kutata dan kulihat lagi jebakannya, biar tidak mencelakai kalian semua."'
       ],
       questionLine: 'Kalimat yang tepat:',
       options: [
         'Aku sudah mendeteksi dan menyingkirkan 4 jebakan sebelum kalian lewat.',
         'Sudah kutata dan kulihat lagi jebakannya, biar tidak mencelakai kalian semua.',
         'Aku sudah menandai posisi jebakan di peta, supaya gampang dihindari.',
         'Hutan sebelah timur sudah kubersihkan, termasuk jebakan-jebakan kecil yang tersebar.'
       ]
     }
   },
   {
     id: 405,
     conversation: [
       'Bagong: "Aku krasa lemah iki gemeter, koyo ana tenaga aneh."',
       'Semar: "Lho Gong, kowe ngrasa apa?"',
       'Bagong: "Aku nemu geter alus saka sela iku, katon pusaka ndhelik nang kene."'
     ],
     questionLine: 'Ukara ingkang trep:',
     options: [
       'Aku krasa lemah iki gemeter, koyo ana tenaga aneh.',
       'Panggonan iki nuwuhake rasa ora enak, hawa panas banget.',
       'Aku nemu geter alus saka sela iku, katon pusaka ndhelik nang kene.',
       'Angine muter-muter, kahanan kene kok ora umum.'
     ],
     correctAnswer: 2,
     explanation: 'Jawaban yang benar menunjukkan Bagong merasakan getaran halus yang menandakan adanya pusaka tersembunyi.',
     character: 'Bagong',
     level: 4,
     translation: {
       conversation: [
         'Bagong: "Aku merasa tanah ini bergetar, seperti ada kekuatan aneh."',
         'Semar: "Lho Gong, kamu merasakan apa?"',
         'Bagong: "Aku merasakan getaran halus dari celah itu, dan hatiku memberi tahu ada pusaka tersimpan."'
       ],
       questionLine: 'Kalimat yang tepat:',
       options: [
         'Aku merasa tanah ini bergetar, seperti ada kekuatan aneh.',
         'Tempat ini bikin perasaan tidak enak, udaranya panas banget.',
         'Aku merasakan getaran halus dari celah itu, dan hatiku memberi tahu ada pusaka tersimpan.',
         'Anginnya berputar-putar, keadaan di sini memang tidak wajar.'
       ]
     }
   },
   {
     id: 406,
     conversation: [
       'Bagong: "Matur nuwun yo, Mar, nek ora aku wis keseret jurang."',
       'Semar: "Wis Gong, sing penting kowe slamet."',
       'Bagong: "Aku matur nuwun tenan, wis ditulungi saka jebakan edan kuwi."'
     ],
     questionLine: 'Ukara ingkang trep:',
     options: [
       'Matur nuwun yo, Mar, nek ora aku wis keseret jurang.',
       'Untunge kowe cepet nulungi aku, nek ora wis mati konyol.',
       'Aku matur nuwun tenan, wis ditulungi saka jebakan edan kuwi.',
       'Aku sukur banget, nek ora kowe kabeh aku wis ora ana.'
     ],
     correctAnswer: 0,
     explanation: 'Jawaban yang benar menunjukkan Bagong berterima kasih dengan sopan kepada Semar karena diselamatkan.',
     character: 'Bagong',
     level: 4,
     translation: {
       conversation: [
         'Bagong: "Terima kasih ya, Mar, kalau tidak aku sudah jatuh ke jurang."',
         'Semar: "Sudah Gong, yang penting kamu selamat."',
         'Bagong: "Aku benar-benar berterima kasih, sudah ditolong dari jebakan gila itu."'
       ],
       questionLine: 'Kalimat yang tepat:',
       options: [
         'Terima kasih ya, Mar, kalau tidak aku sudah jatuh ke jurang.',
         'Untung kamu cepat menolongku, kalau tidak aku sudah mati konyol.',
         'Aku benar-benar berterima kasih, sudah ditolong dari jebakan gila itu.',
         'Aku sangat bersyukur, kalau bukan kalian aku sudah tidak ada.'
       ]
     }
   },

   // Semar Level 2 - Essay Questions
   {
     id: 204,
     conversation: [
      'Semar: "Truk! ayo baris (kaliyan) kanca-kancamu upacara wis arep mulai"',
      'Petruk: "Ngapunten pak …. awak kula keagengan"',
      'Petruk: "Baris teng wingking mboten pantes, baris teng ngajeng mangkih kanca-kanca pripun"',
      'Semar: "Lho… ya baris ing mburi Truk... wong kang pinter kui ngerti posisi"',
      'Petruk: "Nggih pak.."'
    ],
    questionLine: 'Apa persamaan kata dari "kaliyan" dalam percakapan di atas?',
    type: 'essay',
    options: [],
    correctAnswer: 0,
    correctAnswerText: 'bersama',
    explanation: 'Kata "kaliyan" dalam bahasa Jawa berarti "bersama" dalam bahasa Indonesia.',
    character: 'Semar',
    level: 2,
    translation: {
      conversation: [
        'Semar: "Truk! ayo baris (kaliyan) teman-temanmu, upacara sudah mau dimulai"',
        'Petruk: "Maaf pak…. badan saya kebesaran"',
        'Petruk: "Baris di belakang tidak pantas, baris di depan nanti teman-teman bagaimana?"',
        'Semar: "Lho.. ya baris di belakang Truk…. orang yang pintar itu tau posisi"',
        'Petruk: "Iya pak.."'
      ],
      questionLine: 'Apa persamaan kata dari "kaliyan" dalam percakapan di atas?',
      options: [],
      correctAnswerText: 'bersama'
    }
  },

  {
    id: 205,
    conversation: [
      'Semar: "Reng! tulung kowe (ambilkan) Buku Pepak Basa Jawa ing ruang guru"',
      'Gareng: "Nggih pak…. kula pundhutaken"',
      'Semar: "Ya Le tak enteni kene ya!"',
      'Gareng: "Nggih pak"'
    ],
    questionLine: 'Apa persamaan kata dari "ambilkan" dalam bahasa Jawa?',
    type: 'essay',
    options: [],
    correctAnswer: 0,
    correctAnswerText: 'jupukna',
    explanation: 'Kata "ambilkan" dalam bahasa Indonesia sama dengan "jupukna" dalam bahasa Jawa.',
    character: 'Semar',
    level: 2,
    translation: {
      conversation: [
        'Semar: "Reng! tolong kamu (ambilkan) Buku Pepak Basa Jawa di ruang guru"',
        'Gareng: "Baik pak…. saya ambilkan"',
        'Semar: "Ya nak, tak tunggu disini ya!"',
        'Gareng: "Iya pak"'
      ],
      questionLine: 'Apa persamaan kata dari "ambilkan" dalam bahasa Jawa?',
      options: [],
      correctAnswerText: 'jupukna'
    }
  },

  {
    id: 206,
    conversation: [
      'Arjuna: "Kakang Semar…. aku, lagi nesu amargi kanca ku boten netepi janji"',
      'Semar: "Ndoro, menawi sampean namung nesu atine sampean dadi peteng mulakno sampean kudu isa ngapura"',
      'Arjuna: "Nggih Kakang Semar.. mangkih tak cobi"',
      'Semar: "Nah kuwi tanda sampean wis dewasa (lembah manah) lan teges iku tandha kesatria sejati"'
    ],
    questionLine: 'Apa persamaan kata dari "lembah manah" dalam bahasa Indonesia?',
    type: 'essay',
    options: [],
    correctAnswer: 0,
    correctAnswerText: 'rendah hati',
    explanation: 'Kata "lembah manah" dalam bahasa Jawa berarti "rendah hati" dalam bahasa Indonesia.',
    hint: 'Perhatikan konteks percakapan tentang kedewasaan dan sifat kesatria sejati. "Lembah" berarti rendah, dan "manah" berarti hati. Gabungan kedua kata ini menunjukkan sikap yang tidak sombong.',
    character: 'Semar',
    level: 2,
    translation: {
      conversation: [
        'Arjuna: "Kakak Semar…. saya, baru marah karena teman saya tidak menepati janji"',
        'Semar: "Tuan, apabila kamu hanya marah hatimu menjadi gelap makanya, kamu harus bisa memaafkan"',
        'Arjuna: "Iya kakak Semar…. nanti saya coba"',
        'Semar: "Nah, itu tanda kamu sudah dewasa (lembah manah) dan tegas itu tanda kesatria sejati"'
      ],
      questionLine: 'Apa persamaan kata dari "lembah manah" dalam bahasa Indonesia?',
      options: [],
      correctAnswerText: 'rendah hati'
    }
  }
];

// Fungsi untuk mengorganisir data pertanyaan berdasarkan karakter dan level
export const getQuestionsByCharacterAndLevel = (character: string, level: number): Question[] => {
  return questionsData.filter(q => q.character === character && q.level === level);
};

// Fungsi untuk mendapatkan semua data dalam format yang dibutuhkan GamePlay
export const getFormattedQuestionsData = (): QuestionData => {
  const formatted: QuestionData = {};
  
  questionsData.forEach(question => {
    if (!formatted[question.character]) {
      formatted[question.character] = {};
    }
    if (!formatted[question.character][question.level]) {
      formatted[question.character][question.level] = [];
    }
    formatted[question.character][question.level].push(question);
  });
  
  return formatted;
};