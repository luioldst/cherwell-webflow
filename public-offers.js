const { createApp, ref, onMounted } = Vue

  createApp({
    setup() {
      
      const products = ref([]);

      const $apiBase = `https://2ze36jo4itwg7543dk6ad5qj3e0qymvg.lambda-url.eu-west-2.on.aws/api`;
      const headers = {
              method: 'GET',
              headers: {
                'X-API-KEY': 'abb882de-f0df-4b2d-bd59-2ff41c9d5c6a'
              }
            }
      const loading = ref(false);
      const hasNextPage = ref(true)
      const cursorPointer = `%7B%22GSI1PK%22%3A%22PLAN%23PLAN_NAME%22%2C%22GSI1SK%22%3A%2210%2010%20PLAN%20-%20OPTION%201%20-%20MAY%202021%22%2C%22SK%22%3A%2201K5E68CBNPVNJ40DMESQNH7YD%22%2C%22PK%22%3A%22PLAN%22%7D`
      
      const fetchProducts = async (direction = '') => {
        
        if (direction) {

        }
        loading.value = true;
        try {
          const res = await fetch(
                `${$apiBase}/plan/paginated/records?limit=8&sortBy=DESCENDING&sortByField=START_DATE&issuance=UK public offer${direction ? `&nextCursorPointer=${cursorPointer}&direction=next`: ''}`,
          )
          const data = await res.json()
          
          products.value = [...products.value, ...data.body?.data || []];

          if (data.body['nextCursorPointer']) {
            hasNextPage.value = true;
          }

          initPhotoFetching();

          loading.value = false;

          
          
        } catch (error) {
          console.error("Error fetching products:", error)
          loading.value = false;
        }
        
        
      }

      const initPhotoFetching = () => {
        products.value.forEach((product, productIndex) => {
            fetchPhotos(productIndex)
        });
    }
      
      fetchPhotos = async (productIndex) => {

        let product = products.value[productIndex];

      	try {
        	const res = await fetch (
          		`${$apiBase}/plan/offer-photo/download-url?key=${product.offerPhotoS3Key}&mimeType=${product.offerPhotoS3MimeType}&expiration=3600`,
              headers
        )
            const data = await res.json();
            let offerPhoto = data.body;

            products.value[productIndex].offerPhoto = offerPhoto;

            console.log(products.value[productIndex]);
        } catch (error) {
          	console.error("Error fetching photo:", error)
        }
      }

      const onImageError = (e) => {
        e.target.src = 'https://cdn.prod.website-files.com/686ccb0fc9743adf844da54f/68e8e77c07502ea3bae82682_Document%20photo.webp' // your dummy image path
      }

      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
     };

      onMounted(() => {
      	
        fetchProducts()
      })
      
      return {
        products,
        onImageError,
        loading,
        hasNextPage,
        fetchProducts,
        formatDate
      }
    }
  }).mount('#app')