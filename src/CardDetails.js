
class CardDetails {
  constructor(id, unit, measurements) {
    this.id = id;
    this.unit = unit;
    this.measurements = measurements;
  }

  toJSON() {
    return {
      id: this.id,
      unit: this.unitid,
      measurements: this.measurementsid
    };
  }
}


export default CardDetails;