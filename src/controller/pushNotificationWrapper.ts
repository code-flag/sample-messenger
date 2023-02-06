export default (socketNamespace: any, callBackFunc: any) => async (request: any, response: any, next: any) => {
    try {
      await callBackFunc(socketNamespace, request, response, next);
    } catch (error) {
      return next(error);
    }
  };
  