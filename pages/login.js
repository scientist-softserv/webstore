// TODO(alishaevn): redo this page when the time comes
import { useSession, signIn, signOut } from "next-auth/react"
export default function Login() {
  const { data: session } = useSession()
  console.log({session})
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

// const Login = () => <h1>This is the login page.</h1>

// export default Login
