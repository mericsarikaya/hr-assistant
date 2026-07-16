using HRService from './service';

annotate HRService.Employees with @(
  UI.LineItem: [
    { Value: ID,            Label: 'ID' },
    { Value: fullName,      Label: 'İsim - Soyisim' },
    { Value: role,          Label: 'Rol' },
    { Value: department.name, Label: 'Departman' }
  ],
  UI.SelectionFields: [ ID, fullName ],

    UI.Facets: [
    {
      $Type: 'UI.ReferenceFacet',
      Label: 'İzin Talepleri',
      Target: 'leaves/@UI.LineItem'
    }
  ]
);

annotate HRService.Departments with @(
  UI.LineItem: [
    { Value: ID,            Label: 'ID' },
    { Value: name,          Label: 'İsim - Soyisim' },
  ],
  UI.SelectionFields: [ ID ]
);

annotate HRService.LeaveRequests with @(
  UI.LineItem: [
    { Value: startDate, Label: 'Başlangıç Tarihi' },
    { Value: endDate,   Label: 'Bitiş Tarihi' },
    { Value: status,    Label: 'Durum' },
    { $Type: 'UI.DataFieldForAction', Action: 'HRService.cancel', Label: 'İptal Et' }
  ]
);
