const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { Employees } = this.entities;

    this.before(['CREATE', 'UPDATE'], Employees, async (req) => {
        const employee = req.data;
        if (employee.salary !== undefined && employee.salary < 28000) {
            req.error(400, 'Girilen maaş tutarı geçerli yasal asgari ücretten düşük olamaz.');
        }
    });

    this.after('READ', Employees, (each) => {
        if (each && each.salary !== undefined) {
            if (each.salary >= 60000) {
                each.seniorityLevel = 'Senior Specialist';
            } else if (each.salary >= 35000) {
                each.seniorityLevel = 'Mid-Level Specialist';
            } else {
                each.seniorityLevel = 'Junior Specialist';
            }
        }
    });
});