// --- Custodian Model ---
export class Custodian {
  constructor(custodianID, firstName, lastName, email, password) {
    this.custodianID = custodianID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  getFullName() {
    return `${this.lastName}, ${this.firstName}`;
  }
}

// --- Student Model ---
export class Student {
  constructor(studentID, firstName, lastName, email, password) {
    this.studentID = studentID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  getFullName() {
    return `${this.lastName}, ${this.firstName}`;
  }
}

// --- Instructor Model ---
export class Instructor {
  constructor(instructorID, firstName, lastName, email, password) {
    this.instructorID = instructorID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  getFullName() {
    return `${this.lastName}, ${this.firstName}`;
  }
}

// --- Equipment Model ---
export class Equipment {
  constructor(equipmentID, equipmentName, status) {
    this.equipmentID = equipmentID;
    this.equipmentName = equipmentName;
    this.status = status;
  }
}
