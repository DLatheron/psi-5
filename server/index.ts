#!/usr/bin/env tsx

import { EnergyConsumer, EnergyGenerator, EnergyStore, EnergySystemManager, Priority } from "./src/Energy";
import { Console } from "./src/Utils";

async function main() {
    const mainCore = new EnergyGenerator({
        id: "main-core",
        powerPerTick: 100
    });
    const engines = [
        new EnergyConsumer({ id: "engine-0" }),
        new EnergyConsumer({ id: "engine-1" }),
        new EnergyConsumer({ id: "engine-2" })
    ];
    const shieldBattery = new EnergyStore({ id: "shield-battery", maxEnergyStored: 200 })
    const shield = new EnergyStore({ id: "shield", maxEnergyStored: 100 });

    engines[0].energyConsumption = 40;
    engines[0].priority = Priority.enum.HIGH;
    engines[1].energyConsumption = 40;
    engines[1].priority = Priority.enum.MEDIUM;
    engines[2].energyConsumption = 40;
    engines[2].priority = Priority.enum.LOW;

    mainCore.linkTo(engines[0]);
    mainCore.linkTo(engines[1]);
    mainCore.linkTo(engines[2]);
    mainCore.linkTo(shieldBattery, 20);
    shieldBattery.linkTo(shield, 40);

    const energySystem = new EnergySystemManager();
    energySystem.addSystems(mainCore, ...engines, shieldBattery, shield);

    energySystem.tick();
    energySystem.tick();
    energySystem.tick();
    energySystem.tick();
    energySystem.tick();
    energySystem.tick();
    energySystem.tick();
    console.info(Console.Red("*** SHIELD DAMAGE 50 ***\n"));
    shield.consumePower(50);
    energySystem.tick();
    energySystem.tick();
}

main();
