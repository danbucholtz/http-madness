
import { processTCPDumpOutput } from './tcp-dump-listener';

describe('TCP Dump Listener', () => {
  describe('processTCPDumpOutput', () => {
    it('should return the individual packets and the remaining parts of the input that are not used', () => {

      const firstLine = 
`listening on lo0, link-type NULL (BSD loopback), capture size 262144 bytes`;

      const firstPacket = 
`
22:33:21.230879 IP localhost.65003 > localhost.http-alt: Flags [FP.], seq 1898704876:1898704946, ack 1524027852, win 12759, options [nop,nop,TS val 755075381 ecr 754552319], length 70: HTTP: GET /taco/time/2 HTTP/1.1
E..z..@.@...............q+..Z.....1..n.....
-..5,...GET /taco/time/2 HTTP/1.1
host: localhost:8080
Connection: close`

      const secondPacket = 
`
22:33:21.239775 IP localhost.65419 > localhost.http-alt: Flags [P.], seq 520731542:520731622, ack 323539356, win 12759, options [nop,nop,TS val 755075389 ecr 755075389], length 80: HTTP: GET /burrito/chicken/green HTTP/1.1
E.....@.@................	...H....1..x.....
-..=-..=GET /burrito/chicken/green HTTP/1.1
host: localhost:8080
Connection: close`


      const firstHalfThirdPacket = 
`
22:33:21.252546 IP localhost.55472 > localhost.http-alt: Flags [FP.], seq 2668524686:2668524756, ack 1023710772, win 12759, options [nop,nop,TS val 755075401 ecr 754514895], length 70: HTTP: GET /taco/tim`

      const secondHalfThirdPacket = 
`e/2 HTTP/1.1
E..z..@.@.................t.=..4..1..n.....
-..I,...GET /taco/time/2 HTTP/1.1
host: localhost:8080
Connection: close`

      const fourthPacket = 
`
22:33:21.260204 IP localhost.55473 > localhost.http-alt: Flags [FP.], seq 3096857343:3096857414, ack 3887507662, win 12759, options [nop,nop,TS val 755075407 ecr 754514896], length 71: HTTP: GET /burrito/bean HTTP/1.1
E..{..@.@.................J.......1..o.....
-..O,...GET /burrito/bean HTTP/1.1
host: localhost:8080
Connection: close`


      const fifthPacket =
`
22:33:22.241698 IP localhost.65420 > localhost.http-alt: Flags [P.], seq 717278986:717279051, ack 899608645, win 12759, options [nop,nop,TS val 755076387 ecr 755076387], length 65: HTTP: GET /banana HTTP/1.1
E..u..@.@...............*..
5..E..1..i.....
-..#-..#GET /banana HTTP/1.1
host: localhost:8080
Connection: close`

      const firstInput =
`
${firstLine}

${firstPacket}

${secondPacket}

${firstHalfThirdPacket}
`

const secondInput = 
`${secondHalfThirdPacket}

${fourthPacket}

${fifthPacket}
`

const combinedThirdPacketString = `${firstHalfThirdPacket}${secondHalfThirdPacket}`;

      const results = processTCPDumpOutput(firstInput);
      expect(results.individualRawPackets.length).toEqual(2);
      expect(results.individualRawPackets[0]).toEqual(firstPacket)
      expect(results.individualRawPackets[1]).toEqual(secondPacket)
      expect(results.remainingString.includes(firstPacket)).toBe(false);
      expect(results.remainingString.includes(secondPacket)).toBe(false);
      expect(results.remainingString.includes(firstHalfThirdPacket)).toBe(true);

      const secondResults = processTCPDumpOutput(secondInput, results.remainingString);
      expect(secondResults.individualRawPackets.length).toEqual(3);
      expect(secondResults.individualRawPackets[0]).toEqual(combinedThirdPacketString);
      expect(secondResults.individualRawPackets[1]).toEqual(fourthPacket);
      expect(secondResults.individualRawPackets[2]).toEqual(fifthPacket);
      expect(secondResults.remainingString.includes(fourthPacket)).toBe(false);
      expect(secondResults.remainingString.includes(fifthPacket)).toBe(false);
      expect(secondResults.remainingString.includes(firstHalfThirdPacket)).toBe(false);
      expect(secondResults.remainingString.includes(secondHalfThirdPacket)).toBe(false);

    });
  });
});
