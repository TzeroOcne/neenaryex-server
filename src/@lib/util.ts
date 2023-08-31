export const encryptPayload = (payload:Record<string|number|symbol,unknown>) =>
  Buffer.from(JSON.stringify(payload)).toString('base64');

export const decryptPayloadString = <T>(payloadString:string):T =>
  JSON.parse(Buffer.from(payloadString, 'base64').toString());