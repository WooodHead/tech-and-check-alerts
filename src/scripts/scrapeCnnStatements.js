import CnnTranscriptStatementScraper from '../server/workers/scrapers/CnnTranscriptStatementScraper'
import { isTranscriptUrl } from '../server/utils/cnn'
import logger from '../server/utils/logger'

const getUrl = () => {
  const urlFlag = process.argv.indexOf('-u')
  if (urlFlag !== -1) {
    const url = process.argv[urlFlag + 1]
    if (isTranscriptUrl(url)) return url
  }
  return null
}

const url = getUrl()
if (!url) {
  logger.error('Pass in a valid CNN transcript URL with the `-u` parameter.')
  process.exit()
}

const scrapeStatements = () => {
  const scraper = new CnnTranscriptStatementScraper(url)
  return scraper.run()
}

scrapeStatements().catch((error) => {
  logger.error(`Scraping failed. ${error}`)
}).then((statements) => {
  logger.info(`Total statements: ${statements.length}`)
  statements.forEach(statement => logger.info('%o', statement))
}).finally(() => process.exit())
