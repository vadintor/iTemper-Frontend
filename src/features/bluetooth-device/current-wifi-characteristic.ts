import { log } from '@/services/logger';
import * as ble from './bluetooth-service';
import { WiFiData, WiFiNetwork } from '@/features/devices/device-data';
import { isWiFiDataValid } from '@/features/devices/device-data-validators';

// SSID (read/write), Encryption (read/write), Password (write)
export const CurrentWiFiCharacteristicUUID = 'd7e84cb2-ff37-4afc-9ed8-5577aeb84541';

export interface WiFiWriteData  {
    ssid: string;
    password: string;
}

export class CurrentWiFiCharacteristic {
  private characteristic: BluetoothRemoteGATTCharacteristic;
  constructor(characteristic: BluetoothRemoteGATTCharacteristic) {
    this.characteristic = characteristic;
  }
  public async readValue(): Promise<WiFiNetwork> {
    log.debug('current-wifi-characteristic.readValue');
    return  new Promise((resolve, reject) => {
      this.characteristic.readValue().then ((value) => {
        const str = ble.decode(value);
        log.info('current-wifi-characteristic.readValue received' + str);
        try {
          const data = JSON.parse(str);
          if (isWiFiDataValid(data)) {
            resolve({ssid: data[0], security: data[1]});
          } else if ('ssid' in data && 'security' in data) {
            resolve({ssid: data.ssid, security: data.security});
          } else {
            reject('Invalid wifi data');
          }
        } catch {
            reject('Cannot parse current wifi data');
        }
      });
    });
  }
  public async writeValue(value: WiFiWriteData): Promise<void> {
    log.debug('current-wifi-characteristic.writeValue');
    return  this.characteristic.writeValue(ble.encode(JSON.stringify(value)));
  }
}
