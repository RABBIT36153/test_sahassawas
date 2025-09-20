<template>
  <div class="container my-4">
    <h1 class="mb-4">รายการหมวดหมู่สินค้า</h1>

    <div class="mb-3 d-flex">
      <input v-model="keyword" type="text" class="form-control me-2" placeholder="ค้นหาหมวดหมู่"
        @keyup.enter="fetchCategorys(1)" />
      <button class="btn btn-primary" @click="fetchCategorys(1)">ค้นหา</button>
      <nuxt-link class="btn btn-success ms-2" to="/category/create">ADD</nuxt-link>
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

    <!-- Category Table -->
    <div v-else>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ชื่อหมวดหมู่</th>
            <th>คำอธิบาย</th>
            <th>ใช้งาน</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categorys" :key="cat._id">
            <td>{{ cat.name }}</td>
            <td>{{ cat.description || '-' }}</td>
            <td>{{ cat.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน' }}</td>
            <td>
              <nuxt-link :to="`/category/edit/${cat._id}`" class="btn btn-warning btn-sm">
                แก้ไข
              </nuxt-link>
              <button class="btn btn-danger btn-sm" @click="deleteCategory(cat._id)">ลบ</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li :class="['page-item', { disabled: page === 1 }]">
            <button class="page-link" @click="fetchCategorys(page - 1)" :disabled="page === 1">ก่อนหน้า</button>
          </li>
          <li v-for="p in totalPages" :key="p" :class="['page-item', { active: p === page }]">
            <button class="page-link" @click="fetchCategorys(p)">{{ p }}</button>
          </li>
          <li :class="['page-item', { disabled: page === totalPages }]">
            <button class="page-link" @click="fetchCategorys(page + 1)" :disabled="page === totalPages">ถัดไป</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()
const categorys = ref([])
const loading = ref(false)
const errorMsg = ref("")
const keyword = ref("")

// Pagination
const page = ref(1)
const limit = ref(5)
const totalPages = ref(1)


// โหลดข้อมูลหมวดหมู่
const fetchCategorys = async (p = 1) => {
  page.value = p
  loading.value = true
  errorMsg.value = ""

  try {
    const query = new URLSearchParams({
      keyword: keyword.value,
      page: page.value,
      limit: limit.value
    }).toString()

    const { data, error } = await useFetch(`${config.public.API_BASE}/category?${query}`)
    if (error.value) {
      errorMsg.value = error.value?.data?.message || "ไม่สามารถโหลดข้อมูลหมวดหมู่ได้"
      return
    }

    categorys.value = data.value?.categorys || []
    totalPages.value = data.value?.totalPages || 1
  } catch (err) {
    errorMsg.value = "เกิดข้อผิดพลาด: " + err.message
  } finally {
    loading.value = false
  }
}

// ฟังก์ชันลบหมวดหมู่
const deleteCategory = async (id) => {
  const confirmed = confirm("คุณต้องการลบหมวดหมู่นี้หรือไม่?")
  if (!confirmed) return

  try {
    // ลบหมวดหมู่
    const { error } = await useFetch(`${config.public.API_BASE}/category/${id}`, {
      method: "DELETE"
    })

    if (error.value) {
      alert("เกิดข้อผิดพลาดในการลบ: " + error.value.message)
      return
    }

    // อัปเดตรายการในฝั่ง client ทันที
    categorys.value = categorys.value.filter(cat => cat._id !== id)
    alert("ลบหมวดหมู่เรียบร้อยแล้ว")
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message)
  }
}

// เรียกครั้งแรก
fetchCategorys()
</script>


<style scoped>
.container {
  max-width: 1200px;
}
</style>
