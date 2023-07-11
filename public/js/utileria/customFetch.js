 async function customFetch(url, options) {



    try {
      const response = await fetch(url,options);
      console.log(response)
      if(response.status == 401){
        location.href = "/login.html";
      }
      if(response.status == 409){
        console.log(response)
        return {
          status:response.status
        }
      }
      
      if (response.status != 200 && response.status != 201 && response.status != 204) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if(options.method != 'DELETE'){
        const data = await response.json();
      return data;
      }
    } catch (error) {
      console.log(error)
      return error;
    }
  }
export default customFetch;