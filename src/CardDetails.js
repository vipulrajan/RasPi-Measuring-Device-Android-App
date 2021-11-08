
class CardDetails {
  constructor(id, unit, measurements) {
    this.id = id;
    this.unit = unit;
    this.measurements = measurements;
  }

  toJSON() {
    return {
      id: this.id,
      unit: this.unit,
      measurements: this.measurements
    };
  }
}


export default CardDetails;