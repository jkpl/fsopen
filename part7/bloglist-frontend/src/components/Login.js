import React from 'react'

const Login = ({ handleLogin, state }) => (
  <form onSubmit={handleLogin}>
    <div>
      username:
      <input
        type="text"
        value={state.username}
        name="Username"
        onChange={(e) => state.setUsername(e.target.value)}
      />
    </div>
    <div>
      password:
      <input
        type="password"
        value={state.password}
        name="Password"
        onChange={(e) => state.setPassword(e.target.value)}
      />
    </div>
    <button id="loginsubmit" type="submit">login</button>
  </form>
)

export default Login
