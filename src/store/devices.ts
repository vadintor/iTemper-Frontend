import { IDeviceService } from '@/services/device-service';
import * as itemper from '@/services/itemper';
import { Device } from '../models/device';

import { log } from '@/services/logger';

export class Devices  {
    public mError: string = '';
    private mDevices: Device[] = [];
    private deviceService: IDeviceService;

    constructor(deviceService: IDeviceService) {
        this.deviceService = deviceService;
    }
    public get all(): Device[] {
        return this.mDevices;
    }
    public getDevices(): void {
        this.resetError();
        this.deviceService.getDevices()
        .then((response: Device[]) => {
            response.forEach((device) => {
                const deviceFound = this.mDevices.find(d => d.deviceID === device.deviceID);
                if (!deviceFound) {
                    this.mDevices.push(device);
                }
            });
        })
        .catch(e => this.handleError(e));
    }
    public createDevice(name: string): void {
        this.resetError();
        this.deviceService.createDevice(name)
        .then(device => {
            this.mDevices.push(device);
        })
        .catch(e => this.handleError(e));
    }
    public renameDevice(name: string, device: Device): void {
        this.resetError();
        this.deviceService.renameDevice(name, device)
        .then((d: Device) => device.name = d.name)
        .catch(e => this.handleError(e));
    }
    public deleteDevice(device: Device): void {
        this.resetError();
        this.deviceService.deleteDevice(device)
        .then((d: Device) => {
            const index = this.mDevices.indexOf(device);
            this.mDevices.splice(index, 1);
        })
        .catch(e => this.handleError(e));
    }

    private resetError() {
        this.mError = '';
    }
    private handleError(e: any) {
        if (e.response) {
            this.mError = e.response.data;
        } else if (e.request) {
            this.mError = 'No response from server';
        } else {
            this.mError = e.message;
        }
        setTimeout(this.resetError, 1000 * 5);
    }
}

export const devices = new Devices(itemper.deviceService);