<template>

    <div class="d-flex">
        <nav class="nav flex-column bg-light p-3 vh-100" style="width: 200px; text-align: center;">
            <div style="padding-top: 20px; padding-bottom: 20px;">LOGO</div>
            <nuxt-link class="nav-link active" aria-current="page" to="/products">รายการสินค้า</nuxt-link>
            <nuxt-link class="nav-link active" aria-current="page" to="/category">หมวดหมู่</nuxt-link>
            <a class="nav-link" href="#">Link 2</a>
            <!-- <div class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
          aria-expanded="false">Dropdown</a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
      </div>
      <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a> -->
        </nav>

        <div class="flex-grow-1 p-3">
            <slot />
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>