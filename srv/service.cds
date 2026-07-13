using { hr.assistant as my } from '../db/schema';

service HRService {
    entity Departments as projection on my.Departments;
    entity Employees as projection on my.Employees;
    entity LeaveRequests as projection on my.LeaveRequests;
}