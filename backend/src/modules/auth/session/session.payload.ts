export class SessionPayload {
  uid: string;
  gid: string;

  constructor(uid: string, gid: string) {
    this.uid = uid;
    this.gid = gid;
  }
}
