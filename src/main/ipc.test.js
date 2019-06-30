import { generateCredentials } from './ipcHandler';
import { assert } from 'chai';

describe('IPC handlers', () => {
  describe('generateCredentials', () => {
    it('should return an error object when an unexpected exception occures.', () => {
      const result = generateCredentials({
        accountId: 31,
        email: 'phouse512@gmail.com',
        masterPass: 'himynameisphil',
      });
    })
  });
})