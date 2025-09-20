<template>
  <div class="container my-4">
    <h1 class="mb-4">รายการสินค้า</h1>

    <div class="mb-3 d-flex">
      <input
        v-model="keyword"
        type="text"
        class="form-control me-2"
        placeholder="ค้นหาสินค้า"
        @keyup.enter="fetchProducts(1)"
      />
      <button class="btn btn-primary" @click="fetchProducts(1)">ค้นหา</button>
      <nuxt-link class="btn btn-success ms-2" to="/products/create">ADD</nuxt-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="errorMsg" class="alert alert-danger">
      เกิดข้อผิดพลาด: {{ errorMsg }}
    </div>

    <!-- Products -->
    <div v-else class="row">
      <div v-for="product in products" :key="product._id" class="col-md-4 mb-4">
        <div class="card h-100">
          <img v-if="product.images && product.images.length" :src="product.images[0]" class="card-img-top"
            alt="product image" />
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text text-truncate">{{ product.description || '-' }}</p>
            <p class="fw-bold text-success">{{ product.price || 0 }} {{ product.currency || '-' }}</p>
               <p class="fw-bold text-success">{{ product.categoryInfo?.name || '-'}} {{ product.categoryInfo?.description || '-'}} </p>
          </div>
          <div class="card-footer text-center">
            <nuxt-link :to="`/products/edit/${product._id}`" class="btn btn-warning btn-sm">
              แก้ไข
            </nuxt-link>
            <button class="btn btn-danger btn-sm" @click="deleteProduct(product._id)">ลบ</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages >= 1" aria-label="Page navigation" class="mt-3">
      <ul class="pagination justify-content-center">
        <li :class="['page-item', { disabled: page === 1 }]">
          <button class="page-link" @click="fetchProducts(page - 1)">ก่อนหน้า</button>
        </li>
        <li
          v-for="p in totalPages"
          :key="p"
          :class="['page-item', { active: p === page }]"
        >
          <button class="page-link" @click="fetchProducts(p)">{{ p }}</button>
        </li>
        <li :class="['page-item', { disabled: page === totalPages }]">
          <button class="page-link" @click="fetchProducts(page + 1)">ถัดไป</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()

const products = ref([])
const loading = ref(false)
const errorMsg = ref("")

// Pagination
const page = ref(1)
const limit = ref(6) // จำนวนสินค้า/หน้า
const totalPages = ref(1)
const keyword = ref("")

// ฟังก์ชันโหลดสินค้า
const fetchProducts = async (p = 1) => {
  page.value = p
  loading.value = true
  errorMsg.value = ""

  try {
    const query = new URLSearchParams({
      keyword: keyword.value,
      page: page.value,
      limit: limit.value
    }).toString()

    const res = await fetch(`${config.public.API_BASE}/products?${query}`)
    if (!res.ok) throw new Error("ไม่สามารถโหลดสินค้าได้")
    const data = await res.json()
    products.value = data.products || []
    totalPages.value = data.totalPages || 1
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

// ฟังก์ชันลบสินค้า
const deleteProduct = async (id) => {
  const confirmed = confirm("คุณต้องการลบสินค้านี้หรือไม่?")
  if (!confirmed) return

  loading.value = true
  try {
    const res = await fetch(`${config.public.API_BASE}/products/${id}`, {
      method: "DELETE"
    })
    if (!res.ok) throw new Error("ลบสินค้าไม่สำเร็จ")
    alert("ลบสินค้าเรียบร้อยแล้ว")
    await fetchProducts(page.value)
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

// โหลดครั้งแรก
fetchProducts()
</script>

<style scoped>
.card-text {
  min-height: 3rem;
}
</style>
