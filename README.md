# Student Management Portal

A full-stack style client-side web application for managing student registration, academic evaluation, and results using HTML, CSS, JavaScript, and Local Storage.

---

## 🚀 Overview & Workflow

The application operates through the following pipeline:
1. **Student Registration**: Students submit personal details and marks across 5 subjects.
2. **Client-side Validation**: Validates mobile numbers (10 digits), pincode (6 digits), age limits, valid subject marks (0–100), and checks for duplicate registered emails.
3. **Automatic Calculations**:
   - Computes total marks (out of 500) and percentage (rounded to 2 decimal places).
   - Evaluates academic status (**PASS** if all subjects $\ge 40$, otherwise **FAIL**).
4. **Data Persistence**: Serializes student records into JSON and saves them to `localStorage`.
5. **ID Generation**: Assigns a unique, random 6-digit Student ID (e.g., `STU123456`) with a single-click clipboard copy feature.
6. **Dynamic Result Lookup**: Allows students to check and view their complete result card and subject-wise score table by entering their Student ID and course.

---

## 📁 Project Structure

```text
student portal/
├── index.html            # Landing / Home page
├── registration.html     # Registration & marks entry form
├── result.html           # Student result verification & lookup
├── script.js             # Core validation, calculations, storage & DOM logic
├── style.css             # Responsive styling & layout
└── README.md             # Project documentation
```

---

## 🛠️ Technologies Used

- **HTML5**: Semantic markup, forms, and input constraints.
- **CSS3**: Responsive flexbox and grid layouts, modern card UI, and status badges.
- **JavaScript (Vanilla JS)**:
  - Form validation with regular expressions.
  - Array functional methods (`reduce`, `every`, `map`, `some`, `find`).
  - Web Storage API (`localStorage`) with JSON serialization (`JSON.stringify`, `JSON.parse`).
  - Dynamic DOM generation and smooth scrolling.

---

## 💻 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Ankush212/full-stack-assignment-student-management-sys.git
   ```
2. Navigate to the project directory:
   ```bash
   cd "student portal"
   ```
3. Open `index.html` in your web browser, or launch using Live Server in VS Code.
