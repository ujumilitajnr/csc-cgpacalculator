let semesterCount = 0;
let totalTCP = 0;
let totalTLU = 0;
let courseCount = 0;

const form = document.getElementById('cgpa-form');
const courseList = document.getElementById('course-list');
const addCourseBtn = document.getElementById('add-course-btn');
const gpaOutput = document.getElementById('gpa-output');
const cgpaOutput = document.getElementById('cgpa-output');
const cgpaTable = document.getElementById('cgpa-table').querySelector('tbody');
const noDataMessage = document.getElementById('no-data');
const errorMessage = document.getElementById('error-message');
const submittedCourseTable = document.getElementById('submitted-course-body');
const noCourseDataMessage = document.getElementById('no-course-data');

// Grade points based on the grading scale
const gradePoints = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'E': 1,
    'F': 0
};

// Initially add one course and hide the button until the first course is added
document.addEventListener('DOMContentLoaded', () => {
    addNewCourse();  // Add the first course automatically
});

// Function to add a new course input
function addNewCourse() {
    courseCount++;
    const courseRow = document.createElement('tr');
    courseRow.innerHTML = `
        <td><input type="text" class="course-name" placeholder="Enter course name" required></td>
        <td><input type="number" class="course-unit" min="1" max="5" required></td>
        <td>
            <select class="course-grade">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
            </select>
        </td>
    `;
    courseList.appendChild(courseRow);

    // After the first course is added, show the "Add Another Course" button
    if (courseCount === 1) {
        addCourseBtn.style.display = 'block';
    }
}

// Event listener to add more courses
addCourseBtn.addEventListener('click', function () {
    addNewCourse();
});

form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    errorMessage.textContent = '';

    const courseNames = document.querySelectorAll('.course-name');
    const courseUnits = document.querySelectorAll('.course-unit');
    const courseGrades = document.querySelectorAll('.course-grade');
    let currentTCP = 0;
    let currentTLU = 0;

    // Iterate over each course entry
    for (let i = 0; i < courseUnits.length; i++) {
        const courseName = courseNames[i].value.trim();
        const unit = parseFloat(courseUnits[i].value);
        const grade = courseGrades[i].value;

        // Check for empty course name or invalid unit value
        if (courseName === '' || unit < 1) {
            errorMessage.textContent = `Please enter a valid course name and unit for course ${i + 1}`;
            return;
        }

        // Add course data to the submitted courses table
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${courseName}</td>
            <td>${unit}</td>
            <td>${grade}</td>
        `;
        submittedCourseTable.appendChild(newRow);

        // Hide "No data" message if data is submitted
        noCourseDataMessage.style.display = 'none';

        // Calculate TCP and TLU
        const gradePoint = gradePoints[grade];
        currentTCP += unit * gradePoint;
        currentTLU += unit;
    }

    // Validate TLU (should be between 12 and 28)
    if (currentTLU < 12) {
        errorMessage.textContent = 'Total Load Units (TLU) must be at least 12.';
        return;
    }

    if (currentTLU > 28) {
        errorMessage.textContent = 'Total Load Units (TLU) cannot exceed 28.';
        return;
    }

    // Calculate GPA for the current semester
    const gpa = (currentTCP / currentTLU).toFixed(2);

    // Update cumulative TCP and TLU
    totalTCP += currentTCP;
    totalTLU += currentTLU;

    // Calculate CGPA
    const cgpa = (totalTCP / totalTLU).toFixed(2);

    // Update the table with new semester data
    semesterCount++;
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${semesterCount}</td>
        <td>${currentTCP}</td>
        <td>${currentTLU}</td>
        <td>${gpa}</td>
        <td>${cgpa}</td>
    `;
    cgpaTable.appendChild(newRow);

    // Remove "No data" message if present
    noDataMessage.style.display = 'none';

    // Display the calculated GPA and CGPA
    gpaOutput.textContent = gpa;
    cgpaOutput.textContent = cgpa;

    // Clear course list for next semester
    courseList.innerHTML = '';
    courseCount = 0;
    addCourseBtn.style.display = 'none'; // Hide button after clearing
    addNewCourse(); // Add the first course for the next semester
});
