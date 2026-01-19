# Authentication System Setup Guide(Project Setup)

### 1. Install Dependencies

```bash
npm install express mongoose mongodb bcrypt dotenv crypto
```

### 2. Database Connection

- Install and configure MongoDB also crate databse folder

  **Folder:** `database/`

- Create database connection file: `dbConnection.js`
- Use `mongoose.connect()`
- Export database connection function

### 3. Project Structure

Create the following folder structure:

```
project/
├── controllers/
│   ├── signinController.js

├── models/
│   └── User.js

├── helpers/
│   └── emailValidator.js
    |__

├── config/
│   └── dbConnection.js

├── routes/
│   └── index.js
    └── api/
    ├── index.js
    └── auth.js
```

## Implementation Steps

## 4. Route Structure

**Folder:** `routes/`
**Main Files:**

- `index.js` (main app entry)
- `api/index.js`
- `api/auth.js`

Purpose:

- Central API routing
- Authentication routes handled in `auth.js`

---

### 5. Controllers Setup

**Folder:** `controllers/`
Create:

- `signupController.js`

Like This `router.post("/signup", signupController);`

- `signinController.js` - Handle user login / registration

### 6.Create Models Folder

**Folder:** `models/`

- **File**: `models/UserSchems.js`
- Create Mongoose schema with fields:
  - `firstName` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required, hashed)

### 7. Validation

- **File**: `signupController.js`
- Implement input validation
- Validate required fields
- Validate email format
- Validate password

### 8. Email Validation Helper

**Folder:** `helpers/`

- **File**: `helpers/emailValidator.js`
- Create email validation using regex

### 9. Database Operations

- In `signupController.js`, send validated data to database

## Security Features

### 10. Password Hashing

```javascript
const bcrypt = require("bcrypt");

// Hash password before saving
const hashedPassword = await bcrypt.hash(password, 10);
// Store hash in your password DB
```

### 11. Duplicate Email Handling

- Use Mongoose/Langkit to prevent duplicate email registration
- Return appropriate error message
- Check if email already exists
- Return proper error message

### 12. Required Password Validation

- Ensure password field is required
- Add password strength requirements (optional)

## 13. OTP Generation

- Use Node.js `crypto`
- Generate OTP for verification

---

### 14. OTP Expiration

```javascript
const expireOtp = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
```

### 15. Email Service (NodeMailer)

- Install nodemailer
- Create controller for sending emails
- Configure email verification helpers

### 16. OTP Verification Controller
- Create `otpController.js`
- Verify OTP
- Check expiry
- Confirm user email

---

## Notes

- Always hash passwords before storing in database
- Use environment variables for sensitive configuration
- Implement proper error handling throughout
- Add rate limiting for authentication endpoints
- Consider adding refresh tokens for enhanced security
