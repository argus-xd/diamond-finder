import Cell from "@/entity/Cell";

export default class DiamondCell extends Cell{

    // constructor(...args) {
    //     super(...args);
    // }

    action() {
        this.open = true;
        this.diamond = true;
        this.value = "💎";
    }
}
