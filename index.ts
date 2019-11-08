/**
 * Copyright (c) 2019 shogogg <shogo@studofly.net>
 *
 * This software is released under the MIA License.
 * http://opensource.org/licenses/mit-license.php
 */
export interface Matcher<A, B> {
  some: (_: A) => B
  none: () => B
}

export interface OptionLike<A> {
  /**
   * Returns true if the option is non-empty and the predicate p returns true when applied to the option's value.
   */
  exists (p: (_: A) => boolean): boolean

  /**
   * Returns the option if it is non-empty and applying the predicate p to the option's value returns true.
   */
  filter (p: (_: A) => boolean): Option<A>

  /**
   * Returns the option if it is non-empty and applying the predicate p to the option's value returns false.
   */
  filterNot (p: (_: A) => boolean): Option<A>

  /**
   * Returns the result of applying f to the option's value if the option is non-empty.
   */
  flatMap<B> (f: (_: A) => Option<B>): Option<B>

  /**
   * Returns the result of applying f to the option's value if the option is non-empty.
   * Otherwise, evaluates expression ifEmpty.
   */
  fold<B> (ifEmpty: () => B): (f: (_: A) => B) => B

  /**
   * Tests whether a predicate holds for all elements of the option.
   */
  forAll (p: (_: A) => boolean): boolean

  /**
   * Performs a for-comprehension like flatMap and map operation using the given functions
   */
  forComprehension (...fns: ((x: any) => Option<any>)[]): Option<any>

  /**
   * Apply the given procedure f to the option's value, if it is non-empty.
   */
  forEach (f: (_: A) => void): void

  /**
   * Returns the option's value if the option is non-empty, otherwise throws an error.
   */
  readonly get: A

  /**
   * Returns the option's value if the option is non-empty, otherwise return the result of evaluating defaultValue.
   */
  getOrElse (defaultValue: () => A): A

  /**
   * Returns the option's value if the option is non-empty, otherwise return defaultValue.
   */
  getOrElseValue (defaultValue: A): A

  /**
   * Returns true if the option's value is non-empty, false otherwise.
   */
  readonly isDefined: boolean

  /**
   * Returns true if the option's value is empty, false otherwise.
   */
  readonly isEmpty: boolean

  /**
   * Builds a new option by applying a function to all elements of this option.
   */
  map<B> (f: (_: A) => B): Option<B>

  /**
   * Pattern match signature.
   */
  match<B> (matcher: Matcher<A, B>): B

  /**
   * Returns true if the option's value is non-empty, false otherwise.
   */
  readonly nonEmpty: boolean

  /**
   * Returns the option itself if it is non-empty, otherwise return the result of evaluating alternative.
   */
  orElse (alternative: () => Option<A>): Option<A>

  /**
   * Returns the option itself if it is non-empty, otherwise return the alternative.
   */
  orElseValue (alternative: Option<A>): Option<A>

  /**
   * Returns the option's value if it is non-empty, or null if it is empty.
   */
  readonly orNull: A | null

  /**
   * Returns the option's value if it is non-empty, or undefined if it is empty.
   */
  readonly orUndefined: A | undefined

  /**
   * Converts the option to an array.
   */
  readonly toArray: A[]

  /**
   * Returns a string representation
   */
  toString (): string

}

export abstract class Option<A> implements OptionLike<A> {
  abstract exists (p: (_: A) => boolean): boolean

  abstract filter (p: (_: A) => boolean): Option<A>

  abstract filterNot (p: (_: A) => boolean): Option<A>

  abstract flatMap<B> (f: (_: A) => Option<B>): Option<B>

  abstract fold<B> (ifEmpty: () => B): (f: (_: A) => B) => B

  abstract forAll (p: (_: A) => boolean): boolean

  abstract forComprehension (...fns: ((x: any) => Option<any>)[]): Option<any>

  abstract forEach (f: (_: A) => void): void

  readonly get: A

  abstract getOrElse (defaultValue: () => A): A

  abstract getOrElseValue (defaultValue: A): A

  readonly isDefined: boolean
  readonly isEmpty: boolean

  abstract map<B> (f: (_: A) => B): Option<B>

  abstract match<B> (matcher: Matcher<A, B>): B

  readonly nonEmpty: boolean

  abstract orElse (alternative: () => Option<A>): Option<A>

  abstract orElseValue (alternative: Option<A>): Option<A>

  readonly orNull: A | null
  readonly orUndefined: A | undefined
  readonly toArray: A[]

  abstract toString (): string
}

export class Some<A> extends Option<A> implements OptionLike<A> {
  constructor (private readonly value: A) {
    super()
  }

  exists (p: (_: A) => boolean): boolean {
    return p(this.value)
  }

  filter (p: (_: A) => boolean): Option<A> {
    return p(this.value) ? this : none
  }

  filterNot (p: (_: A) => boolean): Option<A> {
    return p(this.value) ? none : this
  }

  flatMap<B> (f: (_: A) => Option<B>): Option<B> {
    return f(this.value)
  }

  fold<B> (/* ifEmpty: () => B) */): (f: (_: A) => B) => B {
    return f => f(this.value)
  }

  forAll (p: (_: A) => boolean): boolean {
    return p(this.value)
  }

  forComprehension (...fns: ((x: any) => Option<any>)[]): Option<any> {
    let result: Option<any> = this
    for (let i = 0; i < fns.length - 1; ++i) {
      result = result.flatMap<any>(fns[i])
    }
    return result.map(fns[fns.length - 1])
  }

  forEach (f: (_: A) => void): void {
    return f(this.value)
  }

  get get (): A {
    return this.value
  }

  getOrElse (/* defaultValue: () => A) */): A {
    return this.value
  }

  getOrElseValue (/* defaultValue: A */): A {
    return this.value
  }

  get isDefined (): boolean {
    return true
  }

  get isEmpty (): boolean {
    return false
  }

  map<B> (f: (_: A) => B): Option<B> {
    return some(f(this.value))
  }

  match<B> (matcher: Matcher<A, B>): B {
    return matcher.some(this.value)
  }

  get nonEmpty (): boolean {
    return true
  }

  orElse (/* alternative: () => Option<A> */): Option<A> {
    return this
  }

  orElseValue (/* alternative: Option<A> */): Option<A> {
    return this
  }

  get orNull (): A | null {
    return this.value
  }

  get orUndefined (): A | undefined {
    return this.value
  }

  get toArray (): A[] {
    return [this.value]
  }

  toString (): string {
    return 'Some(' + this.value + ')'
  }
}

export class None<A> extends Option<A> implements OptionLike<A> {
  exists (/* p: (_: A) => boolean */): boolean {
    return false
  }

  filter (/* p: (_: A) => boolean */): Option<A> {
    return this
  }

  filterNot (/* p: (_: A) => boolean */): Option<A> {
    return this
  }

  flatMap<B> (/* f: (_: A) => Option<B> */): Option<B> {
    return none
  }

  fold<B> (ifEmpty: () => B): (f: (_: A) => B) => B {
    return () => ifEmpty()
  }

  forAll (/* p: (_: A) => boolean */): boolean {
    return true
  }

  forComprehension (/* ...fns: ((x: any) => Option<any>)[] */): Option<any> {
    return none
  }

  forEach (): void {
    // do nothing.
  }

  get get (): A {
    throw new Error('No such element.')
  }

  getOrElse (defaultValue: () => A): A {
    return defaultValue()
  }

  getOrElseValue (defaultValue: A): A {
    return defaultValue
  }

  get isDefined (): boolean {
    return false
  }

  get isEmpty (): boolean {
    return true
  }

  map<B> (/* f: (_: A) => B */): Option<B> {
    return none
  }

  match<B> (matcher: Matcher<A, B>): B {
    return matcher.none()
  }

  get nonEmpty (): boolean {
    return false
  }

  orElse (alternative: () => Option<A>): Option<A> {
    return alternative()
  }

  orElseValue (alternative: Option<A>): Option<A> {
    return alternative
  }

  get orNull (): A | null {
    return null
  }

  get orUndefined (): A | undefined {
    return undefined
  }

  get toArray (): Array<A> {
    return []
  }

  toString (): string {
    return 'None'
  }
}

export function some<A> (value: A): Option<A> {
  return new Some(value)
}

export const none: Option<never> = new None()

export function option<A> (value?: A | null): Option<A> {
  return value === null || typeof value === 'undefined' ? none : some(value)
}
