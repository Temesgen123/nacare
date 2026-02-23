# Nacare Clinic Management System

A comprehensive web-based clinic management system built with Next.js, MongoDB, and Tailwind CSS.

## Features

### 📋 Patient Management
- **Complete Patient Registration** with 4 comprehensive sections:
  - Section 1A: Patient Identification (ID, Name, Sex, DOB, Age, Phone, Address, Emergency Contact)
  - Section 1B: Past Medical History (Hypertension, Diabetes, Heart Disease, etc.)
  - Section 1C: Medication History (Current medications, adherence, allergies)
  - Section 1D: Social History (Smoking, alcohol use, physical activity)
  - Section 4: Patient Consent & Data Use

- **Patient Search & Management**
  - Search by patient ID, name, or phone number
  - View, edit, and delete patient records
  - Pagination support

### 🏥 Home Visit Management
- Record physical examinations from home visits
- Vital signs tracking (BP, pulse, blood sugar, weight)
- General examination findings
- System review (cardiovascular, respiratory, abdomen, CNS)

### 🧪 Laboratory Results
- Lab test requests tracking
- Results documentation
- Doctor review and assessment
- Follow-up planning

### 🔐 Authentication & Authorization
- Role-based access control (Admin, Doctor, Nurse, Staff)
- Secure JWT-based authentication
- Protected routes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## Installation & Setup

### 1. Clone or Download the Project

```bash
cd nacare-clinic
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Update the `.env.local` file with your MongoDB connection string:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/nacare?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string for production)
JWT_SECRET=your-secret-key-here-change-in-production

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important MongoDB Setup Steps:**

1. **Go to MongoDB Atlas** (https://cloud.mongodb.com/)
2. **Network Access**: 
   - Click "Network Access" in the left sidebar
   - Click "+ ADD IP ADDRESS"
   - Choose "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) for development
   - Or add your specific IP address
3. **Database Access**:
   - Click "Database Access"
   - Create a database user with username and password
   - Give it "Read and write to any database" privileges
4. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your credentials

### 4. Seed the Database

Create the initial admin user and sample staff accounts:

```bash
node scripts/seed.js
```

This will create:
- **admin** / **admin123** (Administrator)
- **doctor1** / **doctor123** (Doctor)
- **nurse1** / **nurse123** (Nurse)
- **staff1** / **staff123** (Staff)

⚠️ **IMPORTANT**: Change the admin password after first login!

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### 6. Login

Navigate to http://localhost:3000 and login with:
- Username: **admin**
- Password: **admin123**

## Project Structure

```
nacare-clinic/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── patients/          # Patient CRUD operations
│   │   ├── visits/            # Visit management
│   │   └── lab-results/       # Lab results management
│   ├── dashboard/             # Dashboard pages
│   │   ├── patients/          # Patient management pages
│   │   ├── visits/            # Visit management pages
│   │   └── lab-results/       # Lab results pages
│   ├── login/                 # Login page
│   ├── layout.js              # Root layout
│   ├── page.js                # Home page (redirects)
│   └── globals.css            # Global styles
├── components/
│   ├── forms/                 # Form components
│   │   ├── PatientForm.jsx    # Complete patient registration form
│   │   ├── VisitForm.jsx      # Visit recording form
│   │   └── LabResultForm.jsx  # Lab results form
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Textarea.jsx
│   │   └── Checkbox.jsx
│   └── Navbar.jsx             # Navigation component
├── lib/
│   ├── mongodb.js             # MongoDB connection
│   └── auth.js                # Authentication utilities
├── models/
│   ├── Patient.js             # Patient schema
│   ├── Visit.js               # Visit schema
│   ├── LabResult.js           # Lab result schema
│   └── User.js                # User schema
├── scripts/
│   └── seed.js                # Database seeding script
├── .env.local                 # Environment variables
├── package.json
└── README.md
```

## Usage Guide

### Registering a New Patient

1. Go to **Dashboard** → **Patients** → **New Patient**
2. Fill in all 4 sections:
   - Patient Identification (required: name, sex, phone)
   - Past Medical History
   - Medication History
   - Social History
3. Check the consent checkbox (required)
4. Click **Register Patient**

### Recording a Home Visit

1. Go to **Dashboard** → **Visits**
2. Select a patient
3. Enter visit details, vital signs, and examination findings
4. Save the visit record

### Adding Lab Results

1. Go to **Dashboard** → **Lab Results**
2. Select a patient
3. Enter lab test details and results
4. Add doctor's review and assessment
5. Save the lab results

### Managing Users (Admin Only)

Admins can create new users with different roles:
- **Admin**: Full system access
- **Doctor**: Can review and assess
- **Nurse**: Can record visits
- **Staff**: Can register patients

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user (admin only)

### Patients
- `GET /api/patients` - List all patients (with search & pagination)
- `POST /api/patients` - Create new patient
- `GET /api/patients/[id]` - Get patient details
- `PUT /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient (admin only)

### Visits
- `GET /api/visits` - List all visits
- `POST /api/visits` - Create new visit
- `GET /api/visits/[id]` - Get visit details
- `PUT /api/visits/[id]` - Update visit

### Lab Results
- `GET /api/lab-results` - List all lab results
- `POST /api/lab-results` - Create new lab result
- `GET /api/lab-results/[id]` - Get lab result details
- `PUT /api/lab-results/[id]` - Update lab result

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected API routes
- Secure patient data storage
- Patient consent tracking

## Troubleshooting

### MongoDB Connection Timeout Error

If you get `querySrv ETIMEDOUT` error:

1. **Check Network Access in MongoDB Atlas**:
   - Make sure your IP is whitelisted
   - Or use 0.0.0.0/0 to allow all IPs (development only)

2. **Verify Connection String**:
   - Username and password are correct
   - Special characters in password are URL-encoded
   - Database name is specified

3. **Check Cluster Status**:
   - Free tier clusters auto-pause after inactivity
   - Make sure cluster is running (not paused)

### Can't Login

1. Make sure you ran the seed script: `node scripts/seed.js`
2. Check MongoDB connection is working
3. Verify credentials: admin / admin123

### Port Already in Use

If port 3000 is already in use:
```bash
npm run dev -- -p 3001
```

## Production Deployment

For production deployment:

1. **Update Environment Variables**:
   - Use a strong JWT_SECRET
   - Use production MongoDB connection string
   - Update NEXT_PUBLIC_APP_URL

2. **Build the Application**:
   ```bash
   npm run build
   ```

3. **Start Production Server**:
   ```bash
   npm start
   ```

4. **Security Checklist**:
   - Change default admin password
   - Restrict MongoDB network access to specific IPs
   - Enable HTTPS
   - Set up proper backup procedures
   - Implement rate limiting
   - Add monitoring and logging

## Support & Contributing

For issues or questions:
1. Check this README
2. Review the code comments
3. Check MongoDB Atlas connection settings

## License

This project is for Nacare Clinic internal use.

---

**Built with ❤️ for Nacare Clinic**
