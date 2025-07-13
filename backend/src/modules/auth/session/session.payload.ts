export class SessionPayload {
  uid: number;
  gid: string;

  constructor(uid: number, gid: string) {
    this.uid = uid;
    this.gid = gid;
  }
}
