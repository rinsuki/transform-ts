import { Transformer, ValidationError, ok, error } from '..'

describe('Transformer', () => {
  let transformer: Transformer<string, number>

  beforeAll(() => {
    transformer = new Transformer<string, number>(s => {
      const r = parseInt(s, 10)
      if (isNaN(r)) return error(ValidationError.from('Invalid Input'))
      return ok(r)
    })
  })

  it('transforms value', () => {
    expect(transformer.transform('10')).toEqual(ok(10))
  })

  it('return errors when error is occured', () => {
    expect(transformer.transform('ten')).toEqual(error(ValidationError.from('Invalid Input')))
  })

  it('can be composed', () => {
    const numToBool = new Transformer<number, boolean>(n => ok(!!n))
    const composed = transformer.compose(numToBool)

    expect(composed.transform('10')).toEqual(ok(true))
    expect(composed.transform('ten')).toEqual(error(ValidationError.from('Invalid Input')))
  })

  test('Associative Law', () => {
    type A = ['a', number]
    type B = ['b', number]
    type C = ['c', number]
    type D = ['d', number]

    // f: A→B, g: B→C, h: C→D
    const f = new Transformer<A, B>(a => ok(['b', a[1]]))
    const g = new Transformer<B, C>(b => ok(['c', b[1]]))
    const h = new Transformer<C, D>(c => ok(['d', c[1]]))

    // t1 =  f∘(g∘h)
    const t1 = f.compose(g.compose(h))
    // t2 = (f∘g)∘h
    const t2 = f.compose(g).compose(h)

    // t1 ≡ t2
    expect(t1.transform(['a', 10])).toEqual(ok(['d', 10]))
    expect(t2.transform(['a', 10])).toEqual(ok(['d', 10]))
  })

  test('Identity Law', () => {
    type A = ['a', number]
    type B = ['b', number]

    // f: A→B
    const f = new Transformer<A, B>(a => ok(['b', a[1]]))

    const idA = new Transformer<A, A>(ok)
    const idB = new Transformer<B, B>(ok)

    // t1 = idA∘f
    const t1 = idA.compose(f)
    // t2 = f∘idB
    const t2 = f.compose(idB)

    // t1 ≡ f ≡ t2
    expect(t1.transform(['a', 10])).toEqual(ok(['b', 10]))
    expect(f.transform(['a', 10])).toEqual(ok(['b', 10]))
    expect(t2.transform(['a', 10])).toEqual(ok(['b', 10]))
  })
})
