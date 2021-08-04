import { useState, useRef } from 'react';
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'

import classes from './auth-form.module.css';

async function createUser(email, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({email, password}),
    headers: {'Content-Type': 'application/json'}
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error( data.message)
  }

  return data
}

function AuthForm() {

  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter()

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault()
    const userEmail = emailInputRef.current.value
    const userPassword = passwordInputRef.current.value

    // optional : add validation

    if (isLogin) {
      // log user in
      const result = await signIn('credentials', {
        redirect: false,
        email: userEmail,
        password: userPassword
      })
      console.log(result)

      if (!result.error) {
        // set auth state
        // window.location.href resets the entire application nd lose all state
        // We can use useRouter replace method
        router.replace('/profile')
      }

    } else {
      try {
        const result = await createUser(userEmail, userPassword)
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
