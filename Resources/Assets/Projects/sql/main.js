// Application state
const appState = {
    currentUser: null,
    userType: null,
    equipIdArrayList: []
};

// Import and initialize the Database and Models
import { Database } from './database.js';
import { Custodian, Student, Instructor, Equipment } from './model.js';
const db = new Database('./data/');

// UI Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.card');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the requested section
    document.getElementById(sectionId).classList.remove('hidden');
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function exitSystem() {
    if (confirm('Are you sure you want to exit?')) {
        alert('Good bye, good day :)');
    }
}

function logout() {
    appState.currentUser = null;
    appState.userType = null;
    showSection('main-menu');
}

// Data Display Functions
async function showCustodians() {
    try {
        const custodians = await db.readCustodians();
        let html = '<table><thead><tr><th>Custodian ID</th><th>Custodian</th><th>Email</th></tr></thead><tbody>';
        
        custodians.forEach(custodian => {
            html += `<tr>
                <td>${custodian.custodianID}</td>
                <td>${custodian.getFullName()}</td>
                <td>${custodian.email}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        
        document.getElementById('data-title').textContent = 'All Custodians';
        document.getElementById('data-content').innerHTML = html;
        document.getElementById('data-display').classList.remove('hidden');
    } catch (error) {
        console.error('Error showing custodians:', error);
        alert('Error loading custodians data');
    }
}

async function showStudents() {
    try {
        const students = await db.readStudents();
        let html = '<table><thead><tr><th>Student ID</th><th>Student</th><th>Email</th></tr></thead><tbody>';
        
        students.forEach(student => {
            html += `<tr>
                <td>${student.studentID}</td>
                <td>${student.getFullName()}</td>
                <td>${student.email}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        
        document.getElementById('data-title').textContent = 'All Students';
        document.getElementById('data-content').innerHTML = html;
        document.getElementById('data-display').classList.remove('hidden');
    } catch (error) {
        console.error('Error showing students:', error);
        alert('Error loading students data');
    }
}

async function showInstructors() {
    try {
        const instructors = await db.readInstructors();
        let html = '<table><thead><tr><th>Instructor ID</th><th>Instructor</th><th>Email</th></tr></thead><tbody>';
        
        instructors.forEach(instructor => {
            html += `<tr>
                <td>${instructor.instructorID}</td>
                <td>${instructor.getFullName()}</td>
                <td>${instructor.email}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        
        document.getElementById('data-title').textContent = 'All Instructors';
        document.getElementById('data-content').innerHTML = html;
        document.getElementById('data-display').classList.remove('hidden');
    } catch (error) {
        console.error('Error showing instructors:', error);
        alert('Error loading instructors data');
    }
}

async function showEquipment() {
    try {
        const equipment = await db.readEquipment();
        let html = '<table><thead><tr><th>Equipment ID</th><th>Equipment</th><th>Status</th></tr></thead><tbody>';
        
        equipment.forEach(item => {
            let statusClass = '';
            if (item.status === 'waiting') statusClass = 'status-waiting';
            else if (item.status === 'approved') statusClass = 'status-approved';
            else if (item.status === 'denied') statusClass = 'status-denied';
            else if (item.status === 'borrowed') statusClass = 'status-borrowed';
            else if (item.status === 'good') statusClass = 'status-good';
            
            html += `<tr>
                <td>${item.equipmentID}</td>
                <td>${item.equipmentName}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        
        document.getElementById('data-title').textContent = 'All Equipment';
        document.getElementById('data-content').innerHTML = html;
        document.getElementById('data-display').classList.remove('hidden');
    } catch (error) {
        console.error('Error showing equipment:', error);
        alert('Error loading equipment data');
    }
}

function hideDataDisplay() {
    document.getElementById('data-display').classList.add('hidden');
}

// Registration Functions
document.getElementById('register-custodian-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('custodian-id').value);
    const firstName = document.getElementById('custodian-firstname').value;
    const lastName = document.getElementById('custodian-lastname').value;
    const email = document.getElementById('custodian-email').value;
    const password = document.getElementById('custodian-password').value;
    
    const custodian = new Custodian(id, firstName, lastName, email, password);
    
    try {
        await db.createCustodian(custodian);
        alert('Custodian registered successfully!');
        closeModal('register-custodian-modal');
        this.reset();
    } catch (error) {
        console.error('Error creating custodian:', error);
        alert('Error registering custodian');
    }
});

// Student Registration
document.getElementById('register-student-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('student-id').value);
    const firstName = document.getElementById('student-firstname').value;
    const lastName = document.getElementById('student-lastname').value;
    const email = document.getElementById('student-email').value;
    const password = document.getElementById('student-password').value;
    
    const student = new Student(id, firstName, lastName, email, password);
    
    try {
        await db.createStudent(student);
        alert('Student registered successfully!');
        closeModal('register-student-modal');
        this.reset();
    } catch (error) {
        console.error('Error creating student:', error);
        alert('Error registering student');
    }
});

// Instructor Registration
document.getElementById('register-instructor-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('instructor-id').value);
    const firstName = document.getElementById('instructor-firstname').value;
    const lastName = document.getElementById('instructor-lastname').value;
    const email = document.getElementById('instructor-email').value;
    const password = document.getElementById('instructor-password').value;
    
    const instructor = new Instructor(id, firstName, lastName, email, password);
    
    try {
        await db.createInstructor(instructor);
        alert('Instructor registered successfully!');
        closeModal('register-instructor-modal');
        this.reset();
    } catch (error) {
        console.error('Error creating instructor:', error);
        alert('Error registering instructor');
    }
});

// Login Functions
document.getElementById('login-custodian-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-custodian-email').value;
    const password = document.getElementById('login-custodian-password').value;
    
    try {
        const custodians = await db.readCustodians();
        const custodian = custodians.find(c => c.email === email && c.password === password);
        
        if (custodian) {
            appState.currentUser = custodian;
            appState.userType = 'custodian';
            showSection('custodian-dashboard');
            closeModal('login-custodian-modal');
            this.reset();
        } else {
            document.getElementById('login-custodian-error').textContent = 'Email and/or password does not match.';
            document.getElementById('login-custodian-error').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error during custodian login:', error);
        alert('Error during login');
    }
});

// Student Login
document.getElementById('login-student-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-student-email').value;
    const password = document.getElementById('login-student-password').value;
    
    try {
        const students = await db.readStudents();
        const student = students.find(s => s.email === email && s.password === password);
        
        if (student) {
            appState.currentUser = student;
            appState.userType = 'student';
            showSection('student-dashboard');
            closeModal('login-student-modal');
            this.reset();
        } else {
            document.getElementById('login-student-error').textContent = 'Email and/or password does not match.';
            document.getElementById('login-student-error').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error during student login:', error);
        alert('Error during login');
    }
});

// Instructor Login
document.getElementById('login-instructor-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-instructor-email').value;
    const password = document.getElementById('login-instructor-password').value;
    
    try {
        const instructors = await db.readInstructors();
        const instructor = instructors.find(i => i.email === email && i.password === password);
        
        if (instructor) {
            appState.currentUser = instructor;
            appState.userType = 'instructor';
            showSection('instructor-dashboard');
            closeModal('login-instructor-modal');
            this.reset();
        } else {
            document.getElementById('login-instructor-error').textContent = 'Email and/or password does not match.';
            document.getElementById('login-instructor-error').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error during instructor login:', error);
        alert('Error during login');
    }
});

// Update Account Functions
document.getElementById('update-custodian-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('update-custodian-firstname').value;
    const lastName = document.getElementById('update-custodian-lastname').value;
    const email = document.getElementById('update-custodian-email').value;
    const password = document.getElementById('update-custodian-password').value;
    
    const updatedCustodian = new Custodian(
        appState.currentUser.custodianID,
        firstName,
        lastName,
        email,
        password
    );
    
    try {
        await db.updateCustodian(appState.currentUser.custodianID, updatedCustodian);
        appState.currentUser = updatedCustodian;
        alert('Custodian updated successfully!');
        closeModal('update-custodian-modal');
        this.reset();
    } catch (error) {
        console.error('Error updating custodian:', error);
        alert('Error updating custodian');
    }
});

// Update Student Account
document.getElementById('update-student-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('update-student-firstname').value;
    const lastName = document.getElementById('update-student-lastname').value;
    const email = document.getElementById('update-student-email').value;
    const password = document.getElementById('update-student-password').value;
    
    const updatedStudent = new Student(
        appState.currentUser.studentID,
        firstName,
        lastName,
        email,
        password
    );
    
    try {
        await db.updateStudent(appState.currentUser.studentID, updatedStudent);
        appState.currentUser = updatedStudent;
        alert('Student updated successfully!');
        closeModal('update-student-modal');
        this.reset();
    } catch (error) {
        console.error('Error updating student:', error);
        alert('Error updating student');
    }
});

// Update Instructor Account
document.getElementById('update-instructor-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('update-instructor-firstname').value;
    const lastName = document.getElementById('update-instructor-lastname').value;
    const email = document.getElementById('update-instructor-email').value;
    const password = document.getElementById('update-instructor-password').value;
    
    const updatedInstructor = new Instructor(
        appState.currentUser.instructorID,
        firstName,
        lastName,
        email,
        password
    );
    
    try {
        await db.updateInstructor(appState.currentUser.instructorID, updatedInstructor);
        appState.currentUser = updatedInstructor;
        alert('Instructor updated successfully!');
        closeModal('update-instructor-modal');
        this.reset();
    } catch (error) {
        console.error('Error updating instructor:', error);
        alert('Error updating instructor');
    }
});

// Equipment Management Functions
document.getElementById('add-equipment-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('equipment-id').value);
    const name = document.getElementById('equipment-name').value;
    const status = document.getElementById('equipment-status').value;
    
    const equipment = new Equipment(id, name, status);
    
    try {
        await db.createEquipment(equipment);
        alert('Equipment added successfully!');
        closeModal('add-equipment-modal');
        this.reset();
    } catch (error) {
        console.error('Error adding equipment:', error);
        alert('Error adding equipment');
    }
});

// Delete Current User
async function deleteCurrentUser(userType) {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            if (userType === 'custodian') {
                await db.deleteCustodian(appState.currentUser.custodianID);
            } else if (userType === 'student') {
                await db.deleteStudent(appState.currentUser.studentID);
            } else if (userType === 'instructor') {
                await db.deleteInstructor(appState.currentUser.instructorID);
            }
            
            alert('Account deleted successfully!');
            logout();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showSection('main-menu');
    
    // Add event listeners for all modals
    setupModalEventListeners();
});

function setupModalEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
    
    // Add equipment update form handler
    document.getElementById('update-equipment-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('update-equipment-id').value);
        const name = document.getElementById('update-equipment-name').value;
        const status = document.getElementById('update-equipment-status').value;
        
        const equipment = new Equipment(id, name, status);
        
        try {
            await db.updateEquipment(id, equipment);
            alert('Equipment updated successfully!');
            closeModal('update-equipment-modal');
            this.reset();
        } catch (error) {
            console.error('Error updating equipment:', error);
            alert('Error updating equipment');
        }
    });
    
    // Add equipment delete handler
    document.getElementById('delete-equipment-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('delete-equipment-id').value);
        
        try {
            await db.deleteEquipment(id);
            alert('Equipment deleted successfully!');
            closeModal('delete-equipment-modal');
            this.reset();
        } catch (error) {
            console.error('Error deleting equipment:', error);
            alert('Error deleting equipment');
        }
    });
}

// Borrow Equipment Functionality
async function addEquipmentToBorrow() {
    try {
        const equipment = await db.readEquipment();
        const availableEquipment = equipment.filter(e => e.status === 'good');
        
        let html = '<select id="borrow-equipment-select">';
        availableEquipment.forEach(item => {
            html += `<option value="${item.equipmentID}">${item.equipmentName} (ID: ${item.equipmentID})</option>`;
        });
        html += '</select>';
        
        document.getElementById('borrow-equipment-list').innerHTML = html;
    } catch (error) {
        console.error('Error loading equipment for borrowing:', error);
        alert('Error loading equipment');
    }
}

document.getElementById('borrow-equipment-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const equipmentId = parseInt(document.getElementById('borrow-equipment-select').value);
    
    try {
        const equipment = await db.readEquipment();
        const selectedEquipment = equipment.find(e => e.equipmentID === equipmentId);
        
        if (selectedEquipment && selectedEquipment.status === 'good') {
            appState.equipIdArrayList.push(equipmentId);
            alert('Equipment added to borrow list!');
            this.reset();
        } else {
            alert('Equipment is not available for borrowing.');
        }
    } catch (error) {
        console.error('Error adding equipment to borrow list:', error);
        alert('Error adding equipment to borrow list');
    }
});

// Request Management Functions
async function showRequests() {
    try {
        // This would need to be implemented in your Database class
        // For now, we'll simulate it
        const requests = []; // This should come from db.getRequests() or similar
        
        if (requests.length === 0) {
            document.getElementById('data-title').textContent = 'Borrow Requests';
            document.getElementById('data-content').innerHTML = '<p>No requests found.</p>';
            document.getElementById('data-display').classList.remove('hidden');
            return;
        }
        
        let html = '<table><thead><tr><th>Request ID</th><th>Student</th><th>Equipment</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
        
        requests.forEach(request => {
            let statusClass = '';
            if (request.status === 'waiting') statusClass = 'status-waiting';
            else if (request.status === 'approved') statusClass = 'status-approved';
            else if (request.status === 'denied') statusClass = 'status-denied';
            
            html += `<tr>
                <td>${request.id}</td>
                <td>${request.studentName}</td>
                <td>${request.equipmentName}</td>
                <td><span class="status-badge ${statusClass}">${request.status}</span></td>
                <td>
                    ${request.status === 'waiting' ? 
                        `<button onclick="approveRequest(${request.id})" class="success">Approve</button>
                         <button onclick="denyRequest(${request.id})" class="danger">Deny</button>` : 
                        'No actions available'
                    }
                </td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        
        document.getElementById('data-title').textContent = 'Borrow Requests';
        document.getElementById('data-content').innerHTML = html;
        document.getElementById('data-display').classList.remove('hidden');
    } catch (error) {
        console.error('Error showing requests:', error);
        alert('Error loading requests');
    }
}

// Approve/Deny Request Functions (to be implemented based on your Database class)
async function approveRequest(requestId) {
    try {
        // await db.approveRequest(requestId, appState.currentUser.custodianID);
        alert(`Request ${requestId} approved!`);
        showRequests(); // Refresh the list
    } catch (error) {
        console.error('Error approving request:', error);
        alert('Error approving request');
    }
}

async function denyRequest(requestId) {
    try {
        // await db.denyRequest(requestId, appState.currentUser.custodianID);
        alert(`Request ${requestId} denied!`);
        showRequests(); // Refresh the list
    } catch (error) {
        console.error('Error denying request:', error);
        alert('Error denying request');
    }
}

// Make functions globally available for HTML onclick handlers
window.showSection = showSection;
window.showModal = showModal;
window.closeModal = closeModal;
window.exitSystem = exitSystem;
window.logout = logout;
window.showCustodians = showCustodians;
window.showStudents = showStudents;
window.showInstructors = showInstructors;
window.showEquipment = showEquipment;
window.hideDataDisplay = hideDataDisplay;
window.deleteCurrentUser = deleteCurrentUser;
window.addEquipmentToBorrow = addEquipmentToBorrow;
window.showRequests = showRequests;
window.approveRequest = approveRequest;
window.denyRequest = denyRequest;