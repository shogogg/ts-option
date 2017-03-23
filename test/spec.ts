/**
 * Copyright (c) 2016 shogogg <shogo@studofly.net>
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
import * as assert from "power-assert";
import * as sinon from "sinon";
import {none, option, some, None, Option, Some} from "../index";

describe("option", () => {

  it("should be a function.", () => assert(typeof option === "function"));
  it("should returns `none` when null given.", () => assert(option(null) === none));
  it("should returns `none` when undefined given.", () => assert(option(undefined) === none));
  it("should returns `Some` instance when non-empty value given.", () => {
    assert(option(1) instanceof Some);
    assert(option("foo") instanceof Some);
    assert(option(new Date) instanceof Some);
  });

});

describe("some", () => {

  it("should be a function.", () => assert(typeof some === "function"));
  it("should returns `Some` instance.", () => {
    assert(some(null) instanceof Some);
    assert(some(undefined) instanceof Some);
    assert(some(1) instanceof Some);
    assert(some("bar") instanceof Some);
    assert(some(new Date) instanceof Some);
  });

});

describe("none", () => {

  it("should be a `None` instance.", () => assert(none instanceof None));

});

describe("Some", () => {

  it("should be instance of `Option`.", () => {
    assert(some("foo") instanceof Option === true);
  });

  describe("#exists", () => {
    it("should returns true when the predicate returns true.", () => assert(some(1).exists(a => a === 1) === true));
    it("should returns false when the predicate returns false.", () => assert(some(1).exists(a => a !== 1) === false));
  });

  describe("#filter", () => {
    let x = some("foo");
    it("should returns itself when the predicate returns true.", () => assert(x.filter(a => a === "foo") === x));
    it("should returns `None` when the predicate returns false.", () => assert(x.filter(a => a === "bar") === none));
  });

  describe("#filterNot", () => {
    let x = some("foo");
    it("should returns `None` when the predicate returns true.", () => assert(x.filterNot(a => a === "foo") === none));
    it("should returns itself when the predicate returns false.", () => assert(x.filterNot(a => a === "bar") === x));
  });

  describe("#flatMap", () => {
    it("should returns the value that given function returns.", () => {
      let f = (x: number): Option<string> => {
        return x === 2 ? some("foo") : none;
      };
      assert(some(2).flatMap(f).get === "foo");
      assert(some(1).flatMap(f) === none);
    });
  });

  describe("#fold", () => {
    it("should returns the value that given function returns.", () => {
      assert(some(2).fold(() => -1)(x => x * 3) === 6);
      assert(some(5).fold(() => -1)(x => x * 4) === 20);
    });
  });

  describe("#forAll", () => {
    it("should returns true when the predicate returns true.", () => {
      assert(some(3).forAll(x => x === 3) === true);
      assert(some(8).forAll(x => x % 2 === 0) === true);
    });
    it("should returns false when the predicate returns false.", () => {
      assert(some(2).forAll(x => x === 3) === false);
      assert(some(7).forAll(x => x % 2 === 0) === false);
    });
  });

  describe("#forEach", () => {
    it("should calls the procedure.", () => {
      let spy = sinon.spy();
      some("foo").forEach(spy);
      assert(spy.callCount === 1);
      assert(spy.firstCall.args.length === 1);
      assert(spy.firstCall.args[0] === "foo");
    });
  });

  describe("#get", () => {
    it("should returns the option's value.", () => assert(some("bar").get === "bar"));
  });

  describe("#getOrElse", () => {
    it("should returns the option's value.", () => {
      assert(some(123).getOrElse(() => 456) === 123);
      assert(some(123).getOrElse(456) === 123);
    });
  });

  describe("#isDefined", () => {
    it("should be true.", () => assert(some(new Date).isDefined === true));
  });

  describe("#isEmpty", () => {
    it("should be false.", () => assert(some("typescript").isEmpty === false));
  });

  describe("#map", () => {
    it("should returns new `Some` instance with the value that the function returns.", () => {
      let stub = sinon.stub().withArgs(2008).returns(517);
      assert(some(2008).map(stub).get === 517);
      assert(stub.callCount === 1);
      assert(stub.firstCall.args[0] === 2008);
      assert(stub.firstCall.returnValue === 517);
    });
  });

  describe("#match", () => {
    it("should returns the value that function `some` returns.", () => {
      let ret = some(2).match({
        some: x => x * 2,
        none: () => 0,
      });
      assert(ret === 4);
    });
    it("should NOT call the `none` function.", () => {
      let spy = sinon.spy();
      some("foo").match({
        some: x => x.length,
        none: spy,
      });
      assert(spy.callCount === 0);
    });
  });

  describe("#nonEmpty", () => {
    it("should be true.", () => assert(some("option").nonEmpty === true));
  });

  describe("#orElse", () => {
    let x = some("foo"), y = some("bar");
    it("should returns itself.", () => assert(x.orElse(() => y) === x));
  });

  describe("#orNull", () => {
    it("should returns the option's value.", () => assert(some(2016).orNull === 2016));
  });

  describe("#toArray", () => {
    it("should returns an array of option's value.", () => {
      let xs = some("js").toArray;
      assert(Array.isArray(xs) === true);
      assert(xs.length === 1);
      assert(xs[0] === "js");
    });
  });

  describe("#forComprehension", () => {
    it("should flat map every method except the last, which is mapped", () => {
      const nestedOptions = some({
        anOption: some({
          anotherOption: some({
            finalValue: true
          })
        })
      });

      const result = nestedOptions.forComprehension(
        obj => obj.anOption,
        anOption => anOption.anotherOption,
        anotherOption => anotherOption.finalValue
      );

      assert(result.get === true);
    });
  });
});

describe("None", () => {

  it("should be instance of `Option`.", () => {
    assert(none instanceof Option === true);
  });

  describe("#exists", () => {
    it("should returns false.", () => {
      assert(none.exists(a => a === 1) === false);
      assert(none.exists(a => a !== 1) === false);
    });
  });

  describe("#filter", () => {
    it("should returns `none`.", () => assert(none.filter(() => true) === none));
    it("should NOT calls the predicate.", () => {
      let stub = sinon.stub().returns(true);
      none.filter(stub);
      assert(stub.called === false);
    });
  });

  describe("#filterNot", () => {
    it("should returns `none`.", () => assert(none.filter(() => false) === none));
    it("should NOT calls the predicate.", () => {
      let stub = sinon.stub().returns(false);
      none.filterNot(stub);
      assert(stub.called === false);
    });
  });

  describe("#flatMap", () => {
    it("should returns `none`.", () => assert(none.flatMap(() => some(1)) === none));
    it("should NOT calls the function.", () => {
      let stub = sinon.stub().returns(some(1));
      none.flatMap(stub);
      assert(stub.called === false);
    });
  });

  describe("#fold", () => {
    it("should return `ifEmpty`.", () => {
      let stub = sinon.stub().returns("foo");
      assert(none.fold(stub)(() => "bar") === "foo");
      assert(stub.callCount === 1);
    });
    it("should NOT calls the function.", () => {
      let stub = sinon.stub().returns("bar");
      none.fold(() => "foo")(stub);
      assert(stub.called === false);
    });
  });

  describe("#forAll", () => {
    it("should returns false.", () => assert(none.forAll(() => true) === false));
    it("should NOT calls the predicate.", () => {
      let stub = sinon.stub().returns(true);
      none.forAll(stub);
      assert(stub.called === false);
    });
  });

  describe("#forEach", () => {
    it("should NOT calls the procedure.", () => {
      let stub = sinon.stub();
      none.forEach(stub);
      assert(stub.called === false);
    });
  });

  describe("#get", () => {
    it("should throws an error.", () => {
      assert.throws(() => none.get, error => {
        assert(error.message === "No such element.");
        return true;
      });
    });
  });

  describe("#getOrElse", () => {
    it("should returns `defaultValue`.", () => {
      assert(none.getOrElse(() => 123) === 123);
      assert(none.getOrElse(123) === 123);
    });
  });

  describe("#isDefined", () => {
    it("should be false.", () => assert(none.isDefined === false));
  });

  describe("#isEmpty", () => {
    it("should be true.", () => assert(none.isEmpty === true));
  });

  describe("#map", () => {
    it("should returns `none`.", () => assert(none.map(() => 1) === none));
    it("should NOT calls the function.", () => {
      let stub = sinon.stub().returns(1234);
      none.map(stub);
      assert(stub.callCount === 0);
    });
  });

  describe("#match", () => {
    it("should returns the value that function `none` returns.", () => {
      let option: Option<number> = none;
      let ret = option.match({
        some: x => x * 2,
        none: () => 1234,
      });
      assert(ret === 1234);
    });
    it("should NOT call the `none` function.", () => {
      let spy = sinon.spy();
      none.match({
        some: spy,
        none: () => "MOMOIRO CLOVER Z",
      });
      assert(spy.callCount === 0);
    });
  });

  describe("#nonEmpty", () => {
    it("should be false.", () => assert(none.nonEmpty === false));
  });

  describe("#orElse", () => {
    it("should returns `alternative` value.", () => assert(none.orElse(() => some("foo")).get === "foo"));
  });

  describe("#orNull", () => {
    it("should returns null.", () => assert(none.orNull === null));
  });

  describe("#toArray", () => {
    it("should returns an empty array.", () => {
      let xs = none.toArray;
      assert(Array.isArray(xs) === true);
      assert(xs.length === 0);
    });
  });

  describe("#forComprehension", () => {
    it("should return none", () => {
      const nestedOptions = some({
        anOption: some({
          anotherOption: none
        })
      });

      const result = nestedOptions.forComprehension(
        obj => obj.anOption,
        anOption => anOption.anotherOption,
        anotherOption => anotherOption.finalValue
      );

      assert(result === none);
    });
  });


});
