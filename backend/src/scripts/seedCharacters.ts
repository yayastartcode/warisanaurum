import mongoose from 'mongoose';
import { Character } from '../models';
import { database } from '../config/database';

const characters = [
  {
    name: 'Semar',
    description: 'Punakawan bijaksana dan penuh kebijaksanaan',
    origin: 'Wayang Kulit Jawa',
    category: 'mythological',
    image: '/semar.png',
    facts: [
      'Semar adalah tokoh punakawan yang paling bijaksana',
      'Sering memberikan nasihat kepada para kesatria',
      'Memiliki kemampuan spiritual yang tinggi'
    ],
    difficulty: 'medium'
  },
  {
    name: 'Gareng',
    description: 'Punakawan yang lucu dan menghibur',
    origin: 'Wayang Kulit Jawa',
    category: 'mythological',
    image: '/gareng.png',
    facts: [
      'Gareng memiliki cacat fisik namun hati yang baik',
      'Sering menjadi penghibur dalam cerita wayang',
      'Anak dari Semar yang setia'
    ],
    difficulty: 'easy'
  },
  {
    name: 'Petruk',
    description: 'Punakawan yang cerdik dan kreatif',
    origin: 'Wayang Kulit Jawa',
    category: 'mythological',
    image: '/petruk.png',
    facts: [
      'Petruk dikenal dengan kecerdikan dan kreativitasnya',
      'Sering memberikan solusi unik untuk masalah',
      'Memiliki tubuh yang tinggi dan kurus'
    ],
    difficulty: 'medium'
  },
  {
    name: 'Bagong',
    description: 'Punakawan yang berani dan setia',
    origin: 'Wayang Kulit Jawa',
    category: 'mythological',
    image: '/bagong.png',
    facts: [
      'Bagong adalah punakawan yang paling muda',
      'Memiliki sifat berani dan tidak takut bahaya',
      'Setia kepada keluarga dan teman-temannya'
    ],
    difficulty: 'hard'
  }
];

async function seedCharacters() {
  try {
    console.log('Connecting to database...');
    await database.connect();
    
    console.log('Clearing existing characters...');
    await Character.deleteMany({});
    
    console.log('Creating characters...');
    const createdCharacters = await Character.insertMany(characters);
    
    console.log('Characters created successfully:');
    createdCharacters.forEach((char, index) => {
      console.log(`${index + 1}. ${char.name} - ID: ${char._id}`);
    });
    
    console.log('\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding characters:', error);
    process.exit(1);
  }
}

seedCharacters();