import type { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body
    //await signIn('credentials', { email, password })
    console.log('login request', email)
 
    res.status(200).json({ success: true })
  } catch (error) {
      res.status(500).json({ error: 'Something went wrong, ' + error })
  }
}