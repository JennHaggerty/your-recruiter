import { z } from 'zod';
const UserChangeEmailType = z.object({
  email: z.string({
    invalid_type_error: 'Please enter an email address.',
  }),
});
export default UserChangeEmailType;
