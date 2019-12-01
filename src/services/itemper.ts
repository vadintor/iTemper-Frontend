import { ApiService } from './api-service';
import { DeviceService } from './device-service';
import { LocationService } from './location-service';
import { SensorService } from './sensor-service';

export interface IiTemper {
    apiService: ApiService;
    deviceService: DeviceService;
    locationService: LocationService;
    sensorService: SensorService;
}
export class Itemper implements IiTemper {
    public apiService = new ApiService();
    public deviceService =  new DeviceService(this.apiService);
    public locationService =  new LocationService(this.apiService);
    public sensorService =  new SensorService(this.apiService);
}
