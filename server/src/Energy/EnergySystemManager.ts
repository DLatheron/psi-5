import { EnergySystem } from "./EnergySystem";
import { isEnergyGenerator } from "./Generator";
import { isEnergyStore } from "./Store";

export class EnergySystemManager {
    protected systems: EnergySystem[];
    protected tickCount: number;

    constructor() {
        this.systems = [];
        this.tickCount = 0;
    }

    addSystems(...systems: EnergySystem[]) {
        this.systems.push(...systems);
    }

    tick() {
        console.info(`Tick ${this.tickCount}:`);
        console.group();

        this.systems.forEach(system => system.startTick());

        const generators = this.systems.filter(isEnergyGenerator);
        for (const generator of generators) {
            generator.tick();
        }

        const stores = this.systems.filter(isEnergyStore);
        for (const store of stores) {
            store.tick();
        }

        this.systems.forEach(system => system.endTick());

        console.groupEnd();
        console.info();
        ++this.tickCount;
    }
}
