<template>
  <div class="container my-4">
    <h1>แก้ไขบริการ</h1>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <form v-if="!loading && formLoaded" @submit.prevent="submitService">
      <div class="mb-3">
        <label class="form-label">ชื่อบริการ</label>
        <input type="text" v-model="form.name" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">คำอธิบาย</label>
        <textarea v-model="form.description" class="form-control" rows="3"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">ราคา</label>
        <input type="number" v-model.number="form.price" class="form-control" required />
      </div>

      <div class="mb-3">
        <label for="duration" class="form-label">ระยะเวลา</label>
        <input type="text" id="duration" v-model.number="form.duration" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">สกุลเงิน</label>
        <select v-model="form.currency" class="form-select">
          <option value="THB">THB</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">หมวดหมู่</label>
        <select v-model="form.category" class="form-select">

          <option v-for="cat in categorys" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">รูปภาพ (ถ้ามี)</label>
        <input type="file" @change="onFileChange" class="form-control" />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="submitting">
        {{ submitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข" }}
      </button>
      <nuxt-link class="btn btn-dark" to="/services">ย้อนกลับ</nuxt-link>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const config = useRuntimeConfig();
const route = useRoute();

const productId = route.params.id;

const form = ref({
  name: "",
  description: "",
  price: null,
  duration: "",
  currency: "THB",
  category: "",
  image: null
});

const loading = ref(true);
const submitting = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const formLoaded = ref(false);
const categorys = ref([])

const fetchCategorys = async () => {
  try {
    const { data } = await useFetch(`${config.public.API_BASE}/category`)
    categorys.value = data.value?.categorys || []
  } catch (err) {
    console.error("ไม่สามารถโหลดหมวดหมู่ได้", err)
  }
}

// โหลดข้อมูลบริการเดิม
const fetchServices = async () => {
  try {
    const { data, error } = await useFetch(`${config.public.API_BASE}/services/${productId}`);
    if (error.value) {
      errorMsg.value = error.value?.message || "ไม่สามารถโหลดข้อมูลบริการได้";
      return;
    }
    const list = data.value;
    form.value.name = list.name;
    form.value.description = list.description;
    form.value.price = list.price;
    form.value.duration = list.duration;
    form.value.currency = list.currency;
    form.value.category = list.category || "";
    formLoaded.value = true;
  } catch (err) {
    errorMsg.value = "เกิดข้อผิดพลาด: " + err.message;
  } finally {
    loading.value = false;
  }
};

const onFileChange = (e) => {
  form.value.image = e.target.files[0];
};

// ส่งข้อมูลอัปเดต
const submitService = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  submitting.value = true;

  try {
    const payload = {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      duration: form.value.duration, 
      currency: form.value.currency,
      category: form.value.category 
    };

    const { error } = await useFetch(`${config.public.API_BASE}/services/${productId}`, {
      method: "PUT",
      body: payload
    });

    if (error.value) {
      errorMsg.value = error.value?.message || "เกิดข้อผิดพลาดในการแก้ไขบริการ";
    } else {
      successMsg.value = "แก้ไขบริการสำเร็จ!";
      // router.push("/products") // ถ้าต้องการกลับไปหน้า list
    }
  } catch (err) {
    errorMsg.value = "เกิดข้อผิดพลาด: " + err.message;
  } finally {
    submitting.value = false;
  }
};

// เรียกใช้เมื่อ mount
onMounted(async () => {
  await fetchCategorys();
  await fetchServices();
});
</script>
