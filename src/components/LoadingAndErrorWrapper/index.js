import React from 'react';

export default function LoadingAndErrorWrapper({
  isLoading,
  renderIsLoading,
  isError,
  renderIsError,
  children,
}) {
  if (isLoading) {
    return <React.Fragment>{renderIsLoading}</React.Fragment>;
  }

  if (isError) {
    return <React.Fragment>{renderIsError}</React.Fragment>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
