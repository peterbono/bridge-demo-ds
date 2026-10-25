import { Badge, Button, Card, CardBody, CardFooter, CardHeader, PageHeader } from '@demo-ds/react';
import styles from '../plans.module.css';

// Plan comparison: three plans side by side, the current one marked, built with the library only. Tested with five
// customers who were about to downgrade.
const PLANS = [
  { name: 'Starter', price: '$0', seats: 'Up to 3 seats', features: ['1 workspace', 'Community support'], current: false },
  { name: 'Team', price: '$48', seats: 'Up to 10 seats', features: ['5 workspaces', 'Email support', 'Usage reports'], current: true },
  { name: 'Business', price: '$120', seats: 'Up to 50 seats', features: ['Unlimited workspaces', 'Priority support', 'Single sign-on'], current: false },
];

export function PlansPage() {
  return (
    <main className={styles.page}>
      <PageHeader title="Plans" lead="Compare plans before you change yours." />
      <div className={styles.plans}>
        {PLANS.map((p) => (
          <Card key={p.name}>
            <CardHeader>
              <h2>{p.name}</h2>
              {p.current && <Badge tone="success">Your plan</Badge>}
            </CardHeader>
            <CardBody>
              <p className={styles.planPrice}>{p.price} per month</p>
              <p className={styles.muted}>{p.seats}</p>
              <ul className={styles.features}>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </CardBody>
            <CardFooter>
              <Button variant={p.current ? 'secondary' : 'primary'} disabled={p.current}>
                {p.current ? 'Current plan' : `Switch to ${p.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
