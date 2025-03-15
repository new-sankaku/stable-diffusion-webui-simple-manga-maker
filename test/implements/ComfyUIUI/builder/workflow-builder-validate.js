class NodeValidator {
  validateInputs(type, inputs) {
   if (!type.input.required) return true;
   for (const [param, [paramType, constraints]] of Object.entries(
    type.input.required
   )) {
    if (!inputs[param] && !constraints.default && !Array.isArray(inputs[param]))
     throw new Error(`Missing required param: ${param}`);
    if (constraints.min !== undefined && inputs[param] < constraints.min)
     throw new Error(`${param} below min: ${constraints.min}`);
    if (constraints.max !== undefined && inputs[param] > constraints.max)
     throw new Error(`${param} above max: ${constraints.max}`);
    if (Array.isArray(paramType) && !paramType.includes(inputs[param]))
     throw new Error(`Invalid value for ${param}`);
   }
  }
 
  validateConnection(fromType, fromPort, toType, toParam) {
   if (!fromType.output || !toType.input.required)
    throw new Error("Invalid type definition");
   const outputType = fromType.output[fromPort];
   const inputType = toType.input.required[toParam]?.[0];
   if (!outputType || !inputType) throw new Error("Invalid port or param");
   if (outputType !== inputType) throw new Error("Type mismatch");
   return true;
  }
 }