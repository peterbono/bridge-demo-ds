import type { Meta, StoryObj } from '@storybook/react-vite';
import { Specimen, SpecimenStack } from '../../stories/StateGrid';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { ProfileHeader } from './ProfileHeader';

const meta = {
  title: 'Layout/ProfileHeader',
  component: ProfileHeader,
  args: { name: 'Dana Moreau', subtitle: 'Product designer, Payments' },
  argTypes: { actions: { control: false }, meta: { control: false }, headingLevel: { control: 'inline-radio', options: [1, 2] } },
} satisfies Meta<typeof ProfileHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    meta: <Badge tone="success" dot>Available</Badge>,
    actions: (
      <>
        <Button variant="secondary">Message</Button>
        <Button>Edit profile</Button>
      </>
    ),
  },
};
export const NameOnly: Story = { args: { subtitle: undefined } };

export const AllStates: Story = {
  render: () => (
    <SpecimenStack>
      <Specimen label="Name, subtitle, meta, actions">
        <ProfileHeader name="Dana Moreau" subtitle="Product designer, Payments" meta={<Badge tone="success" dot>Available</Badge>} actions={<Button variant="secondary">Message</Button>} />
      </Specimen>
      <Specimen label="Name only">
        <ProfileHeader name="Leo Martin" />
      </Specimen>
      <Specimen label="Long name, narrow container">
        <div style={{ maxWidth: 320 }}>
          <ProfileHeader name="Anne-Sophie Leroy-Delacourt" subtitle="Design lead" actions={<Button variant="secondary">Message</Button>} />
        </div>
      </Specimen>
      <Specimen label="Heading level 2">
        <ProfileHeader headingLevel={2} name="Ann Leroy" subtitle="Design lead" />
      </Specimen>
    </SpecimenStack>
  ),
};
