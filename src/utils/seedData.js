export const seedDummyData = (force = false) => {
  const hasData = localStorage.getItem('dataSeeded') === 'true';
  if (hasData && !force) return;

  // 1. Room Types
  const roomTypes = [
    { id: 1, name: 'Single AC', capacity: 1, monthlyRent: 12000, amenities: ['AC', 'Wifi', 'Attached Bath'] },
    { id: 2, name: 'Double Sharing', capacity: 2, monthlyRent: 8000, amenities: ['Wifi', 'Shared Bath', 'Balcony'] },
    { id: 3, name: 'Triple Sharing', capacity: 3, monthlyRent: 6000, amenities: ['Wifi', 'Shared Bath'] },
    { id: 4, name: 'Deluxe Suite', capacity: 1, monthlyRent: 15000, amenities: ['AC', 'Wifi', 'TV', 'Mini Fridge'] },
  ];

  // 2. Rooms
  const rooms = [
    { id: 101, number: '101', typeId: 1, floor: 1, capacity: 1, status: 'Occupied' },
    { id: 102, number: '102', typeId: 2, floor: 1, capacity: 2, status: 'Occupied' },
    { id: 201, number: '201', typeId: 2, floor: 2, capacity: 2, status: 'Available' },
    { id: 202, number: '202', typeId: 3, floor: 2, capacity: 3, status: 'Occupied' },
    { id: 301, number: '301', typeId: 4, floor: 3, capacity: 1, status: 'Maintenance' },
  ];

  // 3. Students
  const students = [
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
    { 
      id: 3, 
      name: 'Amit Patel', 
      rollNumber: 'ME103', 
      class: '10th', 
      section: 'A',
      email: 'amit@example.com', 
      contact: '7654321098',
      parentContact: '7654321099',
      gender: 'Male',
      dateOfBirth: '2008-03-10',
      address: '789, Lake View, Bangalore',
      bloodGroup: 'B+',
      fatherName: 'Mr. Ramesh Patel',
      motherName: 'Mrs. Meena Patel',
      emergencyContact: '7654321100',
      admissionDate: '2023-04-10',
      status: 'Active'
    },
    { 
      id: 4, 
      name: 'Sneha Gupta', 
      rollNumber: 'CS204', 
      class: '8th', 
      section: 'C',
      email: 'sneha@example.com', 
      contact: '6543210987',
      parentContact: '6543210988',
      gender: 'Female',
      dateOfBirth: '2010-11-05',
      address: '321, Green Avenue, Pune',
      bloodGroup: 'AB+',
      fatherName: 'Mr. Anil Gupta',
      motherName: 'Mrs. Pooja Gupta',
      emergencyContact: '6543210989',
      admissionDate: '2023-04-15',
      status: 'Active'
    },
    { 
      id: 5, 
      name: 'Vikram Singh', 
      rollNumber: 'CE205', 
      class: '9th', 
      section: 'A',
      email: 'vikram@example.com', 
      contact: '5432109876',
      parentContact: '5432109877',
      gender: 'Male',
      dateOfBirth: '2009-01-20',
      address: '654, Hill Road, Jaipur',
      bloodGroup: 'O-',
      fatherName: 'Mr. Harpal Singh',
      motherName: 'Mrs. Simran Singh',
      emergencyContact: '5432109878',
      admissionDate: '2023-04-20',
      status: 'Active'
    },
    { 
      id: 6, 
      name: 'Anjali Reddy', 
      rollNumber: 'CS306', 
      class: '10th', 
      section: 'B',
      email: 'anjali@example.com', 
      contact: '4321098765',
      parentContact: '4321098766',
      gender: 'Female',
      dateOfBirth: '2008-07-12',
      address: '987, Beach Road, Chennai',
      bloodGroup: 'A-',
      fatherName: 'Mr. Venkat Reddy',
      motherName: 'Mrs. Lakshmi Reddy',
      emergencyContact: '4321098767',
      admissionDate: '2023-04-25',
      status: 'Active'
    },
    { 
      id: 7, 
      name: 'Karan Mehta', 
      rollNumber: 'ME407', 
      class: '11th', 
      section: 'A',
      email: 'karan@example.com', 
      contact: '3210987654',
      parentContact: '3210987655',
      gender: 'Male',
      dateOfBirth: '2007-09-18',
      address: '147, Ring Road, Ahmedabad',
      bloodGroup: 'B-',
      fatherName: 'Mr. Ashok Mehta',
      motherName: 'Mrs. Nisha Mehta',
      emergencyContact: '3210987656',
      admissionDate: '2023-05-01',
      status: 'Active'
    },
    { 
      id: 8, 
      name: 'Neha Kapoor', 
      rollNumber: 'EC508', 
      class: '11th', 
      section: 'B',
      email: 'neha@example.com', 
      contact: '2109876543',
      parentContact: '2109876544',
      gender: 'Female',
      dateOfBirth: '2007-12-25',
      address: '258, Mall Road, Chandigarh',
      bloodGroup: 'O+',
      fatherName: 'Mr. Rajiv Kapoor',
      motherName: 'Mrs. Sonia Kapoor',
      emergencyContact: '2109876545',
      admissionDate: '2023-05-05',
      status: 'Active'
    },
  ];

  // 4. Room Allocations
  const roomAllocations = [
    { id: 1, studentId: 1, studentName: 'Rahul Sharma', roomId: 101, roomNumber: '101', date: '2025-01-10' },
    { id: 2, studentId: 2, studentName: 'Priya Verma', roomId: 102, roomNumber: '102', date: '2025-02-15' },
    { id: 3, studentId: 3, studentName: 'Amit Patel', roomId: 102, roomNumber: '102', date: '2025-01-20' },
    { id: 4, studentId: 4, studentName: 'Sneha Gupta', roomId: 202, roomNumber: '202', date: '2025-03-01' },
    { id: 5, studentId: 5, studentName: 'Vikram Singh', roomId: 202, roomNumber: '202', date: '2025-03-05' },
  ];

  // 5. Bed Allocations
  const bedAllocations = [
    { id: 1, roomId: 101, bedNumber: 1, studentId: 1, studentName: 'Rahul Sharma', allocatedDate: '2025-01-10' },
    { id: 2, roomId: 102, bedNumber: 1, studentId: 2, studentName: 'Priya Verma', allocatedDate: '2025-02-15' },
    { id: 3, roomId: 102, bedNumber: 2, studentId: 3, studentName: 'Amit Patel', allocatedDate: '2025-01-20' },
    { id: 4, roomId: 202, bedNumber: 1, studentId: 4, studentName: 'Sneha Gupta', allocatedDate: '2025-03-01' },
    { id: 5, roomId: 202, bedNumber: 2, studentId: 5, studentName: 'Vikram Singh', allocatedDate: '2025-03-05' },
  ];

  // 6. Hostel Services
  const hostelServices = [
    { id: 1, studentName: 'Rahul Sharma', studentId: 1, serviceType: 'Laundry', description: 'Wash and Iron', cost: 150, date: '2025-03-15', time: '10:30 AM', status: 'Completed' },
    { id: 2, studentName: 'Priya Verma', studentId: 2, serviceType: 'Hair Cutting', description: 'Regular trim', cost: 100, date: '2025-03-16', time: '02:00 PM', status: 'Pending' },
    { id: 3, studentName: 'Amit Patel', studentId: 3, serviceType: 'Shoe Polish', description: 'Brown formal shoes', cost: 30, date: '2025-03-17', time: '09:00 AM', status: 'Pending' },
  ];

  // 7. Student Queries (Complaints)
  const studentQueries = [
    { id: 1, studentName: 'Rahul Sharma', studentId: 1, category: 'Maintenance', subject: 'Leaking Tap', description: 'The tap in room 101 toilet is leaking continuously.', status: 'Pending', date: '2025-03-14' },
    { id: 2, studentName: 'Sneha Gupta', studentId: 4, category: 'Electricity', subject: 'Fan Noise', description: 'Fan in room 202 is making loud clicking noise.', status: 'Resolved', date: '2025-03-10' },
  ];

  // 8. Mess Registrations
  const messRegistrations = [
    { id: 1, studentId: 1, studentName: 'Rahul Sharma', plan: 'Monthly', startDate: '2025-03-01' },
    { id: 2, studentId: 2, studentName: 'Priya Verma', plan: 'Quarterly', startDate: '2025-02-01' },
  ];

  // 9. Check In/Out Records
  const checkInOutRecords = [
    { id: 1, studentId: 1, studentName: 'Rahul Sharma', action: 'checkin', date: new Date().toISOString().split('T')[0], time: '08:00 AM' },
    { id: 2, studentId: 2, studentName: 'Priya Verma', action: 'checkin', date: new Date().toISOString().split('T')[0], time: '09:15 AM' },
  ];

  // 10. Entry/Exit Records
  const entryExitRecords = [
    { id: 1, studentId: 1, studentName: 'Rahul Sharma', rollNumber: 'CS101', phone: '9876543210', room: '101', action: 'entry', date: new Date().toISOString().split('T')[0], time: '08:00:00', timestamp: new Date().toISOString(), purpose: 'Hostel Entry', status: 'Completed' },
    { id: 2, studentId: 2, studentName: 'Priya Verma', rollNumber: 'EC102', phone: '8765432109', room: '102', action: 'entry', date: new Date().toISOString().split('T')[0], time: '09:15:00', timestamp: new Date().toISOString(), purpose: 'Hostel Entry', status: 'Completed' },
    { id: 3, studentId: 3, studentName: 'Amit Patel', rollNumber: 'ME103', phone: '7654321098', room: '102', action: 'entry', date: new Date().toISOString().split('T')[0], time: '08:30:00', timestamp: new Date().toISOString(), purpose: 'Hostel Entry', status: 'Completed' },
    { id: 4, studentId: 4, studentName: 'Sneha Gupta', rollNumber: 'CS204', phone: '6543210987', room: '202', action: 'entry', date: new Date().toISOString().split('T')[0], time: '10:00:00', timestamp: new Date().toISOString(), purpose: 'Hostel Entry', status: 'Completed' },
    { id: 5, studentId: 5, studentName: 'Vikram Singh', rollNumber: 'CE205', phone: '5432109876', room: '202', action: 'exit', date: new Date().toISOString().split('T')[0], time: '14:30:00', timestamp: new Date().toISOString(), purpose: 'Hostel Exit', status: 'Completed' },
  ];

  // Store all in localStorage
  localStorage.setItem('roomTypes', JSON.stringify(roomTypes));
  localStorage.setItem('rooms', JSON.stringify(rooms));
  localStorage.setItem('students', JSON.stringify(students));
  localStorage.setItem('roomAllocations', JSON.stringify(roomAllocations));
  localStorage.setItem('bedAllocations', JSON.stringify(bedAllocations));
  localStorage.setItem('hostelServices', JSON.stringify(hostelServices));
  localStorage.setItem('studentQueries', JSON.stringify(studentQueries));
  localStorage.setItem('messRegistrations', JSON.stringify(messRegistrations));
  localStorage.setItem('checkInOutRecords', JSON.stringify(checkInOutRecords));
  localStorage.setItem('entryExitRecords', JSON.stringify(entryExitRecords));
  
  localStorage.setItem('dataSeeded', 'true');
  console.log('Dummy data seeded successfully');
};
