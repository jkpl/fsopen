import React from 'react'

const UserDetails = ({ handleLogout, user }) => (
  <div>
    Welcome {user.name}! <button onClick={handleLogout}>logout</button>
  </div>
)

export default UserDetails
