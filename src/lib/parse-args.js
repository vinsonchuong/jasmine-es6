function type(value) {
  if (typeof value === 'boolean') {
    return Boolean;
  } else if (typeof value === 'number') {
    return Number;
  } else if (typeof value === 'string') {
    return String;
  } else if (typeof value === 'function') {
    return Function;
  } else if (Array.isArray(value)) {
    return Array;
  }

  return Object;
}

function matchSignature(args, variables, signature) {
  return signature.length === args.length &&
    signature.every((name, index) => variables[name] === type(args[index]));
}

function findSignature(args, variables, signatures) {
  for (const signature of signatures) {
    if (matchSignature(args, variables, signature)) {
      return signature;
    }
  }
}

export default function parseArgs(args, variables, ...signatures) {
  const signature = findSignature(args, variables, signatures);
  return signature ?
    signature.reduce(
      (parsedArgs, name, index) =>
        Object.assign(parsedArgs, {[name]: args[index]}),
      {}
    ) :
    {};
}
