import { z } from "zod";
import { Console } from "../Utils";
import { EnergySystem, EnergySystemInstance, EnergySystemRecipe } from "./EnergySystem";
import { Priority } from "./types";

export function isEnergyConsumer(arg: unknown): arg is EnergyConsumer {
    return arg instanceof EnergyConsumer;
}

export const EnergyConsumerRecipe = EnergySystemRecipe.extend({});
export type EnergyConsumerRecipe = z.infer<typeof EnergyConsumerRecipe>;

export interface EnergyConsumerInstance extends EnergySystemInstance {
    energyConsumption: number;
    energyDelivered: number;
}

export class EnergyConsumer extends EnergySystem {
    declare protected _instance: EnergyConsumerInstance;

    constructor(props: EnergyConsumerRecipe) {
        super(props);
        this._instance = {
            ...props,
            priority: props.priority ?? Priority.enum.MEDIUM,
            energyConsumption: 0,
            energyDelivered: 0
        };
    }

    set energyConsumption(value: number) {
        this._instance.energyConsumption = value;
    }

    get energyNeeded() {
        return this._instance.energyConsumption - this.energyDelivered;
    }

    get energyDelivered() {
        return this._instance.energyDelivered;
    }

    get percentage() {
        return this.energyDelivered / this._instance.energyConsumption * 100;
    }

    startTick() {
        this._instance.energyDelivered = 0;
        console.info(`${Console.Green(this.id)}: ${Console.BrightYellowOnBlue(this.priority)} ${Console.Ratio(this.energyDelivered, this._instance.energyConsumption, Console.Other.Dim)} = ${Console.Percentage(this.percentage, Console.Other.Bright)}`);
    }

    endTick() {
        console.info(`${Console.Green(this.id)}: ${Console.BrightYellowOnBlue(this.priority)} ${Console.Ratio(this.energyDelivered, this._instance.energyConsumption, Console.Other.Dim)} = ${Console.Percentage(this.percentage, Console.Other.Bright)}`);
    }

    deliverPower(power: number): number {
        if (power < 0) {
            throw new Error(`Cannot deliver negative power: ${power}`);
        }

        const powerDelivered = Math.min(power, this.energyNeeded);
        this._instance.energyDelivered += powerDelivered;

        console.group();
        console.info(`${Console.Green(this.id)}: +${Console.Dim(powerDelivered.toFixed(0))}/${Console.Dim(this._instance.energyConsumption.toFixed(0))}`);
        console.groupEnd();

        return powerDelivered;
    }    
}
