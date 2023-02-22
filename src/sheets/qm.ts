import {
    BooleanField,
    DateField,
    NumberField,
    OptionField,
    Sheet,
    SpaceConfig,
    TextField,
    Workbook,
    LinkedField,
    ReferenceField
  } from '@flatfile/configure'

export const qm = new Sheet('Quality Measures', {
  vbc: ReferenceField({
    label: 'Value Based Care Contract',
    sheetKey: 'vbc',
    foreignKey: 'id'
  }),
  name: TextField({
    label: 'Quality Measure Name',
    required: true,
    unique: true,
  }),
  type: OptionField({
    label: 'Measure Type',
    required: true,
    options: {
      metric: 'Metric',
      imperial: 'Imperial',
    },
  }),
  year: DateField({
    label: 'Contract Year',
    required: true
  }),
  status: OptionField({
    label: 'Status',
    required: true,
    options: {
      active: 'Active',
      closed: 'Closed',
      future: 'Future',
    },
  })
})