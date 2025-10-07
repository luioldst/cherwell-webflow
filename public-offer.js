const { createApp, ref, onMounted } = Vue

  createApp({
    setup() {
      
      const product = ref({})
      
      const getPlanIdQueryParam = () => {
      	const params = new URLSearchParams(window.location.search);
        
        return params.get('i');
      }
      
      const fetchProduct = async () => {
        try {
          const res = await fetch(
            `https://z5fp7xmfuwwaqhzckxqjcffx4a0pnare.lambda-url.eu-west-2.on.aws/api/plan/${getPlanIdQueryParam()}`
          )
          const data = await res.json()

          console.log("API Response:", data)
          
          product.value = data.body || {}
          
          console.log(data.body)
          
        } catch (error) {
          console.error("Error fetching products:", error)
        } 
      }
      
      const fetdDoc = async () => {
      	try {
        	const res = await fetch (
          	`{{plan-api-service-url}}/brochure/download-url?key=documents/PLAN123/brochures/test.pdf&mimeType=application/pdf&expiration=3600`
          )
        }
      }

      onMounted(() => {
        fetchProduct()
      })
      
      return {
        product
      }
    }
  }).mount('#app')