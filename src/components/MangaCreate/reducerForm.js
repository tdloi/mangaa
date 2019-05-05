export const reducerForm = (state, action) => {
  switch (action.type) {
    case 'reset':
      return {
        title: '',
        alt_titles: '',
        description: '',
        tags: '',
        authors: '',
      };
    default:
      return {
        ...state,
        [action.field]: action.value,
      };
  }
};
