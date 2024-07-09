import { z } from "zod";
export const GeneratorProps = z.object({
    id: z.string(),
    powerPerTick: z.number().min(0)
});
export class Generator {
    props;
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get powerPerTick() {
        return this.props.powerPerTick;
    }
}
