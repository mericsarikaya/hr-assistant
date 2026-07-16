namespace hr.assistant;
using { cuid } from '@sap/cds/common';

entity Departments:cuid {
  name          : String(100);
  employees     : Association to many Employees on employees.department = $self;
}

entity Employees:cuid {
  fullName      : String(100);
  role          : String(100);
  department    : Association to Departments;
  leaves        : Composition of many LeaveRequests on leaves.employee = $self;
  leaveBalance  : Integer default 14;
}

entity LeaveRequests: cuid{
  employee      : Association to Employees;
  startDate     : Date;
  endDate       : Date;
  status        : String(20); 
  cancelledAt   : DateTime;
}