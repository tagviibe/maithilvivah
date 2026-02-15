import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'maithilvivah',
  synchronize: false,
});

const maleProfiles = [
  { first_name: 'Vikram', last_name: 'Thakur', dob: '1996-03-15', height: 178, education: 'masters', occupation: 'Product Manager', income: '10l_20l', city: 'Bangalore', state: 'Karnataka', gotra: 'Kashyap', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'Product manager at a leading tech company. Love reading, traveling and cooking.' },
  { first_name: 'Aditya', last_name: 'Jha', dob: '1994-07-22', height: 180, education: 'doctorate', occupation: 'Doctor', income: '20l_50l', city: 'Patna', state: 'Bihar', gotra: 'Bharadwaj', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'MBBS from AIIMS, currently practicing as a cardiologist. Family-oriented person.' },
  { first_name: 'Rahul', last_name: 'Mishra', dob: '1995-11-08', height: 175, education: 'masters', occupation: 'Software Engineer', income: '20l_50l', city: 'Hyderabad', state: 'Telangana', gotra: 'Vatsa', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'yes', about: 'Senior software engineer at Google. Passionate about technology and music.' },
  { first_name: 'Saurabh', last_name: 'Pandey', dob: '1993-01-30', height: 172, education: 'masters', occupation: 'Business Analyst', income: '10l_20l', city: 'Mumbai', state: 'Maharashtra', gotra: 'Sandilya', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'eggetarian', manglik: 'no', about: 'MBA from IIM Ahmedabad. Working in consulting. Enjoy cricket and hiking.' },
  { first_name: 'Ankit', last_name: 'Kumar', dob: '1997-05-12', height: 176, education: 'bachelors', occupation: 'Entrepreneur', income: '50l_1cr', city: 'Delhi', state: 'Delhi', gotra: 'Kaushik', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'Running my own e-commerce startup. Believe in hard work and family values.' },
  { first_name: 'Prashant', last_name: 'Singh', dob: '1992-09-18', height: 182, education: 'masters', occupation: 'Civil Servant', income: '10l_20l', city: 'Darbhanga', state: 'Bihar', gotra: 'Parashar', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'anshik', about: 'IAS officer posted in Bihar. Deeply connected to Maithil culture and traditions.' },
  { first_name: 'Nikhil', last_name: 'Chaudhary', dob: '1996-12-25', height: 170, education: 'masters', occupation: 'Data Scientist', income: '20l_50l', city: 'Pune', state: 'Maharashtra', gotra: 'Gautam', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'non_vegetarian', manglik: 'no', about: 'Data scientist at Microsoft. Love playing tabla and classical music.' },
  { first_name: 'Amit', last_name: 'Ranjan', dob: '1994-04-05', height: 174, education: 'bachelors', occupation: 'Chartered Accountant', income: '10l_20l', city: 'Kolkata', state: 'West Bengal', gotra: 'Atri', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'CA working at Deloitte. Enjoy painting and photography in free time.' },
  { first_name: 'Deepak', last_name: 'Ojha', dob: '1995-08-14', height: 179, education: 'masters', occupation: 'Investment Banker', income: '50l_1cr', city: 'Mumbai', state: 'Maharashtra', gotra: 'Vishwamitra', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'Working in investment banking at JP Morgan. Fitness enthusiast and avid reader.' },
  { first_name: 'Manish', last_name: 'Tiwari', dob: '1993-06-20', height: 168, education: 'doctorate', occupation: 'Professor', income: '10l_20l', city: 'Varanasi', state: 'Uttar Pradesh', gotra: 'Jamadagni', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegan', manglik: 'dont_know', about: 'Assistant professor of Physics at BHU. Passionate about research and teaching.' },
];

const femaleProfiles = [
  { first_name: 'Ishika', last_name: 'Mishra', dob: '1998-02-14', height: 162, education: 'masters', occupation: 'Software Engineer', income: '10l_20l', city: 'Bangalore', state: 'Karnataka', gotra: 'Bharadwaj', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'M.Tech from IIT Delhi. Working at Amazon. Love dancing and cooking traditional food.' },
  { first_name: 'Priyanka', last_name: 'Jha', dob: '1999-06-30', height: 158, education: 'bachelors', occupation: 'Chartered Accountant', income: '10l_20l', city: 'Saharsa', state: 'Bihar', gotra: 'Kashyap', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'CA working at EY. Deeply rooted in Maithil traditions. Love Madhubani painting.' },
  { first_name: 'Sneha', last_name: 'Pandey', dob: '1997-10-05', height: 160, education: 'masters', occupation: 'Doctor', income: '20l_50l', city: 'Delhi', state: 'Delhi', gotra: 'Vatsa', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'yes', about: 'MBBS MD from AIIMS. Pediatrician by profession. Enjoy reading and yoga.' },
  { first_name: 'Ananya', last_name: 'Singh', dob: '1998-04-18', height: 165, education: 'masters', occupation: 'Marketing Manager', income: '10l_20l', city: 'Mumbai', state: 'Maharashtra', gotra: 'Sandilya', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'eggetarian', manglik: 'no', about: 'MBA from ISB. Working in digital marketing. Creative and family-oriented.' },
  { first_name: 'Ritu', last_name: 'Thakur', dob: '1996-08-22', height: 155, education: 'masters', occupation: 'Teacher', income: '5l_10l', city: 'Madhubani', state: 'Bihar', gotra: 'Kaushik', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'M.Ed, teaching at a reputed school. Passionate about education and Maithili literature.' },
  { first_name: 'Kavita', last_name: 'Kumar', dob: '1997-12-10', height: 163, education: 'bachelors', occupation: 'Fashion Designer', income: '5l_10l', city: 'Patna', state: 'Bihar', gotra: 'Parashar', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'anshik', about: 'Fashion designer specializing in traditional Maithili bridal wear. Creative soul.' },
  { first_name: 'Megha', last_name: 'Ranjan', dob: '1999-03-08', height: 157, education: 'masters', occupation: 'Data Analyst', income: '10l_20l', city: 'Hyderabad', state: 'Telangana', gotra: 'Gautam', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'MS in Data Science. Working at Infosys. Love traveling and photography.' },
  { first_name: 'Pooja', last_name: 'Ojha', dob: '1998-07-25', height: 161, education: 'masters', occupation: 'Architect', income: '10l_20l', city: 'Pune', state: 'Maharashtra', gotra: 'Atri', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'no', about: 'M.Arch from SPA Delhi. Working at a leading architecture firm. Love sketching.' },
  { first_name: 'Swati', last_name: 'Chaudhary', dob: '1997-01-15', height: 159, education: 'masters', occupation: 'Lawyer', income: '10l_20l', city: 'Delhi', state: 'Delhi', gotra: 'Vishwamitra', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'non_vegetarian', manglik: 'no', about: 'LLM from NLU. Practicing corporate law. Enjoy classical music and writing.' },
  { first_name: 'Nidhi', last_name: 'Tiwari', dob: '1998-11-02', height: 164, education: 'bachelors', occupation: 'Banker', income: '5l_10l', city: 'Kolkata', state: 'West Bengal', gotra: 'Jamadagni', caste: 'Maithil Brahmin', mother_tongue: 'Maithili', diet: 'vegetarian', manglik: 'dont_know', about: 'Working at SBI. Simple and traditional. Love cooking and gardening.' },
];

async function seed() {
  await dataSource.initialize();
  console.log('Connected to database');

  const passwordHash = await bcrypt.hash('Test@1234', 10);

  for (let i = 0; i < maleProfiles.length; i++) {
    const p = maleProfiles[i];
    const userId = uuidv4();
    const email = `${p.first_name.toLowerCase()}.${p.last_name.toLowerCase()}@test.com`;
    const phone = `+9190000${String(10 + i).padStart(5, '0')}`;

    await dataSource.query(
      `INSERT INTO users (id, email, phone, password_hash, profile_for, created_by, email_verified, phone_verified, account_status, onboarding_completed, profile_completion_percentage, onboarding_step)
       VALUES ($1, $2, $3, $4, 'self', 'self', true, true, 'active', true, 100, 24)
       ON CONFLICT (email) DO NOTHING`,
      [userId, email, phone, passwordHash],
    );

    // Get the actual user id (in case it already existed)
    const userRow = await dataSource.query(`SELECT id FROM users WHERE email = $1`, [email]);
    const actualUserId = userRow[0]?.id || userId;

    await dataSource.query(
      `INSERT INTO profiles (user_id, first_name, last_name, date_of_birth, gender, height_cm, marital_status, religion, caste, gotra, mother_tongue, manglik, highest_education, occupation, annual_income, country, state, city, diet, about_me, is_verified)
       VALUES ($1, $2, $3, $4, 'male', $5, 'never_married', 'hindu', $6, $7, $8, $9, $10, $11, $12, 'India', $13, $14, $15, $16, true)
       ON CONFLICT (user_id) DO UPDATE SET
         first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, date_of_birth = EXCLUDED.date_of_birth,
         gender = EXCLUDED.gender, height_cm = EXCLUDED.height_cm, religion = EXCLUDED.religion, caste = EXCLUDED.caste,
         gotra = EXCLUDED.gotra, mother_tongue = EXCLUDED.mother_tongue, manglik = EXCLUDED.manglik,
         highest_education = EXCLUDED.highest_education, occupation = EXCLUDED.occupation, annual_income = EXCLUDED.annual_income,
         state = EXCLUDED.state, city = EXCLUDED.city, diet = EXCLUDED.diet, about_me = EXCLUDED.about_me, is_verified = true`,
      [actualUserId, p.first_name, p.last_name, p.dob, p.height, p.caste, p.gotra, p.mother_tongue, p.manglik, p.education, p.occupation, p.income, p.state, p.city, p.diet, p.about],
    );

    // Add partner preferences
    await dataSource.query(
      `INSERT INTO partner_preferences (user_id, age_min, age_max, height_min_cm, height_max_cm, religion, caste, mother_tongue, diet, manglik)
       VALUES ($1, 22, 30, 150, 175, '{hindu}', '{Maithil Brahmin}', '{Maithili}', '{vegetarian,eggetarian}', $2)
       ON CONFLICT (user_id) DO UPDATE SET
         age_min = EXCLUDED.age_min, age_max = EXCLUDED.age_max, religion = EXCLUDED.religion, caste = EXCLUDED.caste`,
      [actualUserId, p.manglik === 'yes' ? 'yes' : 'dont_know'],
    );

    console.log(`  ✓ Male: ${p.first_name} ${p.last_name} (${email})`);
  }

  for (let i = 0; i < femaleProfiles.length; i++) {
    const p = femaleProfiles[i];
    const userId = uuidv4();
    const email = `${p.first_name.toLowerCase()}.${p.last_name.toLowerCase()}@test.com`;
    const phone = `+9191000${String(10 + i).padStart(5, '0')}`;

    await dataSource.query(
      `INSERT INTO users (id, email, phone, password_hash, profile_for, created_by, email_verified, phone_verified, account_status, onboarding_completed, profile_completion_percentage, onboarding_step)
       VALUES ($1, $2, $3, $4, 'self', 'self', true, true, 'active', true, 100, 24)
       ON CONFLICT (email) DO NOTHING`,
      [userId, email, phone, passwordHash],
    );

    const userRow = await dataSource.query(`SELECT id FROM users WHERE email = $1`, [email]);
    const actualUserId = userRow[0]?.id || userId;

    await dataSource.query(
      `INSERT INTO profiles (user_id, first_name, last_name, date_of_birth, gender, height_cm, marital_status, religion, caste, gotra, mother_tongue, manglik, highest_education, occupation, annual_income, country, state, city, diet, about_me, is_verified)
       VALUES ($1, $2, $3, $4, 'female', $5, 'never_married', 'hindu', $6, $7, $8, $9, $10, $11, $12, 'India', $13, $14, $15, $16, true)
       ON CONFLICT (user_id) DO UPDATE SET
         first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, date_of_birth = EXCLUDED.date_of_birth,
         gender = EXCLUDED.gender, height_cm = EXCLUDED.height_cm, religion = EXCLUDED.religion, caste = EXCLUDED.caste,
         gotra = EXCLUDED.gotra, mother_tongue = EXCLUDED.mother_tongue, manglik = EXCLUDED.manglik,
         highest_education = EXCLUDED.highest_education, occupation = EXCLUDED.occupation, annual_income = EXCLUDED.annual_income,
         state = EXCLUDED.state, city = EXCLUDED.city, diet = EXCLUDED.diet, about_me = EXCLUDED.about_me, is_verified = true`,
      [actualUserId, p.first_name, p.last_name, p.dob, p.height, p.caste, p.gotra, p.mother_tongue, p.manglik, p.education, p.occupation, p.income, p.state, p.city, p.diet, p.about],
    );

    await dataSource.query(
      `INSERT INTO partner_preferences (user_id, age_min, age_max, height_min_cm, height_max_cm, religion, caste, mother_tongue, diet, manglik)
       VALUES ($1, 25, 35, 165, 190, '{hindu}', '{Maithil Brahmin}', '{Maithili}', '{vegetarian,eggetarian}', $2)
       ON CONFLICT (user_id) DO UPDATE SET
         age_min = EXCLUDED.age_min, age_max = EXCLUDED.age_max, religion = EXCLUDED.religion, caste = EXCLUDED.caste`,
      [actualUserId, p.manglik === 'yes' ? 'yes' : 'dont_know'],
    );

    console.log(`  ✓ Female: ${p.first_name} ${p.last_name} (${email})`);
  }

  console.log('\n✅ Seeded 20 profiles (10 male, 10 female)');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
