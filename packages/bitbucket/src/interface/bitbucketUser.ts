import type { BitbucketUserLinks } from './bitbucketUserLinks.js';

export interface BitbucketUser {
  name: string;
  emailAddress: string;
  active: boolean;
  displayName: string;
  id: number;
  slug: string;
  type: string;
  links: BitbucketUserLinks;
}
