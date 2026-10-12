"use strict";

const STORAGE_KEY = "studentPortalStudents";

const SUBJECTS = [
    "Subject 1",
    "Subject 2",
    "Subject 3",
    "Subject 4",
    "Subject 5"
];

function getStudents() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        const students = data ? JSON.parse(data) : [];
        return Array.isArray(students) ? students : [];
    } catch (error) {
        return [];
    }
}

function saveStudents(students) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
        return true;
    } catch (error) {
        return false;
    }
}

function showMessage(element, message, type = "success") {
    element.textContent = message;
    element.style.padding = "12px";
    element.style.marginTop = "15px";
    element.style.borderRadius = "6px";
    element.style.lineHeight = "1.5";

    if (type === "error") {
        element.style.color = "#991b1b";
        element.style.backgroundColor = "#fee2e2";
    } else {
        element.style.color = "#166534";
        element.style.backgroundColor = "#dcfce7";
    }
}

function generateStudentId(students) {
    let id;

    do {
        id = "STU" + Math.floor(100000 + Math.random() * 900000);
    } while (students.some(student => student.id === id));

    return id;
}

function calculateResult(marks) {
    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const maxMarks = marks.length * 100;
    const percentage = (total / maxMarks) * 100;
    const status = marks.every(mark => mark >= 40) ? "PASS" : "FAIL";

    return {
        total,
        maxMarks,
        percentage: Number(percentage.toFixed(2)),
        status
    };
}

const registrationForm = document.getElementById("registration-form");

if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const message = document.getElementById("registration-message");

        const fullname = document.getElementById("fullname").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const email = document.getElementById("email").value.trim();
        const course = document.getElementById("course").value;
        const age = Number(document.getElementById("age").value);

        const genderInput = registrationForm.querySelector(
            'input[name="gender"]:checked'
        );

        const address = document.getElementById("address").value.trim();
        const city = document.getElementById("city").value.trim();
        const state = document.getElementById("state").value.trim();
        const pincode = document.getElementById("pincode").value.trim();

        if (!fullname || !email || !course || !address || !city || !state) {
            showMessage(message, "Please fill in all required details.", "error");
            return;
        }

        if (!/^\d{10}$/.test(mobile)) {
            showMessage(message, "Enter a valid 10-digit mobile number.", "error");
            return;
        }

        if (!Number.isInteger(age) || age < 10 || age > 100) {
            showMessage(message, "Age must be between 10 and 100.", "error");
            return;
        }

        if (!genderInput) {
            showMessage(message, "Please select your gender.", "error");
            return;
        }

        if (!/^\d{6}$/.test(pincode)) {
            showMessage(message, "Enter a valid 6-digit pincode.", "error");
            return;
        }

        const marks = [];

        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`subject${i}`);
            const value = input.value.trim();
            const mark = Number(value);

            if (
                value === "" ||
                !Number.isInteger(mark) ||
                mark < 0 ||
                mark > 100
            ) {
                showMessage(
                    message,
                    `Enter valid whole-number marks from 0 to 100 for Subject ${i}.`,
                    "error"
                );
                input.focus();
                return;
            }

            marks.push(mark);
        }

        const students = getStudents();

        const duplicateEmail = students.some(
            student => student.email.toLowerCase() === email.toLowerCase()
        );

        if (duplicateEmail) {
            showMessage(
                message,
                "This email address is already registered.",
                "error"
            );
            return;
        }

        const result = calculateResult(marks);

        const student = {
            id: generateStudentId(students),
            fullname,
            mobile,
            email,
            course,
            age,
            gender: genderInput.value,
            address,
            city,
            state,
            pincode,
            subjects: SUBJECTS.map((subject, index) => ({
                name: subject,
                marks: marks[index],
                maxMarks: 100
            })),
            total: result.total,
            maxMarks: result.maxMarks,
            percentage: result.percentage,
            status: result.status,
            registeredAt: new Date().toISOString()
        };

        students.push(student);

        if (!saveStudents(students)) {
            showMessage(
                message,
                "Unable to save data. Please check browser storage settings.",
                "error"
            );
            return;
        }

        registrationForm.reset();
        message.replaceChildren();

        const successText = document.createElement("p");
        successText.textContent = "Registration Successful!";

        const idHeading = document.createElement("h3");
        idHeading.textContent = "Your Student ID";
        idHeading.style.marginTop = "12px";

        const idValue = document.createElement("p");
        idValue.textContent = student.id;
        idValue.style.fontSize = "24px";
        idValue.style.fontWeight = "bold";
        idValue.style.margin = "10px 0";

        const resultText = document.createElement("p");
        resultText.textContent =
            `Total: ${student.total}/${student.maxMarks} | ` +
            `Percentage: ${student.percentage}% | Status: ${student.status}`;

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.className = "submit-btn";
        copyButton.style.marginTop = "10px";
        copyButton.textContent = "Copy Student ID";

        copyButton.addEventListener("click", async function () {
            try {
                await navigator.clipboard.writeText(student.id);
                copyButton.textContent = "Student ID Copied!";
            } catch (error) {
                idValue.textContent = student.id;
                showMessage(
                    message,
                    `Please copy your Student ID manually: ${student.id}`,
                    "error"
                );
            }
        });

        const resultLink = document.createElement("a");
        resultLink.href = "result.html";
        resultLink.textContent = "Check Result";
        resultLink.className = "btn";
        resultLink.style.marginTop = "15px";
        resultLink.style.display = "inline-block";

        message.append(
            successText,
            idHeading,
            idValue,
            resultText,
            copyButton,
            document.createElement("br"),
            resultLink
        );

        message.style.padding = "15px";
        message.style.marginTop = "15px";
        message.style.borderRadius = "6px";
        message.style.backgroundColor = "#dcfce7";
        message.style.color = "#166534";
    });
}

const resultForm = document.getElementById("result-form");

if (resultForm) {
    resultForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const message = document.getElementById("result-message");
        const output = document.getElementById("result-output");

        output.replaceChildren();
        message.textContent = "";

        const studentId = document.getElementById("student-id")
            .value.trim().toUpperCase();

        const course = document.getElementById("result-course").value;

        const students = getStudents();

        const student = students.find(
            item => item.id.toUpperCase() === studentId
        );

        if (!student) {
            showMessage(
                message,
                "Student ID not found. Please register first or check your ID.",
                "error"
            );
            return;
        }

        if (student.course !== course) {
            showMessage(
                message,
                "The selected course does not match the Student ID.",
                "error"
            );
            return;
        }

        displayResult(student, output);
    });
}

function displayResult(student, output) {
    const heading = document.createElement("h2");
    heading.textContent = "Student Academic Result";

    const details = document.createElement("div");
    details.className = "student-details";

    const detailItems = [
        ["Student Name", student.fullname],
        ["Student ID", student.id],
        ["Course", student.course],
        ["Email", student.email]
    ];

    detailItems.forEach(([label, value]) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = `${label}: ${value}`;
        details.appendChild(paragraph);
    });

    const table = document.createElement("table");
    table.className = "marks-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["Subject", "Marks Obtained", "Maximum Marks"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    const tbody = document.createElement("tbody");

    student.subjects.forEach(subject => {
        const row = document.createElement("tr");

        [subject.name, subject.marks, subject.maxMarks].forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.append(thead, tbody);

    const summary = document.createElement("div");
    summary.className = "result-summary";

    const total = document.createElement("p");
    total.textContent =
        `Total Marks: ${student.total}/${student.maxMarks}`;

    const percentage = document.createElement("p");
    percentage.textContent = `Percentage: ${student.percentage}%`;

    const status = document.createElement("p");
    status.textContent = `Result: ${student.status}`;
    status.className =
        student.status === "PASS" ? "pass-status" : "fail-status";

    summary.append(total, percentage, status);
    output.append(heading, details, table, summary);

    output.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}