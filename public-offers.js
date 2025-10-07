  const { createApp, ref, onMounted } = Vue

  createApp({
    setup() {
      
      const products = ref([])
      
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            "https://z5fp7xmfuwwaqhzckxqjcffx4a0pnare.lambda-url.eu-west-2.on.aws/api/plan/paginated/records?limit=15&sortBy=ASCENDING&sortByField=ISIN"
          )
          const data = await res.json()

          console.log("API Response:", data)
          
          products.value = data.body?.data || []
          
        } catch (error) {
          console.error("Error fetching products:", error)
        }
        
        
      }

      onMounted(() => {
      	
        fetchProducts()
      })
      
      return {
        products
      }
    }
  }).mount('#app')