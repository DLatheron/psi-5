import { Consumer } from "./Consumer";
function isConsumer(obj) {
    return obj instanceof Consumer;
}
export class PowerSystem {
    consumers;
    generators;
    idLookup = {};
    links = {};
    constructor() {
        this.consumers = [];
        this.generators = [];
        this.idLookup = {};
    }
    addConsumer(consumer) {
        this.consumers.push(consumer);
        this.idLookup[consumer.id] = consumer;
    }
    addGenerator(generator) {
        this.generators.push(generator);
        this.idLookup[generator.id] = generator;
    }
    link(from, to) {
        if (from === to) {
            throw new Error("Cannot link to self");
        }
        const { id: fromId } = from;
        this.links[fromId] = this.links[fromId] || [];
        this.links[fromId].push(to);
    }
    tick() {
        for (const generator of this.generators) {
            const linkedConsumers = (this.links[generator.id] || []).filter(isConsumer);
            const totalDesiredConsumption = linkedConsumers.reduce((acc, consumer) => {
                return acc + consumer.desiredConsumption;
            }, 0);
            const totalPowerGenerated = generator.powerPerTick;
            const powerPerConsumerUnit = totalPowerGenerated / totalDesiredConsumption;
            for (const consumer of linkedConsumers) {
                consumer.actualConsumption = consumer.desiredConsumption * powerPerConsumerUnit;
            }
        }
        for (const consumer of this.consumers) {
            console.log(`${consumer.id}: ${consumer.actualConsumption}`);
        }
    }
}
