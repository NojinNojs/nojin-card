import { parse } from 'yaml';
import { profileSchema } from './schema';
import raw from './profile.yaml?raw';

export const profile = profileSchema.parse(parse(raw));
export const channels = profile.channels.filter((c) => !c.hidden);
