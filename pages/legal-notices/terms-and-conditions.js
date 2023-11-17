import { Title } from '@scientist-softserv/webstore-component-library'

const TermsAndConditions = () => (
  <div className='container'>
    <Title title='Terms and Conditions of Purchase' style={{ marginTop: '1rem'}} />
    {termsAndConditions}
  </div>
)

export default TermsAndConditions

const termsAndConditions = (
  <div>
    {/* Delete this text and the div! Just needed this so that the build would not fail. */}
    Place the terms and conditions here.
    {/*
      * How to add the proper html to this page:
      *
      ******* OPTION 1 (simplest):
      * Upload the .docx file from the client to https://wordtohtml.net/
      * Underneath the HTML Editor click "copy to clipboard"
      * Open https://magic.reactjs.net/htmltojsx.htm
      * Uncheck the "create class" box
      * Paste the copied html into the left box
      * Copy the JS code from the right box into this space, replacing everything within the parenthesis'
      * If applicable, remove the following:
      *   - the title and logo from the jsx
      *   - all "fontFamily" and "backgroundColor: '#ffffff'" style attributes
      *   - extra <p> tags that provide unnecessary spacing
      *   - the last <div> tag with the footer info
      *   - the last <p> tag with the "Converted to HTML with WordToHTML.net" text
      * Ensure the page still has appropriate margin at the top and bottom
      *
      ******* OPTION 2:
      * Open the .docx file from the client in TextEdit
      * Hold down the option key and click on File >> Save As...
      * Change the file format to "Web Page (.html)"
      * Save.
      *
      * Open the file with your code editor
      * Copy the html beginning with the body tag of that file
      * Replace this comment with the copied text from the converted html file
      * Remove all instances of extra spaces. Some examples are:
      *   "<span class="Apple-converted-space"> </span>"
      *   "<span class="Apple-tab-span">	</span>"
      *   "<spanconverted-space">  </span>"
      *   `class="xxx"`
      *   "<p><br></p>"
      *   "<p><b></b><br></p>"
      * Format the ordered lists correctly. E.g.:
      *   <ol type='a'>, <ol type='i'>, etc.
      * Indent the html properly
      * Make other changes as necessary to make the text in the browser look
      *   similar to the doc received from the client
    */}
  </div>
)
