/**
 * Copyright (c) 2016 shogogg <shogo@studofly.net>
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
import { none, None, option, Option, some, Some } from '../index'

describe('option', () => {
  it('should be a function.', () => {
    expect(typeof option).toBe('function')
  })

  it('should return `none` when null given.', () => {
    expect(option(null)).toBe(none)
  })

  it('should return `none` when undefined given.', () => {
    expect(option(undefined)).toBe(none)
  })

  it('should return `Some` instance when non-empty value given.', () => {
    expect(option(1)).toBeInstanceOf(Some)
    expect(option('foo')).toBeInstanceOf(Some)
    expect(option(new Date())).toBeInstanceOf(Some)
  })
})

describe('some', () => {
  it('should be a function.', () => {
    expect(typeof some).toBe('function')
  })

  it('should return `Some` instance.', () => {
    expect(some(null)).toBeInstanceOf(Some)
    expect(some(undefined)).toBeInstanceOf(Some)
    expect(some(1)).toBeInstanceOf(Some)
    expect(some('bar')).toBeInstanceOf(Some)
    expect(some(new Date())).toBeInstanceOf(Some)
  })
})

describe('none', () => {
  it('should be a `None` instance.', () => {
    expect(none).toBeInstanceOf(None)
  })
})

describe('Some', () => {
  it('should be instance of `Option`.', () => {
    expect(some('foo')).toBeInstanceOf(Option)
  })

  describe('#exists', () => {
    it('should return true when the predicate return true.', () => {
      expect(some(1).exists(a => a === 1)).toBe(true)
    })

    it('should return false when the predicate return false.', () => {
      expect(some(1).exists(a => a !== 1)).toBe(false)
    })
  })

  describe('#filter', () => {
    const x = some('foo')

    it('should return itself when the predicate return true.', () => {
      expect(x.filter(a => a === 'foo')).toBe(x)
    })

    it('should return `None` when the predicate return false.', () => {
      expect(x.filter(a => a === 'bar')).toBe(none)
    })
  })

  describe('#filterNot', () => {
    const x = some('foo')

    it('should return `None` when the predicate return true.', () => {
      expect(x.filterNot(a => a === 'foo')).toBe(none)
    })

    it('should return itself when the predicate return false.', () => {
      expect(x.filterNot(a => a === 'bar')).toBe(x)
    })
  })

  describe('#flatMap', () => {
    it('should return the value that given function return.', () => {
      const f = (x: number): Option<string> => x === 2 ? some('foo') : none
      expect(some(2).flatMap(f).get).toBe('foo')
      expect(some(1).flatMap(f)).toBe(none)
    })
  })

  describe('#fold', () => {
    it('should return the value that given function return.', () => {
      expect(some(2).fold(() => -1)(x => x * 3)).toBe(6)
      expect(some(5).fold(() => -1)(x => x * 4)).toBe(20)
    })
  })

  describe('#forAll', () => {
    it('should return true when the predicate return true.', () => {
      expect(some(3).forAll(x => x === 3)).toBe(true)
      expect(some(8).forAll(x => x % 2 === 0)).toBe(true)
    })

    it('should return false when the predicate return false.', () => {
      expect(some(2).forAll(x => x === 3)).toBe(false)
      expect(some(7).forAll(x => x % 2 === 0)).toBe(false)
    })
  })

  describe('#forEach', () => {
    it('should call the procedure.', () => {
      const spy = jest.fn()
      some('foo').forEach(spy)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('foo')
    })
  })

  describe('#get', () => {
    it('should return the option\'s value.', () => {
      expect(some('bar').get === 'bar')
    })
  })

  describe('#getOrElse', () => {
    it('should return the option\'s value.', () => {
      expect(some(123).getOrElse(() => 456) === 123)
      expect(some(123).getOrElse(456) === 123)
    })
  })

  describe('#isDefined', () => {
    it('should be true.', () => {
      expect(some(new Date()).isDefined).toBe(true)
    })
  })

  describe('#isEmpty', () => {
    it('should be false.', () => {
      expect(some('typescript').isEmpty).toBe(false)
    })
  })

  describe('#map', () => {
    it('should return new `Some` instance with the value that the function return.', () => {
      const stub = jest.fn().mockReturnValueOnce(517)
      expect(some(2008).map(stub).get).toBe(517)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledWith(2008)
    })
  })

  describe('#match', () => {
    it('should return the value that function `some` return.', () => {
      const ret = some(2).match({
        some: x => x * 2,
        none: () => 0
      })
      expect(ret === 4)
    })

    it('should NOT call the `none` function.', () => {
      const spy = jest.fn()
      some('foo').match({
        some: x => x.length,
        none: spy
      })
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('#nonEmpty', () => {
    it('should be true.', () => {
      expect(some('option').nonEmpty).toBe(true)
    })
  })

  describe('#orElse', () => {
    it('should return itself.', () => {
      const x = some('foo')
      expect(x.orElse(() => some('bar')) === x)
    })
  })

  describe('#orNull', () => {
    it('should return the option\'s value.', () => {
      expect(some(2016).orNull === 2016)
    })
  })

  describe('#toArray', () => {
    it('should return an array of option\'s value.', () => {
      const xs = some('js').toArray
      expect(Array.isArray(xs) === true)
      expect(xs.length === 1)
      expect(xs[0] === 'js')
    })
  })

  describe('#forComprehension', () => {
    it('should flat map every method except the last, which is mapped', () => {
      const nestedOptions = some({
        anOption: some({
          anotherOption: some({
            finalValue: true
          })
        })
      })
      const result = nestedOptions.forComprehension(
        obj => obj.anOption,
        anOption => anOption.anotherOption,
        anotherOption => anotherOption.finalValue
      )
      expect(result.get === true)
    })
  })

  describe('#toString', () => {
    it('should return the \'Some(2016)\' string', () => {
      expect(some(2016).toString() === 'Some(2016)')
    })

    it('should return the \'Some(false)\' string', () => {
      expect(some(false).toString() === 'Some(false)')
    })

    it('should return the \'Some(toto)\' string', () => {
      expect(some('toto').toString() === 'Some(toto)')
    })
  })
})

describe('None', () => {
  it('should be instance of `Option`.', () => {
    expect(none).toBeInstanceOf(Option)
  })

  describe('#exists', () => {
    it('should return false.', () => {
      expect(none.exists(a => a === 1)).toBe(false)
      expect(none.exists(a => a !== 1)).toBe(false)
    })
  })

  describe('#filter', () => {
    it('should return `none`.', () => {
      expect(none.filter(() => true) === none)
    })

    it('should NOT call the predicate.', () => {
      const stub = jest.fn().mockReturnValue(true)
      none.filter(stub)
      expect(stub).not.toHaveBeenCalled()
    })
  })

  describe('#filterNot', () => {
    it('should return `none`.', () => {
      expect(none.filter(() => false) === none)
    })

    it('should NOT call the predicate.', () => {
      const stub = jest.fn().mockReturnValue(false)
      none.filterNot(stub)
      expect(stub).not.toHaveBeenCalled()
    })
  })

  describe('#flatMap', () => {
    it('should return `none`.', () => {
      expect(none.flatMap(() => some(1)) === none)
    })

    it('should NOT call the function.', () => {
      const stub = jest.fn().mockReturnValue(some(1))
      none.flatMap(stub)
      expect(stub).not.toHaveBeenCalled()
    })
  })

  describe('#fold', () => {
    it('should return `ifEmpty`.', () => {
      const stub = jest.fn().mockReturnValue('foo')
      expect(none.fold(stub)(() => 'bar') === 'foo')
      expect(stub).toHaveBeenCalledTimes(1)
    })

    it('should NOT call the function.', () => {
      const stub = jest.fn().mockReturnValue('bar')
      none.fold(() => 'foo')(stub)
      expect(stub).not.toHaveBeenCalled()
    })
  })

  describe('#forAll', () => {
    it('should return true.', () => {
      expect(none.forAll(() => false)).toBe(true)
    })

    it('should NOT call the predicate.', () => {
      const stub = jest.fn().mockReturnValue(true)
      none.forAll(stub)
      expect(stub).not.toHaveBeenCalled()
    })
  })

  describe('#forEach', () => {
    it('should NOT call the procedure.', () => {
      const stub = jest.fn()
      none.forEach(stub)
      expect(stub).not.toHaveBeenCalled()
    })
  })

  describe('#get', () => {
    it('should throws an error.', () => {
      expect(() => none.get).toThrow('No such element.')
    })
  })

  describe('#getOrElse', () => {
    it('should return `defaultValue`.', () => {
      expect(none.getOrElse(() => 123)).toBe(123)
      expect(none.getOrElse(123)).toBe(123)
    })
  })

  describe('#isDefined', () => {
    it('should be false.', () => {
      expect(none.isDefined).toBe(false)
    })
  })

  describe('#isEmpty', () => {
    it('should be true.', () => {
      expect(none.isEmpty).toBe(true)
    })
  })

  describe('#map', () => {
    it('should return `none`.', () => {
      expect(none.map(() => 1) === none)
    })

    it('should NOT call the function.', () => {
      const stub = jest.fn().mockReturnValue(1234)
      none.map(stub)
      expect(stub).not.toHaveBeenCalled()
    })
  })

  describe('#match', () => {
    it('should return the value that function `none` return.', () => {
      const option: Option<number> = none
      const ret = option.match({
        some: x => x * 2,
        none: () => 1234
      })
      expect(ret === 1234)
    })

    it('should NOT call the `none` function.', () => {
      const spy = jest.fn()
      none.match({
        some: spy,
        none: () => 'MOMOIRO CLOVER Z'
      })
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('#nonEmpty', () => {
    it('should be false.', () => {
      expect(none.nonEmpty).toBe(false)
    })
  })

  describe('#orElse', () => {
    it('should return `alternative` value.', () => {
      expect(none.orElse(() => some('foo')).get === 'foo')
    })
  })

  describe('#orNull', () => {
    it('should return null.', () => {
      expect(none.orNull === null)
    })
  })

  describe('#toArray', () => {
    it('should return an empty array.', () => {
      const xs = none.toArray
      expect(Array.isArray(xs) === true)
      expect(xs.length === 0)
    })
  })

  describe('#forComprehension', () => {
    it('should return none', () => {
      const nestedOptions = some({
        anOption: some({
          anotherOption: none
        })
      })
      const result = nestedOptions.forComprehension(
        obj => obj.anOption,
        anOption => anOption.anotherOption,
        anotherOption => anotherOption.finalValue
      )
      expect(result === none)
    })
  })

  describe('#toString', () => {
    it('should return \'None\'', () => {
      expect(none.toString() === 'None')
    })
  })
})
