const { createApp, ref, onMounted, watch } = Vue

createApp({
  setup() {

    const $apiBase = `https://z5fp7xmfuwwaqhzckxqjcffx4a0pnare.lambda-url.eu-west-2.on.aws/api`;
    const headers = {
      method: 'GET',
      headers: {
        'X-API-KEY': 'abb882de-f0df-4b2d-bd59-2ff41c9d5c6a'
      }
    }
    const cursorPointer = `%7B%22GSI1PK%22%3A%22PLAN%23PLAN_NAME%22%2C%22GSI1SK%22%3A%2210%2010%20PLAN%20-%20OPTION%201%20-%20MAY%202021%22%2C%22SK%22%3A%2201K5E68CBNPVNJ40DMESQNH7YD%22%2C%22PK%22%3A%22PLAN%22%7D`
    const keyword = ref('');
    const searchBy = ref('PLAN_NAME');
    const loading = ref(false);
    const open = ref('');
    const limit = ref(10);
    const products = ref([]);
    const hasNextPage = ref(true)
    const hasPreviousPage = ref(false)

    const toggleAccordion = (product_id) => {
      open.value = (open.value === product_id) ? '' : product_id;
    }

    const endpoint = (direction, sortByField, sortOrder, hasCursor = false) => {
      const searchKey = searchBy.value === 'PLAN_NAME' ? 'plan' : 'isin';
      


      return `${$apiBase}/plan/paginated/records?limit=${limit.value || 10}&sortBy=${sortOrder || 'ASCENDING'}&sortByField=${sortByField}&${searchKey}=${keyword.value || ''}&direction=${direction || ''}&issuance=UK private placement${hasCursor ? `&cursorPointer=${cursorPointer}` : ''}`;
    }

    const searchProducts = async (direction, sortByField, sortOrder, hasCursor) => {
      loading.value = true;
      try {
        const res = await fetch(endpoint(direction, sortByField, sortOrder, hasCursor), headers);
        const data = await res.json();
        products.value = data.body?.data || [];

        hasNextPage.value = data.body['nextCursorPointer'];
        hasPreviousPage.value = data.body['prevCursorPointer'];
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        loading.value = false;
      }
    }
    
    const nextPage = () => {
      searchProducts('next', 'START_DATE', 'DESCENDING', true);
    }

    const previousPage = () => {
      searchProducts('prev', 'START_DATE', 'DESCENDING', true);
    }

    const initSearch = () => {
      searchProducts('', 'START_DATE', 'DESCENDING');
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
      console.log('ON MOUNTED')
      searchProducts('', 'START_DATE', 'DESCENDING');
    });

    return {
      open,
      products,
      limit,
      toggleAccordion,
      searchProducts,
      keyword,
      searchBy,
      loading,
      nextPage,
      previousPage,
      hasPreviousPage,
      hasNextPage,
      initSearch,
      formatDate // expose it to template
    }
  }
}).mount('#app')
