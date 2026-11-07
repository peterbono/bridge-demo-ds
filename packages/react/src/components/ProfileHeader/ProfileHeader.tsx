import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Avatar } from '../Avatar';
import styles from './ProfileHeader.module.css';

export interface ProfileHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The person's full name, as they wrote it. Also names the avatar. */
  name: string;
  /** Role, team or one short line about the person: "Product designer, Payments". */
  subtitle?: ReactNode;
  /** Photo URL. Without it, the avatar shows initials. */
  avatarSrc?: string;
  /** Small facts under the subtitle: a Badge for status, location, local time. */
  meta?: ReactNode;
  /** One or two actions on this person: Message, Edit profile. */
  actions?: ReactNode;
  /** Heading level of the name. Default 1: the profile is the page. */
  headingLevel?: 1 | 2;
}

/** The top of a profile page: the person's avatar, name, a subtitle, optional meta and actions. */
export const ProfileHeader = forwardRef<HTMLElement, ProfileHeaderProps>(function ProfileHeader(
  { name, subtitle, avatarSrc, meta, actions, headingLevel = 1, className, ...rest },
  ref,
) {
  return (
    <header ref={ref} className={cx(styles.profileHeader, className)} {...rest}>
      <Avatar name={name} src={avatarSrc} size="lg" decorative className={styles.avatar} />
      <div className={styles.text}>
        {createElement(`h${headingLevel}`, { className: styles.name }, name)}
        {subtitle != null && subtitle !== false && <p className={styles.subtitle}>{subtitle}</p>}
        {meta != null && meta !== false && <div className={styles.meta}>{meta}</div>}
      </div>
      {actions != null && actions !== false && <div className={styles.actions}>{actions}</div>}
    </header>
  );
});
