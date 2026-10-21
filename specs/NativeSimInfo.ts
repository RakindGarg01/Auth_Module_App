import type { TurboModule } from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export type SimInfo = {
     slot: number;
     carrier: string;
     displayName: string;
     countryIso: string;
     number: string; 
}

export interface Spec extends TurboModule {
     getSimInfo(): Promise<SimInfo[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSimInfo');