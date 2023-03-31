// Log all requests
export default defineEventHandler(async (event) => {   
  console.log('request: ', event.node.req.method, ' ', event.node.req.url)  
})