const cds = require('@sap/cds');

module.exports = class HRService extends cds.ApplicationService {
    async init() {
        const { Employees, LeaveRequests } = this.entities;

        this.before(['CREATE', 'UPDATE'], 'Employees', async (req) => {
            const employee = req.data;
            if (employee.salary !== undefined && employee.salary < 28000) {
                req.reject(400, 'Girilen maaş tutarı geçerli yasal asgari ücretten düşük olamaz.');
            }
        });

        // İzin Oluştururken: Çakışma kontrolü (En Güvenli Sorgu Yöntemi ile)
        this.before('CREATE', 'LeaveRequests', async (req) => {
            const newLeave = req.data;
            if (!newLeave.employee_ID || !newLeave.startDate || !newLeave.endDate) return;

            const overlapping = await SELECT.from(LeaveRequests).where`
                employee_ID = ${newLeave.employee_ID}
                AND status != 'cancelled'
                AND startDate <= ${newLeave.endDate}
                AND endDate >= ${newLeave.startDate}
            `;

            if (overlapping.length > 0) {
                return req.reject(400, 'HATA: Bu çalışanın belirtilen tarihlerle çakışan başka bir aktif izni bulunmaktadır.');
            }
        });

        this.after('READ', 'Employees', (results) => {
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

        this.before('READ', (req) => {
            console.log('--- YENİ BİR İSTEK GELDİ ---');
            console.log('İsteği Yapan Kullanıcı:', req.user.id);
            if(req.user._roles) {
                 console.log('Sahip Olduğu Roller:', req.user._roles);
            }
            console.log('Admin Yetkisi Var mı?:', req.user.is('admin'));
            console.log('----------------------------');
        });

        // İzin İptali Action (Parametre Güvencesi ile)
        this.on('cancel', 'LeaveRequests', async (req) => {
            
            const lastParam = req.params[req.params.length - 1];
            // ID düz yazı (string) gelirse onu objeye çevir, zaten objeyse aynen kullan
            const key = typeof lastParam === 'object' ? lastParam : { ID: lastParam }; 
            
            const leaveRequest = await SELECT.one.from(LeaveRequests).where(key);
            
            if (!leaveRequest) {
                return req.reject(404, `Belirtilen izin talebi bulunamadı`);
            }

            if (leaveRequest.status === 'cancelled' || leaveRequest.status === 'approved') {
                return req.reject(400, `Bu izin talebi iptal edilemez. Mevcut durum: ${leaveRequest.status}`);
            }

            const start = new Date(leaveRequest.startDate);
            const end = new Date(leaveRequest.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

            if (leaveRequest.employee_ID) {
                await UPDATE(Employees)
                    .where({ ID: leaveRequest.employee_ID })
                    .with({ leaveBalance: { '+=': diffDays } });
            }

            await UPDATE(LeaveRequests)
                .where(key)
                .with({
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString()
                });

            return await SELECT.one.from(LeaveRequests).where(key);
        });

        return super.init();
    }
};