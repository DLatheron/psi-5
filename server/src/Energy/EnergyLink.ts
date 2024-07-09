import type { EnergyStore } from "./Store";
import type { EnergyConsumer } from "./Consumer";

export interface EnergyLinkRecipe {
    system: EnergyConsumer | EnergyStore;
    limitedCapacity: number | undefined;
}

export class EnergyLink {
    protected _instance: {
        system: EnergyConsumer | EnergyStore;
        limitedCapacity: number | undefined;
    };

    constructor(recipe: EnergyLinkRecipe) {
        this._instance = {
            system: recipe.system,
            limitedCapacity: recipe.limitedCapacity
        };
    }

    get systemPriority() {
        return this._instance.system.priority;
    }

    get energyNeeded() {
        const { energyNeeded } = this._instance.system;
        
        return Math.min(energyNeeded, this._instance.limitedCapacity ?? Number.MAX_SAFE_INTEGER);
    }

    deliverPower(power: number): number {
        return this._instance.system.deliverPower(power);
    }
}
