
class CardDetails {
  constructor(id, dameId, sireId, dateOfLambing, dateOfMating, sex, birthWeight, remarks, status, dateOfDisposal) {
    this.id = id;
    this.dameId = dameId;
    this.sireId = sireId;
    this.dateOfMating = dateOfMating;
    this.dateOfLambing = dateOfLambing;
    this.sex = sex;
    this.birthWeight = birthWeight;
    this.remarks = remarks;
    this.status = status;
    this.dateOfDisposal = dateOfDisposal;
  }

  toJSON() {
    return {
      id: this.id,
      dameId: this.dameId,
      sireId: this.sireId,
      dateOfMating: this.dateOfMating,
      dateOfLambing: this.dateOfLambing,
      sex: this.sex,
      birthWeight: this.birthWeight,
      remarks: this.remarks,
      status: this.status,
      dateOfDisposal: this.dateOfDisposal
    };
  }
}


export default CardDetails;