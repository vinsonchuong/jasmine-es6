import parseArgs from 'jasmine-es6/lib/parse-args';

fdescribe('parseArgs', function() {
  it('returns an object containing the parsed arguments', function() {
    expect(
      parseArgs(
        [1, 0],
        {x: Number, y: Number},
        ['x', 'y']
      )
    ).toEqual({x: 1, y: 0});
  });

  it('parses against the first matched signature', function() {
    expect(
      parseArgs(
        [1, 0],
        {x: Number, y: Number},
        ['x', 'y'],
        ['y', 'x']
      )
    ).toEqual({x: 1, y: 0});

    expect(
      parseArgs(
        [1, 'foo'],
        {x: Number, y: String},
        ['y', 'x'],
        ['x', 'y']
      )
    ).toEqual({x: 1, y: 'foo'});

    expect(
      parseArgs(
        [1, 'foo'],
        {x: Number, y: String, z: Number},
        ['x', 'y', 'z'],
        ['x', 'y'],
        ['y', 'z'],
      )
    ).toEqual({x: 1, y: 'foo'});
  });

  it('can parse multiple types', function() {
    const fn = () => {}, arr = [], obj = {};
    expect(
      parseArgs(
        [true, 1, 'foo', fn, arr, obj],
        {x: Boolean, y: Number, z: String, a: Function, b: Array, c: Object},
        ['x', 'y', 'z', 'a', 'b', 'c']
      )
    ).toEqual({x: true, y: 1, z: 'foo', a: fn, b: arr, c: obj});
  });

  it('returns an empty object if the given arguments match none of the signatures', function() {
    expect(
      parseArgs(
        [1, 'foo'],
        {x: Number, y: Number},
        ['x', 'y']
      )
    ).toEqual({});

    expect(
      parseArgs(
        [1, 2],
        {x: Number, y: Number, z: Number},
        ['x', 'y', 'z']
      )
    ).toEqual({});

    expect(
      parseArgs(
        [1, 2, 3],
        {x: Number, y: Number, z: Number},
        ['x', 'y']
      )
    ).toEqual({});
  });
});
