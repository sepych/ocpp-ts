import { Protocol } from '../src/Protocol';
import schemas, { formatSchemaAction } from '../src/schemas';
import { CentralSystem } from "../src";

describe('OcppProtocol', () => {
  it('should remove "Request" postfix from schema title', () => {
    const action = formatSchemaAction(schemas.StartTransaction.title);
    expect(action).toBe('StartTransaction');
  });

  it('should remove "Request" postfix only if it is at the end of the string', () => {
    const action = formatSchemaAction('StartRequestOfRequest');
    expect(action).toBe('StartRequestOf');
  });

  it('should extract cp id from the url', () => {
    const cpId = CentralSystem.getCpIdFromUrl('/ocpp/service/CP5612')
    expect(cpId).toBe('CP5612');
  });

  it('should extract cp and decode correctly', () => {
    const cpId = CentralSystem.getCpIdFromUrl('/ocpp/service/CP%205612')
    expect(cpId).toBe('CP 5612');
  });

  it('should return undefined cp id if provided with undefined input', () => {
    const cpId = CentralSystem.getCpIdFromUrl(undefined)
    expect(cpId).toBe(undefined);
  });
});
