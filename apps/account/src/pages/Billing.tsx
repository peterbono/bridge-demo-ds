import { Badge, Button, Card, CardBody, CardFooter, CardHeader, PageHeader, Table } from '@demo-ds/react';
import styles from '../account.module.css';

const INVOICES = [
  { id: 'INV-2041', date: 'Oct 1', amount: '$48.00', status: 'Paid' },
  { id: 'INV-1987', date: 'Sep 1', amount: '$48.00', status: 'Paid' },
  { id: 'INV-1930', date: 'Aug 1', amount: '$36.00', status: 'Refunded' },
];

export function BillingPage() {
  return (
    <main className={styles.page}>
      <PageHeader title="Billing" lead="Your plan, usage and invoices." />
      <Card>
        <CardHeader>
          <h2>Team plan</h2>
          <Badge tone="success">Active</Badge>
        </CardHeader>
        <CardBody>
          <p className={styles.planPrice}>$48 per month</p>
          <div className={styles.usageBar} role="img" aria-label="7 of 10 seats used">
            <div className={styles.usageFill} style={{ width: '70%' }} />
          </div>
          <p className={styles.muted}>7 of 10 seats used</p>
        </CardBody>
        <CardFooter>
          <Button variant="secondary">Change plan</Button>
        </CardFooter>
      </Card>
      <Table aria-label="Invoices">
        <thead>
          <tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {INVOICES.map((i) => (
            <tr key={i.id}><td>{i.id}</td><td>{i.date}</td><td>{i.amount}</td><td>{i.status}</td></tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
