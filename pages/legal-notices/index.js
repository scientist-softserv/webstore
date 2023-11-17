import { LinkGroup, Title } from '@scientist-softserv/webstore-component-library'
import { LEGAL_NOTICES } from '../../utils'

const LegalNotices = () => (
  <div className='container'>
    <Title title='Legal Notices' style={{ marginTop: '1rem' }} />
    <LinkGroup links={LEGAL_NOTICES} />
  </div>
)

export default LegalNotices
