import parseArgs from 'jasmine-es6/lib/parse-args';

describe('parseArgs', () => {
  it('returns an object containing the parsed arguments', () => {
    expect(
      parseArgs(
        [1, 0],
        {num1: Number, num2: Number},
        ['num1', 'num2']
      )
    ).toEqual({num1: 1, num2: 0});
  });

  it('parses against the first matched signature', () => {
    expect(
      parseArgs(
        [1, 0],
        {num1: Number, num2: Number},
        ['num1', 'num2'],
        ['num2', 'num1']
      )
    ).toEqual({num1: 1, num2: 0});

    expect(
      parseArgs(
        [1, 'foo'],
        {num: Number, str: String},
        ['str', 'num'],
        ['num', 'str']
      )
    ).toEqual({num: 1, str: 'foo'});

    expect(
      parseArgs(
        [1, 'foo'],
        {num1: Number, str: String, num2: Number},
        ['num1', 'str', 'num2'],
        ['num1', 'str'],
        ['str', 'num2'],
      )
    ).toEqual({num1: 1, str: 'foo'});
  });

  it('can parse multiple types', () => {
    function fn() {}
    const arr = [], obj = {};
    expect(
      parseArgs(
        [true, 1, 'foo', fn, arr, obj],
        {
          bool: Boolean,
          num: Number,
          str: String,
          fn: Function,
          arr: Array,
          obj: Object
        },
        ['bool', 'num', 'str', 'fn', 'arr', 'obj']
      )
    ).toEqual({bool: true, num: 1, str: 'foo', fn, arr, obj});
  });

  it('returns an empty object if the given arguments match none of the signatures', () => {
    expect(
      parseArgs(
        [1, 'foo'],
        {num1: Number, num2: Number},
        ['num1', 'num2']
      )
    ).toEqual({});

    expect(
      parseArgs(
        [1, 2],
        {num1: Number, num2: Number, num3: Number},
        ['num1', 'num2', 'num3']
      )
    ).toEqual({});

    expect(
      parseArgs(
        [1, 2, 3],
        {num1: Number, num2: Number, num3: Number},
        ['num1', 'num2']
      )
    ).toEqual({});
  });
});
