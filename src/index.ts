export { Transformer } from './transformer'
export { ValidationError, ValidationTypeError, ValidationMemberError, ValidationErrors } from './errors'
export { Result, ValidationResult, ok, error, isOk, isError } from './result'

import { any, number, string, boolean, literal } from './primitives'
import { nullable, optional, array, tuple, obj, either } from './combinators'

export default {
  any,
  number,
  string,
  boolean,
  literal,
  nullable,
  optional,
  array,
  tuple,
  obj,
  either,
}
