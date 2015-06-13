function type(value) {
  return (
    typeof value === 'boolean' ? Boolean :
    typeof value === 'number' ? Number :
    typeof value === 'string' ? String :
    typeof value === 'function' ? Function :
    Array.isArray(value) ? Array :
    Object
  );
}

function matchSignature(args, variables, signature) {
  return signature.length === args.length &&
    signature.every((name, i) => variables[name] === type(args[i]));
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
      (parsedArgs, name, i) => Object.assign(parsedArgs, {[name]: args[i]}),
      {}
    ) :
    {};
}
