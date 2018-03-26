import {
  getContentLengthFromCLF,
  getDateFromCLF,
  getHttpEndpointFromCLF,
  getHttpMethodFromCLF,
  getHttpProtocolFromCLF,
  getIPAddressFromCLF,
  getStatusCodeFromCLF,
  getUserIdentifierFromCLF,
  getUsernameFromCLF
} from './common-log';

describe('Common Log', () => {
  describe('getStatusCodeFromCLF', () => {
    it('should get 200 back', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getStatusCodeFromCLF(sampleLog);
      expect(result).toEqual(200);
    });

    it('should throw an exception on bogus input', () => {
      const sampleLog = `taco`;
      try {
        const result = getStatusCodeFromCLF(sampleLog);
        fail();
      } catch (ex) {
      }
    });
    
  });

  describe('getContentLengthFromCLF', () => {
    it('should get 2326 back', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getContentLengthFromCLF(sampleLog);
      expect(result).toEqual(2326);
    });

    it('should throw an exception on bogus input', () => {
      const sampleLog = `taco`;
      try {
        const result = getContentLengthFromCLF(sampleLog);
        fail();
      } catch (ex) {
      }
    });

    it('should throw when content length is not a valid number', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 ted`;
      try {
        const result = getContentLengthFromCLF(sampleLog);
        fail();
      } catch (ex) {
      }
    });
  });

  describe('getHttpMethodFromCLF', () => {
    it('should return GET', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getHttpMethodFromCLF(sampleLog);
      expect(result).toEqual('GET');
    });
  });

  describe('getHttpEndpointFromCLF', () => {
    it('should get the endpoint', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getHttpEndpointFromCLF(sampleLog);
      expect(result).toEqual('/apache_pb.gif');
    });
  });

  describe('getHttpProtocolFromCLF', () => {
    it('should get the protocol', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getHttpProtocolFromCLF(sampleLog);
      expect(result).toEqual('HTTP/1.0');
    });
  });

  describe('getDateFromCLF', () => {
    it('should return a correct date object with the corrent time', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getDateFromCLF(sampleLog);
      // TODO - we know the timestamp is being ignored for now
      expect(result.toString()).toEqual('Tue Oct 10 2000 13:55:36 GMT-0500 (CDT)');
    });

    it('should handle single digits for some fields', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [1/Jan/2000:1:1:1 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getDateFromCLF(sampleLog);
      // TODO - we know the timestamp is being ignored for now
      expect(result.toString()).toEqual('Sat Jan 01 2000 01:01:01 GMT-0600 (CST)');
    });
  });

  describe('getUsernameFromCLF', () => {
    it('should return the username', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getUsernameFromCLF(sampleLog);
      expect(result).toEqual('frank');
    });

    it('should return null when filled with the -', () => {
      const sampleLog = `127.0.0.1 user-identifier - [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getUsernameFromCLF(sampleLog);
      expect(result).toEqual(null);
    });
  });

  describe('getUserIdentifierFromCLF', () => {
    it('should return the user identifier', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getUserIdentifierFromCLF(sampleLog);
      expect(result).toEqual('user-identifier');
    });

    it('should return the user identifier', () => {
      const sampleLog = `127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getUserIdentifierFromCLF(sampleLog);
      expect(result).toEqual(null);
    });
  });

  describe('getIPAddressFromCLF', () => {
    it('should return the ip address', () => {
      const sampleLog = `127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326`;
      const result = getIPAddressFromCLF(sampleLog);
      expect(result).toEqual('127.0.0.1');
    });
  });
});
