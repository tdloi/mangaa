export const reducerForm = (state, action) => {
  switch (action.type) {
    case 'reset':
      return {
        title: '',
        vol: '',
        chapter: '',
      };
    default:
      return {
        ...state,
        [action.field]: action.value,
      };
  }
};
