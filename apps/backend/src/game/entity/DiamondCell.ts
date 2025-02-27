import Cell from './Cell';

export default class DiamondCell extends Cell {
  diamond: boolean;

  action() {
    this.open = true;
    this.diamond = true;
    this.value = '💎';
  }
}
