import { Protocol } from '../src/Protocol';
import schemas, { formatSchemaAction } from '../src/schemas';

describe('OcppProtocol', () => {
  it('should remove "Request" postfix from schema title', () => {
    const action = formatSchemaAction(schemas.StartTransaction.title);
    expect(action).toBe('StartTransaction');
  });

  it('should remove "Request" postfix only if it is at the end of the string', () => {
    const action = formatSchemaAction('StartRequestOfRequest');
    expect(action).toBe('StartRequestOf');
  });
});
