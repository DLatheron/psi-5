import { z } from "zod";
export const ConsumerProps = z.object({
    id: z.string()
});
export class Consumer {
    props;
    instance;
    constructor(props) {
        this.props = props;
        this.instance = {
            desiredConsumption: 0,
            actualConsumption: 0
        };
    }
    get id() {
        return this.props.id;
    }
    get desiredConsumption() {
        return this.instance.desiredConsumption;
    }
    set desiredConsumption(value) {
        this.instance.desiredConsumption = value;
    }
    get actualConsumption() {
        return this.instance.actualConsumption;
    }
    set actualConsumption(value) {
        this.instance.actualConsumption = value;
    }
}
