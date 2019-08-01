import fs from 'fs'
import Handlebars from 'handlebars'
import sanitizeHTML from 'sanitize-html'

import {
  getFileContents,
  runSequence,
} from '.'

const TEMPLATE_PARTIALS_DIRECTORY = `${__dirname}/../newsletters/templates/partials/`

const isHandlebarsTemplate = fileName => fileName.endsWith('.hbs')

const getHandlebarsPartials = () => fs.readdirSync(TEMPLATE_PARTIALS_DIRECTORY)
  .filter(fileName => isHandlebarsTemplate(fileName))

const registerHandlebarsPartial = (fileName) => {
  const templateSource = getFileContents(`${TEMPLATE_PARTIALS_DIRECTORY}/${fileName}`)
  const partialName = fileName.replace('.hbs', '')
  Handlebars.registerPartial(partialName, templateSource)
}

const registerHandlebarsPartials = () => {
  const partials = getHandlebarsPartials()
  return partials.map(registerHandlebarsPartial)
}

export const getHandlebarsTemplate = (templateSource) => {
  registerHandlebarsPartials()
  return Handlebars.compile(templateSource)
}

export const stripHTMLTags = html => sanitizeHTML(html, {
  allowedTags: [],
  parser: {
    decodeEntities: true,
  },
})

const removeRepetitiveNewlines = text => text.replace(/\n{3,}/g, '\n')
const removeRepetitiveSpaces = text => text.replace(/ {2,}/g, ' ')
const removeTrailingSpaces = text => text.replace(/ \n/g, '\n')
const removeLeadingSpaces = text => text.replace(/\n /g, '\n')
const trimOuter = text => text.trim()
// `decodeAmpersands()` should be unnecessary, but sanitizeHTML's `decodeEntities` doesn't work
const decodeAmpersands = text => text.replace(/&amp;/g, '&')

/**
 * Cleans HTML out of the text-only version of the newsletter. This is basically so we can reuse
 * the boilerplate, which contains HTML, but also cleans up unintended whitespace.
 *
 * @return {String} The text template cleaned of HTML
 */
export const cleanNewsletterTemplate = template => runSequence([
  stripHTMLTags,
  decodeAmpersands,
  removeRepetitiveSpaces,
  removeTrailingSpaces,
  removeLeadingSpaces,
  removeRepetitiveNewlines,
  trimOuter,
], template)
