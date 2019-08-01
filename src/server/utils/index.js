import fs from 'fs'

import config from '../config'
import { ENV_NAMES } from '../constants'

export const isDevelopmentEnv = () => config.NODE_ENV === ENV_NAMES.DEVELOPMENT
export const isTestEnv = () => config.NODE_ENV === ENV_NAMES.TEST
export const isProductionEnv = () => config.NODE_ENV === ENV_NAMES.PRODUCTION

export const getFileContents = path => fs.readFileSync(path, 'utf8')

export const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

export const runPromiseSequence = promiseArray => promiseArray.reduce(
  (current, next) => current.then(next),
  Promise.resolve(),
)

export const runSequence = (sequence, seed) => sequence.reduce((param, fn) => fn(param), seed)
