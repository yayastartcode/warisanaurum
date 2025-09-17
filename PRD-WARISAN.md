# Product Requirements Document (PRD)
# Aplikasi WARISAN - Platform Pembelajaran Bahasa Jawa

## 1. Overview Produk

### 1.1 Nama Produk
**WARISAN** - Aplikasi pembelajaran bahasa Jawa melalui permainan interaktif dengan karakter punokawan

### 1.2 Visi Produk
Melestarikan budaya Jawa melalui pembelajaran bahasa yang menyenangkan dan interaktif dengan tokoh-tokoh punokawan yang ikonik.

### 1.3 Target Audience
- Anak-anak usia 8-15 tahun
- Remaja dan dewasa yang ingin belajar bahasa Jawa
- Pecinta budaya Jawa
- Siswa sekolah yang mempelajari bahasa daerah

### 1.4 Tujuan Bisnis
- Melestarikan bahasa dan budaya Jawa
- Memberikan platform pembelajaran yang engaging
- Memperkenalkan tokoh punokawan kepada generasi muda

## 2. Fitur Utama

### 2.1 Sistem Autentikasi
- **Login/Register**: Sistem pendaftaran dan masuk yang sederhana
- **Session Management**: Pengelolaan sesi pengguna
- **Profile Management**: Pengelolaan profil pengguna

### 2.2 Homepage
- **Tutorial**: Panduan cara bermain dan pengenalan aplikasi
- **Main Menu**: Akses ke permainan utama
- **Navigation Bar**: Icon User, Skor, Home

### 2.3 Wheel of Fortune (Fitur Utama)
- **Character Selection**: Spin wheel berisi 4 karakter punokawan:
  - Semar
  - Petruk
  - Gareng
  - Bagong
- **QR Code Generation**: Generate QR code untuk karakter yang didapat
- **Character Introduction**: Scan QR code untuk melihat perkenalan karakter

### 2.4 Game System
- **4 Level per Karakter**: Setiap karakter memiliki 4 tingkat kesulitan
- **Life System**: 3 nyawa per pemain
- **Question Format**: Percakapan dengan pilihan ganda
- **Scoring System**: Perhitungan skor berdasarkan jawaban benar
- **Timer**: Tracking waktu bermain
- **Character-specific Questions**: Pertanyaan unik untuk setiap karakter

### 2.5 Reward System
- **Wisdom Messages**: Pesan bijak dari karakter di akhir permainan
- **Score Tracking**: Penyimpanan dan tampilan skor tertinggi
- **Progress Tracking**: Tracking kemajuan per karakter

## 3. User Journey

### 3.1 First Time User
1. Download dan buka aplikasi
2. Register akun baru
3. Login ke aplikasi
4. Melihat tutorial
5. Masuk ke homepage
6. Klik "Main" untuk memulai permainan

### 3.2 Game Flow
1. Spin wheel of fortune
2. Mendapatkan karakter punokawan
3. Scan QR code untuk melihat perkenalan
4. Klik "Mulai" untuk memulai permainan
5. Menjawab pertanyaan level 1-4
6. Melihat skor dan waktu
7. Mendapat pesan bijak dari karakter
8. Kembali ke homepage atau main lagi

### 3.3 Returning User
1. Login
2. Melihat skor sebelumnya
3. Pilih main lagi atau lihat progress
4. Lanjut bermain dengan karakter lain

## 4. Functional Requirements

### 4.1 Authentication
- FR-001: Sistem harus dapat melakukan registrasi pengguna baru
- FR-002: Sistem harus dapat melakukan login pengguna
- FR-003: Sistem harus dapat logout pengguna
- FR-004: Sistem harus dapat menyimpan session pengguna

### 4.2 Game Mechanics
- FR-005: Sistem harus dapat generate wheel of fortune dengan 4 karakter
- FR-006: Sistem harus dapat generate QR code untuk setiap karakter
- FR-007: Sistem harus dapat menampilkan perkenalan karakter via QR scan
- FR-008: Sistem harus dapat menyajikan 4 level pertanyaan per karakter
- FR-009: Sistem harus dapat mengelola 3 nyawa per game session
- FR-010: Sistem harus dapat menghitung skor berdasarkan jawaban benar
- FR-011: Sistem harus dapat tracking waktu bermain
- FR-012: Sistem harus dapat menampilkan pesan bijak di akhir game

### 4.3 Data Management
- FR-013: Sistem harus dapat menyimpan data pengguna
- FR-014: Sistem harus dapat menyimpan progress permainan
- FR-015: Sistem harus dapat menyimpan skor tertinggi
- FR-016: Sistem harus dapat menyimpan bank soal per karakter

## 5. Non-Functional Requirements

### 5.1 Performance
- NFR-001: Response time maksimal 3 detik untuk loading game
- NFR-002: QR code generation maksimal 2 detik
- NFR-003: Aplikasi harus dapat menangani minimal 100 concurrent users

### 5.2 Usability
- NFR-004: Interface harus user-friendly untuk anak-anak
- NFR-005: Navigasi harus intuitif dan mudah dipahami
- NFR-006: Tutorial harus jelas dan mudah diikuti

### 5.3 Security
- NFR-007: Password harus di-hash dengan algoritma yang aman
- NFR-008: Session harus memiliki timeout yang appropriate
- NFR-009: Data pengguna harus terenkripsi

### 5.4 Compatibility
- NFR-010: Aplikasi harus responsive di berbagai ukuran layar
- NFR-011: Kompatibel dengan browser modern (Chrome, Firefox, Safari)
- NFR-012: Support untuk mobile devices (iOS dan Android)

## 6. Content Requirements

### 6.1 Character Content
- **Semar**: Tokoh bijaksana, pertanyaan tentang filosofi Jawa
- **Petruk**: Tokoh lucu, pertanyaan tentang humor dan kehidupan sehari-hari
- **Gareng**: Tokoh setia, pertanyaan tentang kesetiaan dan persahabatan
- **Bagong**: Tokoh polos, pertanyaan tentang kejujuran dan kesederhanaan

### 6.2 Question Bank
- Minimal 20 pertanyaan per karakter per level
- Format: Dialog/percakapan dengan 4 pilihan jawaban
- Tingkat kesulitan bertingkat dari level 1-4
- Konten edukatif tentang bahasa dan budaya Jawa

### 6.3 Wisdom Messages
- Pesan bijak unik untuk setiap karakter
- Berkaitan dengan nilai-nilai Jawa
- Bahasa yang mudah dipahami

## 7. Technical Constraints

### 7.1 Database
- Menggunakan MongoDB Atlas sebagai database utama
- Struktur NoSQL untuk fleksibilitas data

### 7.2 Platform
- Web-based application
- Progressive Web App (PWA) untuk mobile experience
- Cross-platform compatibility

## 8. Success Metrics

### 8.1 User Engagement
- Daily Active Users (DAU)
- Session duration rata-rata
- Completion rate per level
- Retention rate (7-day, 30-day)

### 8.2 Learning Effectiveness
- Improvement score per user
- Time to complete levels
- Repeat play rate per character

### 8.3 Technical Metrics
- App performance (loading time)
- Error rate
- Uptime percentage

## 9. Future Enhancements

### 9.1 Phase 2 Features
- Multiplayer mode
- Leaderboard global
- Achievement system
- More characters (tokoh wayang lain)

### 9.2 Phase 3 Features
- Voice recognition untuk pronunciation
- AR integration untuk character interaction
- Story mode dengan narrative
- Social sharing features

## 10. Risks dan Mitigasi

### 10.1 Technical Risks
- **Risk**: Database performance dengan user scale
- **Mitigation**: Implementasi caching dan database optimization

### 10.2 Content Risks
- **Risk**: Akurasi konten budaya Jawa
- **Mitigation**: Konsultasi dengan ahli budaya Jawa

### 10.3 User Adoption Risks
- **Risk**: Low user engagement
- **Mitigation**: Gamification dan reward system yang menarik

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Prepared by**: Development Team  
**Approved by**: Product Owner