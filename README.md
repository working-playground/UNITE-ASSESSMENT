UNITE Backend Assessment - Setup & Run Guide

1. Project Structure

---

The project follows a clean modular structure:

- src/
  - routes/ → All HTTP route definitions
  - controller/ → Request handlers (no business logic)
  - service/ → Business logic
  - persistence/ → MySQL & MongoDB database access
  - models/ → Mongo schemas + MySQL interfaces
  - utils/ → S3 upload, multer, CSV helpers
  - common/ → DTOs, enums, error utilities
  - middlewares/ → Auth, validation, error handler
- lambda/ → CSV processing Lambda function
- docker-compose.yml
- README (this document)

2. Prerequisites

---

- Node.js 18+
- Docker Desktop
- MySQL & MongoDB (provided by docker-compose)
- AWS account (for S3 & Lambda)
- Postman or curl for API testing

3. Environment Variables

---

Create a `.env` file with:

PORT=3000
JWT_SECRET=changeme
JWT_EXPIRES_IN=1h

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=unite_user
MYSQL_PASSWORD=unite_password
MYSQL_DB=unite_db

MONGO_URI=mongodb://localhost:27017/unite_db

AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-bucket
S3_CSV_PREFIX=csv
S3_IMAGE_PREFIX=images

NOTIFICATIONS_ENABLED=false

4. Running the Application (Local)

---

1. Start Docker services:
   docker compose up -d

2. Install dependencies:
   npm install

3. Start the server:
   npm run dev
   App runs at http://localhost:3000

4. Docker Compose Services

---

docker-compose.yml includes:

- MySQL 8 database
- MongoDB 6 database
  App connects automatically using .env values.

To start:
docker compose up -d

To stop:
docker compose down

6. AWS Lambda & S3 CSV Flow

---

1. API uploads CSV → S3
2. S3 triggers Lambda
3. Lambda:
   - Downloads CSV
   - Parses rows
   - Upserts leads into MySQL

Lambda requires environment variables:
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, AWS_REGION

7. Deployment Overview

---

- Build TypeScript:
  npm run build

- Create Docker image for production
- Deploy image on EC2 or DigitalOcean Droplet
- Use same .env variables on the server
- Use S3 bucket for media + CSV

8. Testing the API

---

Use curl or Postman:

1. Register:
   POST /user/register

2. Login:
   POST /user/login → returns JWT

3. Create Lead:
   POST /lead

4. Upload Lead Image:
   POST /lead/:id/image (multipart/form-data)

5. Import CSV:
   POST /lead/import/csv (multipart/form-data)

6. Reporting:
   GET /report/daily-summary?date=<epoch>
   GET /report/agent-performance

====================================================================================
9. Testing & Coverage

This project includes a minimal but meaningful test setup using Jest + ts-jest.
The focus of the tests is the service layer, since that is where most of the business logic lives.

### How to run all tests
npm test

### Run with coverage enabled
npm run test:coverage


## AWS Integrations (S3 + Lambda + RDS)

This project includes optional AWS integrations to demonstrate cloud workflow capability.

1. Amazon S3 (Image Upload + CSV Upload)

A private S3 bucket was created:

Bucket Name: test-assessments-test

Region: ap-south-1 (Mumbai)

This bucket is used for:

Lead image uploads

CSV file uploads for lead import

The backend uses the official AWS SDK v3 client to upload images and CSV files.

2. AWS Lambda (Automatic CSV Processing)

A Lambda function named:unite-leads-csv-processor
was created to automatically process any CSV file uploaded to S3.
