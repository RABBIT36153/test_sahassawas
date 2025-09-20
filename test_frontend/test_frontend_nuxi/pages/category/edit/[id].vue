<template>
  <div class="container my-4">
    <h1>แก้ไขหมวดหมู่</h1>

    <!-- Error message -->
    <div v-if="errorMsg" class="alert alert-danger">
      {{ errorMsg }}
    </div>

    <!-- Success message -->
    <div v-if="successMsg" class="alert alert-success">
      {{ successMsg }}
    </div>

    <!-- Form -->
    <form v-if="formLoaded" @submit.prevent="updateCategory">
      <div class="mb-3">
        <label for="name" class="form-label">ชื่อหมวดหมู่</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          class="form-control"
          placeholder="กรอกชื่อหมวดหมู่"
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
          placeholder="กรอกคำอธิบาย (ถ้ามี)"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข" }}
      </button>
      <nuxt-link class="btn btn-dark ms-2" to="/category">ย้อนกลับ</nuxt-link>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const config = useRuntimeConfig();
const route = useRoute();
const categoryId = route.params.id;

const form = ref({
  name: "",
  description: ""
});

const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const formLoaded = ref(false);

// โหลดข้อมูลหมวดหมู่เดิม
const fetchCategory = async () => {
  try {
    const { data, error } = await useFetch(`${config.public.API_BASE}/category/${categoryId}`);
    if (error.value) {
      errorMsg.value = error.value?.data?.message || "ไม่สามารถโหลดข้อมูลหมวดหมู่ได้";
      return;
    }

    form.value.name = data.value?.name || "";
    form.value.description = data.value?.description || "";
    formLoaded.value = true;
  } catch (err) {
    errorMsg.value = "เกิดข้อผิดพลาด: " + err.message;
  }
};

// ส่งข้อมูลแก้ไขไป backend
const updateCategory = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  loading.value = true;

  try {
    const { error } = await useFetch(`${config.public.API_BASE}/category/${categoryId}`, {
      method: "PUT",
      body: form.value
    });

    if (error.value) {
      errorMsg.value = error.value?.data?.message || "เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่";
    } else {
      successMsg.value = "แก้ไขหมวดหมู่สำเร็จ!";
    }
  } catch (err) {
    errorMsg.value = "เกิดข้อผิดพลาด: " + err.message;
  } finally {
    loading.value = false;
  }
};

// เรียกเมื่อ mount
onMounted(() => {
  fetchCategory();
});
</script>

<style scoped>
.container {
  max-width: 700px;
}
</style>
