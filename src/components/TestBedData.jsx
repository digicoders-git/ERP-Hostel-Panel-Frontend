import { useState, useEffect } from 'react';

const TestBedData = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const dummyStudents = [
      { 
        id: 1, 
        name: 'Rahul Sharma', 
        rollNumber: 'CS101', 
        class: '10th', 
        section: 'A',
        email: 'rahul@example.com', 
        contact: '9876543210',
        parentContact: '9876543211',
        gender: 'Male',
        dateOfBirth: '2008-05-15',
        address: '123, MG Road, Delhi',
        bloodGroup: 'O+',
        fatherName: 'Mr. Rajesh Sharma',
        motherName: 'Mrs. Sunita Sharma',
        emergencyContact: '9876543212',
        admissionDate: '2023-04-01',
        status: 'Active'
      },
      { 
        id: 2, 
        name: 'Priya Verma', 
        rollNumber: 'EC102', 
        class: '9th', 
        section: 'B',
        email: 'priya@example.com', 
        contact: '8765432109',
        parentContact: '8765432110',
        gender: 'Female',
        dateOfBirth: '2009-08-22',
        address: '456, Park Street, Mumbai',
        bloodGroup: 'A+',
        fatherName: 'Mr. Suresh Verma',
        motherName: 'Mrs. Kavita Verma',
        emergencyContact: '8765432111',
        admissionDate: '2023-04-05',
        status: 'Active'
      },
    ];

    setStudents(dummyStudents);
    console.log('Test Students Data:', dummyStudents);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Student Data</h1>
      {students.map(student => (
        <div key={student.id} className="bg-white p-6 rounded-lg shadow mb-4">
          <h2 className="text-xl font-bold mb-4">{student.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><strong>Roll:</strong> {student.rollNumber}</div>
            <div><strong>Class:</strong> {student.class}</div>
            <div><strong>Section:</strong> {student.section}</div>
            <div><strong>Gender:</strong> {student.gender}</div>
            <div><strong>DOB:</strong> {student.dateOfBirth}</div>
            <div><strong>Blood:</strong> {student.bloodGroup}</div>
            <div><strong>Email:</strong> {student.email}</div>
            <div><strong>Contact:</strong> {student.contact}</div>
            <div><strong>Parent:</strong> {student.parentContact}</div>
            <div><strong>Emergency:</strong> {student.emergencyContact}</div>
            <div><strong>Father:</strong> {student.fatherName}</div>
            <div><strong>Mother:</strong> {student.motherName}</div>
            <div className="col-span-2"><strong>Address:</strong> {student.address}</div>
            <div><strong>Admission:</strong> {student.admissionDate}</div>
            <div><strong>Status:</strong> {student.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestBedData;
