const { createApp, ref, onMounted, watch } = Vue

  createApp({
    setup() {
    
      let items = [12, 13, 14, 15, 16]
      let open = ref('');
      const toggleAccordion = (product_id) => {
        open.value = (open.value == product_id) ? '' : product_id;
        console.log(open.value, product_id, open.value==product_id);
      }

      let endpoint = (limit, planName, isin, keyword) => {

        let searchBy = planName ? planName : isin;


        let api = `https://z5fp7xmfuwwaqhzckxqjcffx4a0pnare.lambda-url.eu-west-2.on.aws/api/plan/paginated/records?limit=${limit}&sortBy=ASCENDING&sortByField=ISIN`;

        return api;
      }

      const products = ref([]);
      const limit = ref(10);
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            endpoint(limit.value)
          )
          const data = await res.json()
          products.value = data.body?.data || []
          
        } catch (error) {
          console.error("Error fetching products:", error)
        }
      }
      
      const searchProducts = async () => {
        try {
          const res = await fetch(
            endpoint(limit.value)
          )
          const data = await res.json()
          products.value = data.body?.data || []
          
        } catch (error) {
          console.error("Error fetching products:", error)
        }
      }



      onMounted(() => {
        fetchProducts()
      })
      
      return {
        open,
        products,
        limit,
        toggleAccordion,
        searchProducts
      }
    }
  }).mount('#app')