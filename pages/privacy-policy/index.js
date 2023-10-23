import Link from 'next/link'
import { TitledTextBox } from '@scientist-softserv/webstore-component-library'

const PrivacyPolicy = () => (
  <div className='container'>
    <TitledTextBox title='*Client* Privacy Policy' text={text} />
    <p>View the <Link href='/privacy-policy/scientist-privacy-policy'>Scientist.com Global Privacy Policy</Link></p>
  </div>
)

export default PrivacyPolicy

const text = `

`
