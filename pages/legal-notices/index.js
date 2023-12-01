import { Link, Title } from '@scientist-softserv/webstore-component-library'
import { LEGAL_NOTICES } from '../../utils'

const LegalNotices = () => (
  <div className='container'>
    <Title title='Legal Notices' style={{ marginTop: '1rem' }} />
    {LEGAL_NOTICES.map(({ name, url }) => (
      <Link
        key={name}
        label={name}
        href={url}
        style={{
          borderBottom: '1px solid',
          marginBottom: '10px',
          display: 'block',
          paddingBottom: '5px'
        }}
      />
    ))}
  </div>
)

export default LegalNotices
