// we generate a new identity appended with timestamp so a user
// can have multiple devices (identities) connect to the same twilio room
export function generateIdentity(uid: string) {
  const now = new Date().getTime();
  return `${uid}/${now}`;
}

export function getUidFromIdentity(identity: string): string | undefined {
  return identity.split('/')[0] ?? undefined;
}
