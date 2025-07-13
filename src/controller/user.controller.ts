import { Request, Response } from 'express';
import { CreateUserInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserById } from '../service/user.service';
import sendEmail from '../utils/mailer';

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      subject: 'Please verify your account',
      text: `Verification code ${user.verificationCode}. Id: ${user._id}`,
    });

    return res.send('User successfully created');
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send('Account already exists');
    }
    return res.status(500).send(e);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // Find the user by id
  const user = await findUserById(id);

  if (!user) {
    return res.send('Could not verify user');
  }

  // Check to see if they are already verified
  if (user.verified) {
    res.send('User is already verified');
  }

  // Check to see if the verification code matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return res.send('User successfully verified');
  }

  return res.send('Could not verified user');
}
