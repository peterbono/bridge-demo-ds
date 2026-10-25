import { Avatar, Button, Card, CardBody, CardHeader, Field, Input, PageHeader, SegmentedControl, Switch } from '@demo-ds/react';
import styles from '../account.module.css';

// Notifications by channel: each alert says where it goes (email, in the app, or both), built with the library only.
const ALERTS = [
  { key: 'invoice', label: 'New invoice', hint: 'When an invoice is ready to pay.', on: true, channel: 'both' },
  { key: 'seats', label: 'Seats almost full', hint: 'When 9 of 10 seats are used.', on: true, channel: 'email' },
  { key: 'summary', label: 'Weekly summary', hint: 'Usage and spend, every Monday.', on: true, channel: 'email' },
  { key: 'updates', label: 'Product updates', hint: 'New features, once a month.', on: false, channel: 'app' },
];

const CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'app', label: 'In the app' },
  { value: 'both', label: 'Both' },
];

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
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h2>Notifications</h2>
        </CardHeader>
        <CardBody>
          {ALERTS.map((a) => (
            <div key={a.key} className={styles.row}>
              <span className={styles.section}>
                <span>{a.label}</span>
                <span className={styles.muted}>{a.hint}</span>
              </span>
              <SegmentedControl label={`Where ${a.label} goes`} size="sm" items={CHANNELS} defaultValue={a.channel} />
              <Switch defaultChecked={a.on} aria-label={a.label} />
            </div>
          ))}
          <p className={styles.muted}>You can unsubscribe from any email with one click.</p>
        </CardBody>
      </Card>
    </main>
  );
}
