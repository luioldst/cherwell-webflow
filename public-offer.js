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

          fetchPhoto();
          
        } catch (error) {
          console.error("Error fetching products:", error)
        } 
      }

       let doc = doc ? 'true' : 'false';
      
      const fetchPhoto = async () => {
      	try {
        	const res = await fetch (
          	`https://z5fp7xmfuwwaqhzckxqjcffx4a0pnare.lambda-url.eu-west-2.on.aws/api/brochure/download-url?key=${product.value.offerPhotoS3Key}&mimeType=${product.value.offerPhotoS3MimeType}&expiration=3600`
          )

          const data = await res.json();
          console.log("API Response:", data)

        } catch (error) {
          	console.error("Error fetching doc:", error)
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