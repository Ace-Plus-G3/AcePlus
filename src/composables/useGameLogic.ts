export class GameLogic {
  private intervalId: number | undefined = undefined;
  private resetCountdownId: number | undefined = undefined;
  private timeouts: number[] = [];

  addTimeout(timeoutId: number) {
    this.timeouts.push(timeoutId);
  }

  clearAllTimeouts() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  getIntervalId() {
    return this.intervalId;
  }

  setIntervalId(value: number | undefined) {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.intervalId = value;
  }

  setResetCountdownId(value: number | undefined) {
    if (this.resetCountdownId !== undefined) {
      clearInterval(this.resetCountdownId);
      this.resetCountdownId = undefined;
    }
    this.resetCountdownId = value;
  }

  cleanupAllIntervals() {
    this.setIntervalId(undefined);
    this.setResetCountdownId(undefined);
  }

  cleanupAll() {
    this.setIntervalId(undefined);
    this.setResetCountdownId(undefined);
    this.clearAllTimeouts();
  }
}

const gameLogicInstance = new GameLogic();
export default gameLogicInstance;
