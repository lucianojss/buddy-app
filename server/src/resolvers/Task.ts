import { TaskResolvers } from '../generated/schema-types';

const __resolveType: TaskResolvers['__resolveType'] = user => {
  const newbieUniqueProps = ['notes'];

  if (newbieUniqueProps.some(prop => user.hasOwnProperty(prop))) {
    return 'NewbieTask';
  }

  return 'BuddyTask';
};

const taskResolvers: TaskResolvers = {
  __resolveType,
};

export default taskResolvers;
