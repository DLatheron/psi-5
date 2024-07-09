import { z } from "zod";
import { Console } from "../Utils";
import { EnergySystem, EnergySystemInstance, EnergySystemRecipe } from "./EnergySystem";
import { Priority } from "./types";

export function isEnergyStore(arg: unknown): arg is EnergyStore {
    return arg instanceof EnergyStore;
}

export const EnergyStoreRecipe = EnergySystemRecipe.extend({
    maxEnergyStored: z.number().int().positive()
});
export type EnergyStoreRecipe = z.infer<typeof EnergyStoreRecipe>;

export interface EnergyStoreInstance extends EnergySystemInstance {
    energyStored: number;
    maxEnergyStored: number;
}

export class EnergyStore extends EnergySystem {
    declare protected _instance: EnergyStoreInstance;

    constructor(recipe: EnergyStoreRecipe) {
        super(recipe);
        this._instance = {
            ...recipe,
            priority: recipe.priority ?? Priority.enum.MEDIUM,
            energyStored: 0,
        };
    }

    get energyNeeded() {
        return this.maxEnergyStored - this.energyStored;
    }

    get energyStored() {
        return this._instance.energyStored;
    }

    get maxEnergyStored() {
        return this._instance.maxEnergyStored;
    }

    get percentage() {
        return this.energyStored / this.maxEnergyStored * 100;
    }

    startTick(): void {
        console.info(`${Console.Green(this.id)}: ${Console.BrightYellowOnBlue(this.priority)} ${Console.Ratio(this.energyStored, this.maxEnergyStored, Console.Other.Dim)} = ${Console.Percentage(this.percentage, Console.Other.Bright)}`);
    }

    endTick() {
        console.info(`${Console.Green(this.id)}: ${Console.BrightYellowOnBlue(this.priority)} ${Console.Ratio(this.energyStored, this.maxEnergyStored, Console.Other.Dim)} = ${Console.Percentage(this.percentage, Console.Other.Bright)}`);
    }

    tick() {
        console.info(`Store: ${Console.Cyan(this.id)} => ${Console.Yellow(this.energyStored)}\n`);
        console.group();

        let powerLeftToAllocate = this.energyStored;

        for (const priority of Object.values(Priority.Enum)) {
            const { links, totalPowerNeeded } = this.getLinksAndTotalPowerNeededByPriority(priority);
            if (totalPowerNeeded === 0) {
                continue;
            }

            console.info(`${Console.BrightYellowOnBlue(priority)}: ${Console.Ratio(powerLeftToAllocate, totalPowerNeeded, Console.Foreground.Yellow)}`);

            const powerPerConsumerUnit = powerLeftToAllocate / totalPowerNeeded;
            
            for (const link of links) {
                const powerToConsume = Math.min(powerLeftToAllocate, link.energyNeeded * powerPerConsumerUnit, link.energyNeeded);
                const powerToDeliver = this.consumePower(powerToConsume);
                const powerDelivered = link.deliverPower(powerToDeliver);
                powerLeftToAllocate -= powerDelivered
            }
        }

        console.groupEnd();
        console.info();
    }

    deliverPower(power: number): number {
        if (power < 0) {
            throw new Error(`Cannot deliver negative power: ${power}`);
        }

        const powerDelivered = Math.min(power, this.energyNeeded);
        this._instance.energyStored += powerDelivered;

        console.group();
        console.info(`${Console.Green(this.id)}: +${Console.Ratio(powerDelivered, this._instance.maxEnergyStored, Console.Other.Dim)}`);
        console.groupEnd();     
        
        return powerDelivered;
    }

    consumePower(power: number): number {
        if (power < 0) {
            throw new Error(`Cannot deliver negative power: ${power}`);
        }

        const powerAvailable = Math.min(power, this.energyStored);

        this._instance.energyStored -= powerAvailable

        return powerAvailable;
    }
}
