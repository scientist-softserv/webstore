import { CookiePreferencesCheck, Title } from '@scientist-softserv/webstore-component-library'
import { cookieConsentValue, disableCookies, enableCookies } from '../../utils'

const CookiePolicy = () => (
  <div className='container'>
    <Title title='Cookie Policy' style={{ marginTop: '1rem' }} />
    {cookiePolicy}
    <h2>Cookie Preferences</h2>
    <p> Please provide your consent below to our use of non-essential cookies on our site.
      You may withdraw your consent at any point by following the instructions above or by
      returning to this page and changing your selection.</p>
    <CookiePreferencesCheck
      cookieConsentValue={cookieConsentValue}
      disableCookies={disableCookies}
      enableCookies={enableCookies}
    />
    <div className='mb-4'></div>
  </div>
)

export default CookiePolicy

/* eslint-disable max-len, react/no-unescaped-entities */
const cookiePolicy = (
  <div>
    <h2>Information About Our Use of Cookies</h2>
    <p>Our website and platform (together our <strong>"site"</strong>) is operated by the Assay Depot, Inc. d.b.a Scientist.com (<strong>"Scientist.com"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, <strong>"our"</strong>). The site uses cookies to distinguish you from other users and this helps us to provide you with a good experience when you browse our site and also to improve our site.
      If you wish to remove cookies placed on your device by our site or stop our site placing further cookies on your device you can do this at any time (learn how to do this below).
      A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer's hard drive. We use the following cookies:
    </p>
    <ul>
      <li><strong>Strictly necessary cookies.</strong> These are cookies that are required for the operation of our site. They include, for example, cookies that enable you to log into secure areas of our site or make use of services. We do not require your consent to place these cookies. Nevertheless, you may be able to block these cookies yourself on your device/browser, but restricting these cookies is likely to mean that our site will not work as you would expect and certain functionality may be inoperable.</li>
      <p style={{textDecoration: 'underline'}}><strong>Non-essential cookies</strong></p>
      <li><strong>Analytical/performance cookies.</strong> They allow us to recognise and count the number of visitors and to see how visitors move around our site when they are using it. This helps us to improve the way our site works, for example, by ensuring that users are finding what they are looking for easily. We use cookies to compile visitor statistics such as how many people have visited our site, how they reached our site, what type of technology they are using (e.g. Mac or Windows which helps to identify when our site isn't working as it should for particular technologies), how long they spend on the site, what page they look at etc. This helps us to continuously improve our website.</li>
      <li><strong>Functionality cookies.</strong> These are used to recognise you/your language when you return to our site. This enables us to personalise our content for you and remember your preferences (for example, your choice of language or region).</li>
      <li><strong>Targeting cookies.</strong> These cookies record your visit to our site, the pages you have visited and the links you have followed. This information will be used by us and third parties to make our site and the advertising displayed on it more relevant to your interests. We may also share this information with third parties for this purpose but only if you consent to such sharing.</li>
      <li><strong>Social Website Cookies.</strong> We have included buttons on our site for certain social media sites such as Facebook, Twitter and Instagram. These cookies are set by the third party social media sites to which they relate.</li>
    </ul>
    <p>The privacy implications vary from social media site to social media site and will be dependent on the privacy settings you have chosen on these sites. Please refer to the relevant social media site's privacy and cookies policy for more information.</p>
    <p>You can find more information about the individual cookies we use and the purposes for which we use them in the table below:</p>
    <table className="table table-responsive table-bordered">
      <thead>
        <tr>
          <th width="20%">
            Cookie
          </th>
          <th width="20%">
            Cookie duration
          </th>
          <th width="60%">
            Purpose/further information
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={3} style={{textDecoration: 'underline'}}>
            <strong>Essential (strictly necessary) cookies</strong>
          </td>
        </tr>
        <tr>
          <td>
            _rx_session
          </td>
          <td>
            End of browser session
          </td>
          <td>
            Scientist.com
            <br />
            <br />
            This cookie enables us to distinguish users and sessions.
          </td>
        </tr>
        <tr>
          <td>
            _rx_cookie_consent
          </td>
          <td>
            1 year
          </td>
          <td>
            Scientist.com
            <br />
            <br />
            This cookie stores the user's cookie consent status.
          </td>
        </tr>
        <tr>
          <td>
            intercom-lou-XXX
          </td>
          <td>
            1 year
          </td>
          <td>
            Intercom cookie
            <br />
            <br />
            This cookie helps to remember the user between visits and resume chat conversations.
          </td>
        </tr>
        <tr>
          <td>
            intercom-session-XXX
          </td>
          <td>
            1 week
          </td>
          <td>
            Intercom cookie
            <br />
            <br />
            This cookie enables us to track the user's session, including maintaining continuity in chat conversations.
          </td>
        </tr>
        <tr>
          <td>
            intercom-id-XXX
          </td>
          <td>
            1 year
          </td>
          <td>
            Intercom cookie
            <br />
            <br />
            This cookie enables us to distinguish users.
          </td>
        </tr>
        <tr>
          <td>
            NID
          </td>
          <td>
            6 months
          </td>
          <td>
            Google
            <br />
            <br />
            This cookie contains a unique ID that identifies a returning user's device. Used by Google’s reCAPTCHA service to prevent spam.
          </td>
        </tr>
        <tr>
          <td colSpan={3} style={{textDecoration: 'underline'}}>
            <strong>Non-essential cookies</strong>
          </td>
        </tr>
        <tr>
          <td>
            __ga
          </td>
          <td>
            2 years
          </td>
          <td>
            Google Analytics
            <br />
            <br />
            This cookie enables us to distinguish users.
          </td>
        </tr>
        <tr>
          <td>
            __gid
          </td>
          <td>
            24 hours
          </td>
          <td>
            Google Analytics
            <br />
            <br />
            This cookie enables us to distinguish users.
          </td>
        </tr>
        <tr>
          <td>
            __utma
          </td>
          <td>
            2 years
          </td>
          <td>
            Google Analytics
            <br />
            <br />
            This cookie enables us to distinguish users and sessions. The cookie is created when the javascript library executes and no existing __utma cookies exists. The cookie is updated every time data is sent to Google Analytics.
          </td>
        </tr>
        <tr>
          <td>
            __utmt
          </td>
          <td>
            10 minutes
          </td>
          <td>
            Google Analytics
            <br />
            <br />
            This cookie is used to limit the number of requests sent to the Google Analytics servers in the case of unusually high traffic.
          </td>
        </tr>
        <tr>
          <td>
            __utmb
          </td>
          <td>
            30 minutes
          </td>
          <td>
            Google Analytics
            <br />
            <br />
            This cookie enables us to determine new sessions/visits. The cookie is created when the javascript library executes and no existing __utmb cookies exists. The cookie is updated every time data is sent to Google Analytics.
          </td>
        </tr>
        <tr>
          <td>
            __utmc
          </td>
          <td>
            End of browser session
          </td>
          <td>
            Google Analytics
            <br />
            <br />
            This cookie is not used in most sites but is set to enable interoperability with the older version of Google Analytics. Historically, this cookie operated in conjunction with the __utmb cookie to determine whether the user was in a new session/visit.
          </td>
        </tr>
        <tr>
          <td>
            __utmz
          </td>
          <td>
            6 months
          </td>
          <td>
            Google Analytics
            <br />
            <br />
            This cookie stores the traffic source or campaign that explains how the user reached the site. The cookie is created when the javascript library executes and is updated every time data is sent to Google Analytics.
          </td>
        </tr>
        <tr>
          <td>
            __utmv
          </td>
          <td>
            2 years
          </td>
          <td>
            Google Analytics
            <br />
            <br />
            This cookie is used to store visitor-level custom variable data. This cookie is created when a developer uses the _setCustomVar
            method with a visitor level custom variable. This cookie was also used for the deprecated _setVar method. The cookie is updated every time data is sent to Google Analytics.
          </td>
        </tr>
        <tr>
          <td>
            pll_language
          </td>
          <td>
            1 year
          </td>
          <td>
            Polylang cookie
            <br />
            <br />
            This cookie enables us to remember the last language visited.
          </td>
        </tr>
      </tbody>
    </table>
    <p>Please note that third parties (including, for example, providers of external services like web traffic analysis services) may also use cookies, over which we have no control. These cookies are likely to be analytical/performance cookies or targeting cookies.</p>
    <p>You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, as set out above, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our site.</p>
    <h2>More Information</h2>
    <p>More information about cookies, including how to block them or delete them, can be found at <a href="http://www.aboutcookies.org" target="_blank" rel="noreferrer">http://www.aboutcookies.org/</a></p>
    <p>If you have any further questions, comments or requests regarding our cookies policy or how we use cookies
      on our site, then you can contact us by email at <a href="mailto:privacy@scientist.com">privacy@scientist.com</a>.</p>
    <h2>Changes To This Cookies Policy</h2>
    <p>Any changes to this cookies policy in the future will be posted on this page and we will take all measures
      necessary to communicate any changes to this cookies policy to you. Please check back frequently to see
      any updates or changes to this cookies policy. We will also bring your attention to such changes by updating
      our cookie banner/pop-up.</p>
    <p>This policy was last reviewed and updated: May 31, 2018</p>
  </div>
)
/* eslint-enable max-len, react/no-unescaped-entities */
