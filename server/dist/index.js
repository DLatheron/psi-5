#!/usr/bin/env ts-node
import { inspect } from "util";
import { Consumer, Generator, PowerSystem } from "./src/Energy";
function inspectObj(obj) {
    console.log(inspect(obj, { colors: true, compact: true }));
}
async function main() {
    const mainCore = new Generator({
        id: "main-core",
        powerPerTick: 100,
    });
    const engines = [
        new Consumer({ id: "engine-0" }),
        new Consumer({ id: "engine-1" }),
        new Consumer({ id: "engine-2" })
    ];
    const powerSystem = new PowerSystem();
    powerSystem.addGenerator(mainCore);
    powerSystem.addConsumer(engines[0]);
    powerSystem.addConsumer(engines[1]);
    powerSystem.addConsumer(engines[2]);
    powerSystem.link(mainCore, engines[0]);
    powerSystem.link(mainCore, engines[1]);
    powerSystem.link(mainCore, engines[2]);
    engines[0].desiredConsumption = 0;
    engines[1].desiredConsumption = 100;
    engines[2].desiredConsumption = 0;
    powerSystem.tick();
}
main();
