import { z } from "zod";
import type { EnergyConsumer } from "./Consumer";
import { EnergyLink } from "./EnergyLink";
import type { EnergyStore } from "./Store";
import { Priority } from "./types";

export const EnergySystemRecipe = z.object({
    id: z.string().min(1),
    priority: Priority.optional()
});
export type EnergySystemRecipe = z.infer<typeof EnergySystemRecipe>;

export interface EnergySystemInstance {
    id: string;
    priority: Priority;
}

export abstract class EnergySystem {
    protected _instance: EnergySystemInstance;
    protected _links: EnergyLink[];

    constructor(recipe: EnergySystemRecipe) {
        this._instance = {
            id: recipe.id,
            priority: recipe.priority ?? Priority.enum.MEDIUM
        };
        this._links = [];
    }

    get id() {
        return this._instance.id;
    }

    get priority() {
        return this._instance.priority;
    }

    set priority(value: Priority) {
        this._instance.priority = value;
    }

    linkTo(system: EnergyConsumer | EnergyStore, limitedCapacity?: number) {
        this._links.push(new EnergyLink({ system, limitedCapacity }));
    }

    getLinksByPriority(priority: Priority) {
        return this._links.filter(link => link.systemPriority === priority);
    }

    getLinksAndTotalPowerNeededByPriority(priority: Priority) {
        const links = this.getLinksByPriority(priority);

        return {
            links, 
            totalPowerNeeded: links.reduce((total, link) => total + link.energyNeeded, 0)
        };
    }

    startTick() {};
    endTick() {};
}
