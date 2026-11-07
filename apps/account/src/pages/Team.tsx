import { Avatar, Badge, Button, Card, CardBody, CardHeader, PageHeader } from '@demo-ds/react';
import styles from '../team.module.css';

// Seats and roles on the Team page, for admins who free seats before the renewal. The role pill and the seat meter are
// drawn by hand: the library has no tone for roles and no meter yet.
const MEMBERS = [
  { name: 'Ann Leroy', email: 'ann@acme.design', role: 'Owner', active: 'Today' },
  { name: 'Leo Martin', email: 'leo@acme.design', role: 'Admin', active: 'Yesterday' },
  { name: 'Dana Moreau', email: 'dana@acme.design', role: 'Member', active: '3 days ago' },
  { name: 'Malik Diallo', email: 'malik@acme.design', role: 'Member', active: '42 days ago' },
];

export function TeamPage() {
  return (
    <main className={styles.page}>
      <PageHeader title="Team" lead="Who holds a seat, and what they can do." actions={<Button>Invite people</Button>} />
      <Card>
        <CardHeader>
          <h2>Seats</h2>
          <Badge tone="warning">Renews Nov 1</Badge>
        </CardHeader>
        <CardBody>
          <div className={styles.meter} role="img" aria-label="7 of 10 seats used">
            <span className={styles.meterFill} style={{ width: '70%' }} />
          </div>
          <p className={styles.muted}>7 of 10 seats used. Free a seat before Nov 1 to pay less.</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h2>Members</h2>
        </CardHeader>
        <CardBody>
          {MEMBERS.map((m) => (
            <div key={m.email} className={styles.member}>
              <Avatar name={m.name} size="sm" />
              <span className={styles.who}>
                <strong>{m.name}</strong>
                <span className={styles.muted}>{m.email}</span>
              </span>
              <span className={styles.rolePill} data-role={m.role.toLowerCase()}>
                {m.role}
              </span>
              <span className={styles.muted}>Active {m.active}</span>
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>
    </main>
  );
}
