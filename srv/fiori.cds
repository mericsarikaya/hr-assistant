using { hr.assistant as my } from '../db/schema';

annotate service.Employees with @(
  UI.LineItem: [
    { Value: ID,        Label: 'ID' },
    { Value: fullName,  Label: 'İsim - Soyisim' },
    { Value: role,        Label: 'Rol' },
    { Value: department,        Label: 'Departman' }
  ],
  UI.SelectionFields: [ ID, fullName ]
);  