<template>
  <div class="container my-4">
    <h1>แก้ไขสินค้า</h1>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <form v-if="!loading && formLoaded" @submit.prevent="submitProduct">
      <div class="mb-3">
        <label class="form-label">ชื่อสินค้า</label>
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
      <nuxt-link class="btn btn-dark" to="/products">ย้อนกลับ</nuxt-link>
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

// โหลดข้อมูลสินค้าเดิม
const fetchProduct = async () => {
  try {
    const { data, error } = await useFetch(`${config.public.API_BASE}/products/${productId}`);
    if (error.value) {
      errorMsg.value = error.value?.message || "ไม่สามารถโหลดข้อมูลสินค้าได้";
      return;
    }
    const p = data.value;
    form.value.name = p.name;
    form.value.description = p.description;
    form.value.price = p.price;
    form.value.currency = p.currency;
    form.value.category = p.category || "";
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
const submitProduct = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  submitting.value = true;

  try {
    const payload = {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      currency: form.value.currency,
      category: form.value.category // หรือ categoryId ถ้า backend ต้องการ
    };

    const { error } = await useFetch(`${config.public.API_BASE}/products/${productId}`, {
      method: "PUT",
      body: payload
    });

    if (error.value) {
      errorMsg.value = error.value?.message || "เกิดข้อผิดพลาดในการแก้ไขสินค้า";
    } else {
      successMsg.value = "แก้ไขสินค้าสำเร็จ!";
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
  await fetchProduct();
});
</script>
