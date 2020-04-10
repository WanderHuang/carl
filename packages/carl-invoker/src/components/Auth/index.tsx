import React from 'react';

export type AuthFunction = () => boolean;

export type AuthProps = {
  auth: boolean | AuthFunction;
}

const Auth: React.FC<AuthProps> = (props) => {
  const { auth } = props;
  const bool = typeof auth === 'function' ? auth() : auth;

  return (
    <>
      {
        bool
        ? props.children
        : null
      }
    </>
  )

}

export default Auth;
