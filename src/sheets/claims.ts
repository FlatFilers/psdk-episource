import {
    NumberField,
    BooleanField,
    Sheet,
    Message,
    TextField,
    ReferenceField,
    Workbook,
    OptionField
  } from '@flatfile/configure'

import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks'
import { isNull } from 'lodash'
import { SmartDateField } from '../../examples/fields/SmartDateField'


// import { Class } from external

// const configSheet = new Sheet('Config',{
//   provider_required: BooleanField({
//     label: 'Should the provider be required?',
//     default: true
//   })
//   regexNpi: TextField
// }
// )

// const getConfig = new function (
//   // function looks up all of the values in the config Workbook
//   // function sets the config values in the providers and claims workbooks
//   // use @flatfile/api
//   // if provider_required has a value, then set the provider_name.required config option to that value
// )


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
      const regex = new RegExp("^[0-9]{10}$","i")
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
        const regex = new RegExp('^[a-zA-Z0-9-_]+$',"i")
        if (!regex.test(value)) {
          throw 'MRN must only be alphanumeric characters'
        }
      },
    }),

    claim_number: NumberField({
      label: 'Claim Number',
      required: true,
      unique: true
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
    }),

    type_of_service: OptionField({
      label: "Type of Service",
      options: {
        inpatient: "Inpatient",
        outpatient: "Outpatient"
      }
    })

  },
  {
    recordCompute:(record) => {
      const links = record.getLinks('provider_npi')
      const dos = record.get('date_of_service')
      const lastUpdated = links[0].last_updated
      const location = links[0].location

      if (!!lastUpdated && !!dos && dos < lastUpdated.getTime()) {
        record.addWarning('date_of_service','Provider record has been updated since claim date.')
      }

      if (!!location && isNull(record.get('service_location'))) {
        record.set('service_location',location)
      }

    },
    batchRecordsCompute: async (payload: FlatfileRecords<any>) => {
      const response = await fetch('https://api.us.flatfile.io/health', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
      const result = (await response.json()) as any
      payload.records.map(async (record: FlatfileRecord) => {
        record.set('fromHttp', result.info.postgres.status)
      })
    },
  }
)

export const claimsWorkbook = new Workbook({
  name: 'Claims Import',
  slug: 'claims-import',
  sheets: {
    // configWorkbook,
    providers,
    claims
  }
})