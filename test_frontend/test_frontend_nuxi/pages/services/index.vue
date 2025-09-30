<template>
  <div class="container my-4">
    <h1 class="mb-4">รายการบริการ</h1>

    <div class="mb-3 d-flex">
      <input v-model="keyword" type="text" class="form-control me-2" placeholder="ค้นหาสินค้า"
        @keyup.enter="fetchServices(1)" />
      <button class="btn btn-primary" @click="fetchServices(1)">ค้นหา</button>
      <nuxt-link class="btn btn-success ms-2" to="/services/create">ADD</nuxt-link>
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

    <!-- Service -->
    <div v-else class="row">
      <div v-for="service in services" :key="service._id" class="col-md-4 mb-4">
        <div class="card h-100">
          <img v-if="service.images && service.images.length" :src="service.images[0]" class="card-img-top"
            alt="service image" />
          <div class="card-body">
            <h5 class="card-title">{{ service.name }}</h5>
            <p class="card-text text-truncate">{{ service.description || '-' }}</p>
            <p class="fw-bold text-success">
              ราคาเริ่มต้น {{ service.price || 0 }} {{ service.currency || '-' }}
            </p>
            <p class="fw-bold text-info">
              หมวดหมู่: {{ service.categoryInfo?.name || '-' }}
              <small class="text-muted">{{ service.categoryInfo?.description || '' }}</small>
            </p>
            <p class="text-muted">ระยะเวลา: {{ service.duration || '-' }} นาที</p>
          </div>
          <div class="card-footer text-center">
            <nuxt-link :to="`/services/edit/${service._id}`" class="btn btn-warning btn-sm">
              แก้ไข
            </nuxt-link>
            <button class="btn btn-danger btn-sm" @click="deleteService(service._id)">ลบ</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Pagination -->
    <nav v-if="totalPages >= 1" aria-label="Page navigation" class="mt-3">
      <ul class="pagination justify-content-center">
        <li :class="['page-item', { disabled: page === 1 }]">
          <button class="page-link" @click="fetchServices(page - 1)">ก่อนหน้า</button>
        </li>
        <li v-for="p in totalPages" :key="p" :class="['page-item', { active: p === page }]">
          <button class="page-link" @click="fetchServices(p)">{{ p }}</button>
        </li>
        <li :class="['page-item', { disabled: page === totalPages }]">
          <button class="page-link" @click="fetchServices(page + 1)">ถัดไป</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()

const services = ref([])
const loading = ref(false)
const errorMsg = ref("")

// Pagination
const page = ref(1)
const limit = ref(6) // จำนวนสินค้า/หน้า
const totalPages = ref(1)
const keyword = ref("")

// ฟังก์ชันโหลดสินค้า
const fetchServices = async (p = 1) => {
  page.value = p
  loading.value = true
  errorMsg.value = ""

  try {
    const query = new URLSearchParams({
      keyword: keyword.value,
      page: page.value,
      limit: limit.value
    }).toString()

    const res = await fetch(`${config.public.API_BASE}/services?${query}`)
    if (!res.ok) throw new Error("ไม่สามารถโหลดสินค้าได้")
    const data = await res.json()
    services.value = data.services || []
    totalPages.value = data.totalPages || 1
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

// ฟังก์ชันลบสินค้า
const deleteService = async (id) => {
  const confirmed = confirm("คุณต้องการลบสินค้านี้หรือไม่?")
  if (!confirmed) return

  loading.value = true
  try {
    const res = await fetch(`${config.public.API_BASE}/services/${id}`, {
      method: "DELETE"
    })
    if (!res.ok) throw new Error("ลบสินค้าไม่สำเร็จ")
    alert("ลบสินค้าเรียบร้อยแล้ว")
    await fetchServices(page.value)
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

// โหลดครั้งแรก
fetchServices()
</script>

<style scoped>
.card-text {
  min-height: 3rem;
}
</style>
