import {
  SpaceConfig,
} from '@flatfile/configure'

import { claimsWorkbook } from './sheets/claims'

export default new SpaceConfig({
  name: 'Claims Import for Demo (Eric)',
  slug: 'claims-import-demo',
  workbookConfigs: {
    claimsWorkbook
  },
})
