import { Avatar, Button, Card, CardBody, CardHeader, Field, Input, PageHeader, Switch } from '@demo-ds/react';
import styles from '../account.module.css';

export function SettingsPage() {
  return (
    <main className={styles.page}>
      <PageHeader title="Account settings" lead="Your profile, sign-in and notifications." actions={<Button>Save changes</Button>} />
      <Card>
        <CardHeader>
          <h2>Profile</h2>
        </CardHeader>
        <CardBody>
          <div className={styles.section}>
            <Avatar name="Dana Moreau" size="lg" />
            <Field label="Full name">
              <Input defaultValue="Dana Moreau" autoComplete="name" />
            </Field>
            <Field label="Work email" description="We send receipts and security alerts here.">
              <Input type="email" defaultValue="dana@example.com" autoComplete="email" />
            </Field>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h2>Notifications</h2>
        </CardHeader>
        <CardBody>
          <div className={styles.row}>
            <span>Weekly summary</span>
            <Switch defaultChecked aria-label="Weekly summary" />
          </div>
          <div className={styles.row}>
            <span>Product updates</span>
            <Switch aria-label="Product updates" />
          </div>
          <p className={styles.muted}>You can unsubscribe from any email with one click.</p>
        </CardBody>
      </Card>
    </main>
  );
}
