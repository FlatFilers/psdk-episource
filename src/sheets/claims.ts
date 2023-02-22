import {
    NumberField,
    Sheet,
    Message,
    TextField,
    ReferenceField,
    Workbook
  } from '@flatfile/configure'
import { isNull } from 'lodash'
import { SmartDateField } from '../../examples/fields/SmartDateField'

const providers = new Sheet('Providers', {
  provider_name: TextField({
    label: 'Provider Name',
    required: true
  }),

  npi: TextField({
    label: 'NPI of the provider',
    required: true,
    compute: (value) => {
      return value.trim()
    },
    validate: (value: string): void | Message[] => {
      const regex = new RegExp("^\d{10}$","i")
      if (!regex.test(value)) {
        throw 'Provider NPI must be 10 digits'
      }
    },
    unique: true
  }),

  last_updated: SmartDateField({
    label: 'Last Updated',
    locale: 'en',
    formatString: 'yyyy-MM-dd',
    extraParseString: "MMddyyyy"
  }),

  location: TextField({
    label: 'Location of Provider'
  })
})

const claims = new Sheet('Claims', {
    patient_name: TextField({
      label: 'Patient Name',
      default: 'John Doe',
      required: true
    }),

    mrn: TextField({
      label: 'Medical Record Number',
      required: true,
      compute: (value) => {
        return value.trim()
      },
      validate: (value: string): void | Message[] => {
        const regex = new RegExp('^[a-z0-9]+$',"i")
        if (!regex.test(value)) {
          throw 'MRN must only be alphanumeric characters'
        }
      },
    }),

    claim_number: NumberField({
      label: 'Claim Number',
      required: true
    }),

    provider_npi: ReferenceField({
      label: 'NPI of the provider',
      sheetKey: 'providers',
      foreignKey: 'npi',
      relationship: 'has-many'
    }),

    date_of_service: SmartDateField({
      label: 'Date of Service',
      locale: 'en',
      formatString: 'yyyy-MM-dd',
      extraParseString: "MMddyyyy"
    }),

    service_location: TextField({
      label: 'Location of Service',
      description: 'Pulled from the Provider Location if not provided'
    })

  },
  {
    recordCompute:(record) => {
      // const links = record.getLinks('provider_npi')
      // // const dos = record.get('date_of_service')
      // // const lastUpdated = links[0].last_updated
      // const location = links[0].location

      // // if (!!lastUpdated && !!dos && lastUpdated > dos) {
      // //   record.addWarning('date_of_service','Provider record has been updated since claim date.')
      // // }

      // if (!!location && isNull(record.get('service_location'))) {
      //   record.set('service_location',location)
      // }

    }
  }
)

export const claimsWorkbook = new Workbook({
  name: 'Claims Import',
  slug: 'claims-import',
  sheets: {
    providers,
    claims
  }
})