const cds = require('@sap/cds');

module.exports = class EmployeeService extends cds.ApplicationService {
    async init() {
        const { Employees } = this.entities;

        // CREATE ve UPDATE için validation
        this.before(['CREATE', 'UPDATE'], 'Employees', async (req) => {
            const employee = req.data;
            if (employee.salary !== undefined && employee.salary < 28000) {
                req.error(400, 'Girilen maaş tutarı geçerli yasal asgari ücretten düşük olamaz.');
            }
        });

        // READ sonrası hesaplanan alan
        this.after('READ', 'Employees', (results) => {
            // results hem tekil hem de çoklu sorgularda çalışması için diziye çevrilir
            const employees = Array.isArray(results) ? results : [results];
            
            employees.forEach(each => {
                if (each.salary !== undefined) {
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

        return super.init();
    }
};

module.exports = (srv) => {
  srv.before('READ', (req) => {
    console.log('--- YENİ BİR İSTEK GELDİ ---');
    console.log('İsteği Yapan Kullanıcı:', req.user.id);
    console.log('Sahip Olduğu Roller:', req.user._roles);
    console.log('Admin Yetkisi Var mı?:', req.user.is('admin'));
    console.log('----------------------------');
  });
};