using { hr.assistant as my } from '../db/schema';

@requires: 'any'
service HRService {
    entity Departments as projection on my.Departments;
    @odata.draft.enabled
    entity Employees as projection on my.Employees;
    entity LeaveRequests as projection on my.LeaveRequests actions{
        action cancel() returns LeaveRequests;
    };
}