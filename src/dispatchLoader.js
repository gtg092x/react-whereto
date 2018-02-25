const dispatchLoader =
  dispatcher =>
    dispatch =>
      location =>
        dispatcher
          .getThunkForValidRoutes(location)(dispatch);

export default dispatchLoader;
