## ts-option
Scala like `Option` type for TypeScript/JavaScript.


### Install
```
$ npm install --save ts-option
```


### Usage
#### TypeScript
```
import {Option, option, some, none} from "ts-deferred";

let a: Option<number> = option(1);    // Some(1)
let c: Option<number> = some(2);      // Some(2)
let b: Option<number> = option(null); // None
let d: Option<number> = none;         // None
```

#### JavaScript (ES2015/ES6)
```
import {Option, option, some, none} from "ts-deferred";

let a = option(1);    // Some(1)
let c = some(2);      // Some(2)
let b = option(null); // None
let d = none;         // None
```


### API
#### `option<A>(valiue: A): Option<A>`
Create an `Option` instance from a value.
It returns `Some<A>` when the value is not null/undefined, otherwise returns `None`.

#### `some<A>(value: A): Some<A>`
Create an `Some` instance from a value.
It returns `Some<A>` even if the value is null or undefined.

#### `none: None`
The `None` type singleton object.

#### `option<A>(...).exists(p: (_: A) => boolean): boolean`
Returns true if the option is non-empty and the predicate p returns true when applied to the option's value.

#### `option<A>(...).filter(p: (_: A) => boolean): Option<A>`
Returns the option if it is non-empty and applying the predicate p to the option's value returns true.

#### `option<A>(...).filterNot(p: (_: A) => boolean): Option<A>`
Returns the option if it is non-empty and applying the predicate p to the option's value returns false.

#### `option<A>(...).flatMap<B>(f: (_: A) => Option<B>): Option<B>`
Returns the result of applying f to the option's value if the option is non-empty, otherwise returns `None`.

#### `option<A>(...).fold<B>(ifEmpty: () => B)(f: (_: A) => B): B`
Returns the result of applying f to the option's value if the option is non-empty, otherwise returns `ifEmpty` value.

#### `option<A>(...).forAll(p: (_: A) => boolean): boolean`
Tests whether a predicate holds for all elements of the option.

#### `option<A>(...).forEach(f: (_: A) => any): void`
Apply the given procedure f to the option's value if it is non-empty, otherwise do nothing.

#### `option<A>(...).get: A`
Returns the option's value if the option is non-empty, otherwise throws an error.

#### `option<A>(...).getOrElse(defaultValue: () => A): A`
Returns the option's value if the option is non-empty, otherwise return the result of evaluating default.

#### `option<A>(...).isDefined: boolean`
Returns true if the option's value is non-empty, false otherwise.

#### `option<A>(...).isEmpty: boolean`
Returns true if the option's value is empty, false otherwise.

#### `option<A>(...).map<B>(f: (_: A) => B): Option<B>`
Builds a new option by applying a function to all elements of this option.

#### `option<A>(...).nonEmpty: boolean`
Returns true if the option is an instance of `Some`, false otherwise.

#### `option<A>(...).orElse(alternative: () => Option<A>): Option<A>`
Returns the option itself if it is non-empty, otherwise return the result of evaluating alternative.

#### `option<A>(...).orNull: A`
Returns the option's value if it is non-empty, or null if it is empty.

#### `option<A>(...).toArray: Array<A>`
Converts the option to an array.

### License
MIT
