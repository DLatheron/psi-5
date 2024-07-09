import { z } from "zod";
import { Console } from "../Utils";
import { EnergySystem, EnergySystemInstance, EnergySystemRecipe } from "./EnergySystem";
import { Priority } from "./types";

export function isEnergyGenerator(arg: unknown): arg is EnergyGenerator {
    return arg instanceof EnergyGenerator;
}

export const EnergyGeneratorRecipe = EnergySystemRecipe.extend({
    powerPerTick: z.number().int().positive()
});
export type EnergyGeneratorRecipe = z.infer<typeof EnergyGeneratorRecipe>;

export interface EnergyGeneratorInstance extends EnergySystemInstance {
    powerPerTick: number;
}

export class EnergyGenerator extends EnergySystem {
    declare protected _instance: EnergyGeneratorInstance;

    constructor(recipe: EnergyGeneratorRecipe) {
        super(recipe);
        this._instance = {
            ...recipe,
            priority: recipe.priority ?? Priority.enum.MEDIUM
        
        };
    }

    get powerProduced() {
        return this._instance.powerPerTick;
    }

    tick() {
        console.info(`Generator: ${Console.Cyan(this.id)} => ${Console.Yellow(this.powerProduced)}\n`);
        console.group();

        let powerLeftToAllocate = this.powerProduced;

        for (const priority of Object.values(Priority.Enum)) {
            const { links, totalPowerNeeded } = this.getLinksAndTotalPowerNeededByPriority(priority);
            if (totalPowerNeeded === 0) {
                continue;
            }

            console.info(`${Console.BrightYellowOnBlue(priority)}: ${Console.Ratio(powerLeftToAllocate, totalPowerNeeded, Console.Foreground.Yellow)}`);

            const powerPerConsumerUnit = powerLeftToAllocate / totalPowerNeeded;

            for (const link of links) {
                const powerToDeliver = Math.min(powerLeftToAllocate, link.energyNeeded * powerPerConsumerUnit, link.energyNeeded);
                const powerDelivered = link.deliverPower(powerToDeliver);
                powerLeftToAllocate -= powerDelivered;
            }
        }

        if (powerLeftToAllocate > 0) {
            console.info(Console.Red(`Wasted: ${powerLeftToAllocate}`));
        }
        console.groupEnd();
        console.info();
    }
}
