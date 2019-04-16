export const reducerMessage = (state, action) => {
  switch (action.type) {
    case 'success':
      return {
        isSuccess: true,
        isError: false,
        content: action.payload,
      };
    case 'error':
      return {
        isError: true,
        isSuccess: false,
        content: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
