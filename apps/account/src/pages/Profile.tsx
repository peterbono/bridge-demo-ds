import { Avatar, Badge, Button, Card, CardBody, CardHeader, Tag } from '@demo-ds/react';
import styles from '../profile.module.css';

// First pass of the profile page for the user test. The header is built by hand until the library has a
// ProfileHeader; the big avatar and the "new" highlight use values the library does not have yet.
export function ProfilePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Avatar name="Dana Moreau" size="lg" className={styles.bigAvatar} />
        <div className={styles.headerText}>
          <h1 className={styles.name}>Dana Moreau</h1>
          <p className={styles.role}>Product designer, Payments</p>
          <Badge tone="success" dot>Available</Badge>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary">Message</Button>
          <Button>Edit profile</Button>
        </div>
      </header>

      <section className={styles.sections}>
        <Card>
          <CardHeader>
            <h2>Skills</h2>
          </CardHeader>
          <CardBody>
            <div className={styles.tags}>
              <Tag>Checkout</Tag>
              <Tag>Design systems</Tag>
              <Tag>User research</Tag>
            </div>
          </CardBody>
        </Card>
        <Card className={styles.newItem}>
          <CardHeader>
            <h2>Recent work</h2>
            <Badge tone="info">New</Badge>
          </CardHeader>
          <CardBody>Billing page redesign, shipped this month.</CardBody>
        </Card>
      </section>
    </main>
  );
}
