// TODO(alishaevn): redo this page when the time comes
import { useSession, signIn, signOut } from 'next-auth/react'

const Login = () => {
  const { data: session } = useSession()
  console.log({session})
  if (session) {
    return (
      <div className='container'>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <div className='container'>
      <p className='mb-4'>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  )
}

export default Login
