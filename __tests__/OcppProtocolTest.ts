import { Protocol } from '../src/Protocol';
import schemas from '../src/schemas';

describe('OcppProtocol', () => {
  it('should remove "Request" postfix from schema title', () => {
    const action = Protocol.formatSchemaAction(schemas.StartTransaction.title);
    expect(action).toBe('StartTransaction');
  });

  it('should remove "Request" postfix only if it is at the end of the string', () => {
    const action = Protocol.formatSchemaAction('StartRequestOfRequest');
    expect(action).toBe('StartRequestOf');
  });

  it('should add "Request" postfix at the end of the string', () => {
    const action = Protocol.deFormatSchemaAction('StartTransaction');
    expect(action).toBe(schemas.StartTransaction.title);
  });
});
