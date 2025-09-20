<template>
  <div class="container my-4">
    <h1>สร้างสินค้าใหม่</h1>

    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <form @submit.prevent="submitProduct">
      <div class="mb-3">
        <label for="name" class="form-label">ชื่อสินค้า</label>
        <input type="text" id="name" v-model="form.name" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">คำอธิบาย</label>
        <textarea id="description" v-model="form.description" class="form-control" rows="3"></textarea>
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">ราคา</label>
        <input type="number" id="price" v-model.number="form.price" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="currency" class="form-label">สกุลเงิน</label>
        <select id="currency" v-model="form.currency" class="form-select" required>
          <option value="THB">THB</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">หมวดหมู่</label>
        <select v-model="form.categoryId" class="form-select" required>
          <option value="" disabled>-- เลือกหมวดหมู่ --</option>
          <option v-for="cat in categorys" :key="cat._id" :value="cat._id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'กำลังบันทึก...' : 'สร้างสินค้า' }}
      </button>
      <nuxt-link class="btn btn-dark ms-2" to="/products">ย้อนกลับ</nuxt-link>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const config = useRuntimeConfig();

const form = ref({
  name: "",
  description: "",
  price: null,
  currency: "THB",
  categoryId: ""
});

const categorys = ref([]);
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const fetchCategorys = async () => {
  try {
    const { data, error } = await useFetch(`${config.public.API_BASE}/category`);
    if (error.value) {
      console.error("Fetch categorys error:", error.value);
      return;
    }
    console.log("Fetched categories:", data.value);
    categorys.value = data.value?.categorys || [];
  } catch (err) {
    console.error("Fetch categorys error:", err);
  }
};

const submitProduct = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  loading.value = true;

  try {
    const res = await fetch(`${config.public.API_BASE}/products/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form.value,
        category: form.value.categoryId // ส่ง _id ของ category ไป backend
      })
    });

    const data = await res.json();
    if (!res.ok) {
      errorMsg.value = data.message || "เกิดข้อผิดพลาดในการสร้างสินค้า";
      return;
    }

    successMsg.value = "สร้างสินค้าสำเร็จ!";
    form.value = { name: "", description: "", price: null, currency: "THB", categoryId: "" };
  } catch (err) {
    errorMsg.value = "เกิดข้อผิดพลาด: " + err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategorys();
});
</script>
