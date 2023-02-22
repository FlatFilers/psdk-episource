import {
  SpaceConfig,
} from '@flatfile/configure'

import { claimsWorkbook } from './sheets/claims'

export default new SpaceConfig({
  name: 'Claims Import (Eric)',
  slug: 'claims-import-config',
  workbookConfigs: {
    claimsWorkbook
  },
})
