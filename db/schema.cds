namespace hr.assistant;

entity Departments {
  key ID        : UUID;
  name          : String(100);
  employees     : Association to many Employees on employees.department = $self;
}

entity Employees {
  key ID        : UUID;
  fullName      : String(100);
  role          : String(100);
  department    : Association to Departments;
  leaves        : Association to many LeaveRequests on leaves.employee = $self;
}

entity LeaveRequests {
  key ID        : UUID;
  employee      : Association to Employees;
  startDate     : Date;
  endDate       : Date;
  status        : String(20); 
}