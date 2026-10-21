import { Avatar, AvatarGroup, Badge, Button, Card, CardBody, CardHeader, PageHeader } from '@demo-ds/react';
import styles from '../account.module.css';

const MEMBERS = [
  { name: 'Ann Leroy', role: 'Design lead' },
  { name: 'Leo Martin', role: 'Front-end' },
  { name: 'Dana Moreau', role: 'Product designer' },
];

export function TeamPage() {
  return (
    <main className={styles.page}>
      <PageHeader title="Team" lead="Who can see and edit this workspace." actions={<Button>Invite people</Button>} />
      <Card>
        <CardHeader>
          <h2>Members</h2>
          <AvatarGroup size="sm">
            {MEMBERS.map((m) => <Avatar key={m.name} name={m.name} />)}
          </AvatarGroup>
        </CardHeader>
        <CardBody>
          {MEMBERS.map((m) => (
            <div key={m.name} className={styles.row}>
              <span>{m.name}</span>
              <Badge>{m.role}</Badge>
            </div>
          ))}
        </CardBody>
      </Card>
    </main>
  );
}
