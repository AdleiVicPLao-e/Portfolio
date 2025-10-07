import { Custodian, Student, Instructor, Equipment } from './model.js';

export class Database {
  constructor(basePath = './data/') {
    this.basePath = basePath.endsWith('/') ? basePath : basePath + '/';
  }

  // --- Generic fetch helper ---
  async fetchData(fileName) {
    const response = await fetch(`${this.basePath}${fileName}`);
    if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);
    return await response.json();
  }

  // --- Custodian Methods ---
  async readCustodians() {
    const data = await this.fetchData('custodian.json');
    return data.map(c => {
      const [last, first] = c.cust_name.split(', ');
      return new Custodian(c.cust_id, first, last, c.cust_email, c.cust_pwd);
    });
  }

  async createCustodian(custodian) {
    const custodians = await this.readCustodians();
    custodians.push(custodian);
    console.log('Custodian added (simulated):', custodian);
    // In GitHub Pages, we cannot actually save — this simulates DB write
  }

  async updateCustodian(id, updatedCustodian) {
    let custodians = await this.readCustodians();
    custodians = custodians.map(c =>
      c.custodianID === id ? updatedCustodian : c
    );
    console.log(`Custodian ${id} updated (simulated).`);
  }

  async deleteCustodian(id) {
    let custodians = await this.readCustodians();
    custodians = custodians.filter(c => c.custodianID !== id);
    console.log(`Custodian ${id} deleted (simulated).`);
  }

  // --- Student Methods ---
  async readStudents() {
    const data = await this.fetchData('student.json');
    return data.map(s => {
      const [last, first] = s.stud_name.split(', ');
      return new Student(s.stud_id, first, last, s.stud_email, s.stud_pwd);
    });
  }

  async createStudent(student) {
    const students = await this.readStudents();
    students.push(student);
    console.log('Student added (simulated):', student);
  }

  async updateStudent(id, updatedStudent) {
    let students = await this.readStudents();
    students = students.map(s =>
      s.studentID === id ? updatedStudent : s
    );
    console.log(`Student ${id} updated (simulated).`);
  }

  async deleteStudent(id) {
    let students = await this.readStudents();
    students = students.filter(s => s.studentID !== id);
    console.log(`Student ${id} deleted (simulated).`);
  }

  // --- Instructor Methods ---
  async readInstructors() {
    const data = await this.fetchData('instructor.json');
    return data.map(i => {
      const [last, first] = i.inst_name.split(', ');
      return new Instructor(i.inst_id, first, last, i.inst_email, i.inst_pwd);
    });
  }

  async createInstructor(instructor) {
    const instructors = await this.readInstructors();
    instructors.push(instructor);
    console.log('Instructor added (simulated):', instructor);
  }

  async updateInstructor(id, updatedInstructor) {
    let instructors = await this.readInstructors();
    instructors = instructors.map(i =>
      i.instructorID === id ? updatedInstructor : i
    );
    console.log(`Instructor ${id} updated (simulated).`);
  }

  async deleteInstructor(id) {
    let instructors = await this.readInstructors();
    instructors = instructors.filter(i => i.instructorID !== id);
    console.log(`Instructor ${id} deleted (simulated).`);
  }

  // --- Equipment Methods ---
  async readEquipment() {
    const data = await this.fetchData('equipment.json');
    return data.map(e => new Equipment(e.equip_id, e.equip_name, e.equip_status));
  }

  async createEquipment(equipment) {
    const equipmentList = await this.readEquipment();
    equipmentList.push(equipment);
    console.log('Equipment added (simulated):', equipment);
  }

  async updateEquipment(id, updatedEquipment) {
    let equipmentList = await this.readEquipment();
    equipmentList = equipmentList.map(e =>
      e.equipmentID === id ? updatedEquipment : e
    );
    console.log(`Equipment ${id} updated (simulated).`);
  }

  async deleteEquipment(id) {
    let equipmentList = await this.readEquipment();
    equipmentList = equipmentList.filter(e => e.equipmentID !== id);
    console.log(`Equipment ${id} deleted (simulated).`);
  }
}
