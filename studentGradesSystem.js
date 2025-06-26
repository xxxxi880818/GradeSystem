var saveButton = document.getElementById('save-button'); 
var submitButton = document.getElementById('submit-data-btn');

var scoreCells = document.querySelectorAll('td[contenteditable="true"]:nth-child(n+3)'); // Select homework score cells
var unsubmittedCountSpan = document.getElementById('unsubmitted-count');
var averageSpan = document.getElementById('average');

var addStudentButton = document.getElementById('add-student-btn');
var addAssignmentButton = document.getElementById('add-assignment-btn');

var retrieveDataButton = document.getElementById('retrieve-data-btn');

var saveData = {}; 

saveButton.addEventListener('click', function() {
    var unsubmittedCount = checkForUnsubmittedScores(); // Check for unsubmitted homework count
    if (unsubmittedCount > 0) { // If there are unsubmitted assignments
        updateUnsubmitted(unsubmittedCount); // Update unsubmitted count and cell backgrounds
    } else { // If all assignments are submitted
        if (validateAllScores()) { // Validate all scores
            recalculateAverage();// Recalculate average
        }
    }
});

// Event listener for submit button
submitButton.addEventListener('click', function() {
        saveTableData();
        alert('Submitted!');
        resetTable();
    }
);

// Event listener for adding a new student row
addStudentButton.addEventListener('click', function() {
    addStudentRow();
});

// Event listener for adding a new assignment column
addAssignmentButton.addEventListener('click', function() {
    addAssignmentColumn();
});

// Event listener for retrieving data
retrieveDataButton.addEventListener('click', function() {
    console.log("Retrieve Data button clicked");
    restoreTableData();
});


function checkForUnsubmittedScores() {
    var unsubmittedCount = 0; // Initialize unsubmitted homework count to 0

    scoreCells.forEach(function(cell) {
        if (cell.textContent.trim() === '-') { // If cell content is "-"
            unsubmittedCount++; // Increment unsubmitted homework count
        }
    });

    return unsubmittedCount; // Return unsubmitted homework count
}

// Update unsubmitted count and cell backgrounds
function updateUnsubmitted(count) {
    unsubmittedCountSpan.textContent = count; // Update unsubmitted count display
    scoreCells.forEach(function(cell) {
        if (cell.textContent.trim() === '-') { // If cell content is "-"
            cell.style.backgroundColor = 'yellow'; // Set background color of unsubmitted homework cells to yellow
            alert("Please input the grade to the yellow table")
        } else {
            cell.style.backgroundColor = ''; // If assignment is submitted, reset background color
        }
    });
}

function validateAllScores() {
    var isValid = true;
    scoreCells.forEach(function(cell) {
        var score = parseFloat(cell.textContent.trim());
        if (isNaN(score) || score < 0 || score > 100) {
            cell.textContent = '-';
            isValid = false;
            alert(" Input number between 0-100");
        }
    });
    return isValid;
}


// Recalculate average
function recalculateAverage() {
    var total = 0;
    var count = 0;
    scoreCells.forEach(function(cell) {
        var score = parseFloat(cell.textContent.trim());
        if (!isNaN(score)) {
            total += score;
            count++;
        }
    });
    var average = total / count;
    if (isNaN(average)) {
        average = 0;
    }
    displayAverage(average);
    return average; // Return calculated average
}

// Display average
function displayAverage(average) {
    average = Math.round(average); // Round to nearest integer
    averageSpan.textContent = average + '%'; // Display rounded average
    if (average < 60) {
        averageSpan.style.color = 'white';
        averageSpan.style.backgroundColor = 'red';
    } else {
        averageSpan.style.color = ''; // Reset font color to default
        averageSpan.style.backgroundColor = ''; // Reset background color to default
    }
}

// Add new student row
function addStudentRow() {
    var tableBody = document.querySelector('table tbody');
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true">-</td>
        <td contenteditable="true">-</td>
        <td contenteditable="true">-</td>
        <td contenteditable="true">-</td>
        <td contenteditable="true">-</td>
        <td><span></span></td>
    `;
    tableBody.appendChild(newRow);
}

// Add new assignment column
function addAssignmentColumn() {
    var assignmentRow = document.querySelector('.secondHead'); // Get assignment row
    var assignmentCount = assignmentRow.querySelectorAll('th').length - 1; // Get current number of assignment columns
    var newAssignmentHeader = document.createElement('th');
    newAssignmentHeader.textContent = 'New Assignment';
    assignmentRow.insertBefore(newAssignmentHeader, assignmentRow.lastElementChild); // Insert new assignment column before the second last column
    
    // Update colspan attribute
    var colspanValue = 5 + assignmentCount+1; // Current columns + new assignment column + last column for average
    var firstHeadRow = document.querySelector('.firstHead'); // Get first head row
    var assignmentResultsCell = firstHeadRow.querySelector('th[colspan]'); // Find cell with colspan attribute
    assignmentResultsCell.colSpan = colspanValue; // Update colspan value

    // Insert new assignment column into each row
    var tableBodyRows = document.querySelectorAll('table tbody tr');
    tableBodyRows.forEach(function(row) {
        var newAssignmentCell = document.createElement('td');
        newAssignmentCell.contentEditable = true;
        newAssignmentCell.textContent = '-';
        var lastCell = row.lastElementChild; // Get last cell (average column)
        row.insertBefore(newAssignmentCell, lastCell); // Insert new assignment column before the average column
    });
}

function saveTableData() {
    var tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(function(row, rowIndex) {
        var rowData = [];
        row.querySelectorAll('td[contenteditable="true"]').forEach(function(cell) {
            rowData.push(cell.textContent.trim());
        });
        saveData['row_' + rowIndex] = rowData;
    });
    recalculateAverage(); // Recalculate average score and update display after saving data
}


function restoreTableData() {
    console.log("Restoring table data");
    var tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(function(row, rowIndex) {
        var rowData = saveData['row_' + rowIndex];
        if (rowData) {
            row.querySelectorAll('td[contenteditable="true"]').forEach(function(cell, cellIndex) {
                cell.textContent = rowData[cellIndex];
            });
        }
    });
    recalculateAverage(); // Recalculate average score after restoring data
}


// Function to reset the table to its initial state
function resetTable() {
    // Remove all rows except the first one
    var tableBody = document.querySelector('table tbody');
    var rows = tableBody.querySelectorAll('tr');
    for (var i = rows.length - 1; i > 0; i--) {
        tableBody.removeChild(rows[i]);
    }

    // Reset the content of student name and student ID cells
    var nameCells = document.querySelectorAll('table tbody td:nth-child(1)');
    var idCells = document.querySelectorAll('table tbody td:nth-child(2)');
    nameCells.forEach(function(cell) {
        cell.textContent = ''; // Clear name cell content
    });
    idCells.forEach(function(cell) {
        cell.textContent = ''; // Clear ID cell content
    });

    // Reset assignment score cells to initial values
    var scoreCells = document.querySelectorAll('td[contenteditable="true"]');
    scoreCells.forEach(function(cell) {
        cell.textContent = '-';
        cell.style.backgroundColor = ''; // Reset background color
    });

    // Reset unsubmitted homework count display
    document.getElementById('unsubmitted-count').textContent = '0';

    // Reset average display
    document.getElementById('average').textContent = '';
}

var gradeType = 'percent'; // Initial grade type is percentage
var originalAverages = {}; // Store original average scores

var averageHeader = document.querySelector('.firstHead th:last-child');

averageHeader.addEventListener('click', function() {
    toggleGradeType();
    updateAverageDisplay();
});

function toggleGradeType() {
    switch (gradeType) {
        case 'percent':
            saveOriginalAverages();
            gradeType = 'letter';
            break;
        case 'letter':
            //saveOriginalAverages();
            gradeType = 'gpa';
            break;
        case 'gpa':
            //saveOriginalAverages();
            gradeType = 'percent';
            break;
        default:
            gradeType = 'percent';
            break;
    }
}

function saveOriginalAverages() {
    // Get all student average score cells
    var averageCells = document.querySelectorAll('table tbody td:last-child span');

    // Save average scores under the current display type
    averageCells.forEach(function(cell, index) {
        originalAverages['row_' + index] = cell.textContent;
    });
}

function updateAverageDisplay() {
    // Get all student average score cells
    var averageCells = document.querySelectorAll('table tbody td:last-child span');

    // Update average score display in the table based on the grade type
    switch (gradeType) {
        case 'percent':
            // Update display to percentage
            averageCells.forEach(function(cell, index) {
                cell.textContent = originalAverages['row_' + index];
            });
            break;
        case 'letter':
            // Update display to letter grades
            averageCells.forEach(function(cell) {
                cell.textContent = calculateLetterGrade(parseFloat(cell.textContent));
            });
            break;
        case 'gpa':
            // Update display to GPA
            averageCells.forEach(function(cell) {
                cell.textContent = calculateGPA(parseFloat(cell.textContent));
            });
            break;
        default:
            // Default to percentage display
            averageCells.forEach(function(cell, index) {
                cell.textContent = originalAverages['row_' + index];
            });
            break;
    }
}

// Calculate letter grade
function calculateLetterGrade(average) {
    if (average >= 93) {
        return 'A';
    } else if (average >= 90) {
        return 'A-';
    } else if (average >= 87) {
        return 'B+';
    } else if (average >= 83) {
        return 'B';
    } else if (average >= 80) {
        return 'B-';
    } else if (average >= 77) {
        return 'C+';
    } else if (average >= 73) {
        return 'C';
    } else if (average >= 70) {
        return 'C-';
    } else if (average >= 67) {
        return 'D+';
    } else if (average >= 63) {
        return 'D';
    } else if (average >= 60) {
        return 'D-';
    } else {
        return 'F';
    }
}

function calculateGPA(average) {
    // Convert average to integer, multiplying by 10 to keep one decimal place
    var intAverage = Math.round(average * 10);

    if (intAverage >= 930) {
        return '4.0';
    } else if (intAverage >= 900) {
        return '3.7';
    } else if (intAverage >= 870) {
        return '3.3';
    } else if (intAverage >= 830) {
        return '3.0';
    } else if (intAverage >= 800) {
        return '2.7';
    } else if (intAverage >= 770) {
        return '2.3';
    } else if (intAverage >= 730) {
        return '2.0';
    } else if (intAverage >= 700) {
        return '1.7';
    } else if (intAverage >= 670) {
        return '1.3';
    } else if (intAverage >= 630) {
        return '1.0';
    } else if (intAverage >= 600) {
        return '0.7';
    } else {
        return '0.0';
    }
}
