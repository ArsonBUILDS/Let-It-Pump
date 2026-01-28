export class StateStore {
  private lastBuybackAt: number | null = null;

  getLastBuybackAt(): number | null {
    return this.lastBuybackAt;
  }

  setLastBuybackAt(ts: number) {
    this.lastBuybackAt = ts;
  }
}
