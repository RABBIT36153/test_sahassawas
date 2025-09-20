<template>
  <div class="container my-4">
    <h1>สร้างหมวดหมู่ใหม่</h1>

    <!-- Error message -->
    <div v-if="errorMsg" class="alert alert-danger">
      {{ errorMsg }}
    </div>

    <!-- Form -->
    <form @submit.prevent="submitCategory">
      <div class="mb-3">
        <label for="name" class="form-label">ชื่อหมวดหมู่</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">คำอธิบาย</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-control"
          rows="3"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'กำลังบันทึก...' : 'สร้างหมวดหมู่' }}
      </button>
       <nuxt-link class="btn btn-dark" to="/category">ย้อนกลับ</nuxt-link>
    </form>

    <!-- Success message -->
    <div v-if="successMsg" class="alert alert-success mt-3">
      {{ successMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const config = useRuntimeConfig();

const form = ref({
  name: "",
  description: ""
});

const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const submitCategory = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  loading.value = true;

  try {
    const res = await fetch(`${config.public.API_BASE}/category/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value)
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.value = data.message || "เกิดข้อผิดพลาดในการสร้างหมวดหมู่";
      return;
    }

    successMsg.value = "สร้างหมวดหมู่สำเร็จ!";
    // รีเซ็ตฟอร์ม
    form.value = { name: "", description: "" };
  } catch (err) {
    errorMsg.value = "เกิดข้อผิดพลาด: " + err.message;
  } finally {
    loading.value = false;
  }
};
</script>



