export default (socketNamespace: any, callBackFunc: any) => async (request: any, response: any, next: any) => {
   console.log("hi");
   
  try {
      await callBackFunc(socketNamespace, request, response, next);
    } catch (error) {
      return next(error);
    }
  };
  
  