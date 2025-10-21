const { createApp, ref, onMounted } = Vue

  createApp({
    setup() {
      
      const product = ref({})
      
      const getPlanIdQueryParam = () => {
      	const params = new URLSearchParams(window.location.search);
        
        return params.get('i');
      }

      const apiBase = `https://z5fp7xmfuwwaqhzckxqjcffx4a0pnare.lambda-url.eu-west-2.on.aws/api`;
      const headers = {
              method: 'GET',
              headers: {
                'X-API-KEY': 'abb882de-f0df-4b2d-bd59-2ff41c9d5c6a'
              }
            }

      const loading = ref(false);
      const loadingDoc = ref(false);
      
      const fetchProduct = async () => {
        loading.value = true;
        try {
          const res = await fetch(
            `${apiBase}/plan/${getPlanIdQueryParam()}`,
            headers
          )
          const data = await res.json()

          console.log("API Response:", data)
          
          product.value = data.body || {}

          fetchDocs('adviser-guide');
          fetchDocs('key-information-document');
          fetchDocs('document');
          fetchDocs('brochure');
          fetchPhoto();
          loading.value = false;
          
          
        } catch (error) {
          console.error("Error fetching products:", error)
          loading.value = false;
        } 
      }

      
      const docs = ref([]);
      const fetchDocs = async (docType) => {
        loadingDoc.value = true;
      	try {
        	const res = await fetch (
          	`${apiBase}/${docType}/plan/${product.value.planId}`,
          	// `https://z5fp7xmfuwwaqhzckxqjcffx4a0pnare.lambda-url.eu-west-2.on.aws/api/${docType}/plan/{planId}?key=${product.value.offerPhotoS3Key}&mimeType=${product.value.offerPhotoS3MimeType}&expiration=3600`,
            headers
          )

          const data = await res.json();
          console.log(`${docType} API Response:`, data);

          let files = [];
          data.body.forEach(item => {
            item.filename = item.fileDetails.key.split('/').pop();
            item.id = item['brochureId'] ? item['brochureId'] : item['documentId'];
            item.type = docType;
            files.push(item);

          })

          docs.value.push(...files);
          //offerPhoto.value = data.body;

          fetchPhoto();

          console.log(docs.value);
          loadingDoc.value = false;

        } catch (error) {
          	console.error("Error fetching doc:", error);
            loadingDoc.value = false;
        }
      }

      const offerPhoto = ref('');
      fetchPhoto = async () => {
      	try {
        	const res = await fetch (
          		`${apiBase}/plan/offer-photo/download-url?key=${product.value.offerPhotoS3Key}&mimeType=${product.value.offerPhotoS3MimeType}&expiration=3600`,
              headers
          )
          const data = await res.json();
          offerPhoto.value = data.body;

        } catch (error) {
          	console.error("Error fetching photo:", error)
        }
      }

      const initDownload = (id) => {
        	const doc = docs.value.find(d => d.id === id);
          
          const downloadDoc = async () => {
          	try {
            	const res = await fetch (
              		// `${apiBase}/${doc.type}/plan/${doc.planId}?key=${doc.fileDetails.key}&mimeType=${doc.fileDetails.mimeType}&expiration=10000`,
              		`${apiBase}/${doc.type}/download-url?key=${doc.fileDetails.key}&mimeType=${doc.fileDetails.mimeType}&expiration=10000`,
                  headers
              )
              const data = await res.json();
              window.location.href = data.body;
              // loading.value = false;
            } catch (error) {
              alert('There was an error downloading the document. Please try again.')
              // loading.value = false;
            }
          }

          downloadDoc()
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
        fetchProduct()
      })
      
      return {
        product,
        offerPhoto,
        docs,
        initDownload,
        loadingDoc,
        loading,
        onImageError,
        formatDate
        
      }
    }
  }).mount('#app')