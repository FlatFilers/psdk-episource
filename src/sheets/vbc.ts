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

export const vbc = new Sheet('VBC Contracts', {
  name: TextField({
    label: 'Contract Name',
    required: true,
    default: "United"
  }),
  id: TextField({
    label: 'Contract ID',
    required: true,
    unique: true
  }),
  payer: TextField({
    label: 'Payer Name',
    required: true
  }),
  lob: OptionField({
    label: 'Line of Business',
    options: {
      commercial: 'Commercial',
      consumer: 'Consumer',
      industrial: 'Industrial',
    },
  }),
  lives: NumberField({
    label: 'Approx # of Lives'
  }),
  percentile_90: NumberField({
    label: '90th percentile'
  })
})